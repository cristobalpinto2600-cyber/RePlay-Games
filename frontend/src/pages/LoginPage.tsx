/**
 * Inicio de sesión (FT-02).
 *
 * Valida los campos antes de enviar, informa errores comprensibles (RNF-UX-03) y, cuando se llega
 * desde una ruta protegida, vuelve a esa misma pantalla después de autenticarse (Task Flow 1).
 */
import {
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
  IonNote,
  IonPage,
  IonRouterLink,
  IonSpinner,
  IonText,
  useIonRouter,
} from '@ionic/react';
import { gameControllerOutline } from 'ionicons/icons';
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import EncabezadoPagina from '../components/EncabezadoPagina';
import { CUENTA_DEMO } from '../data/usuarios';
import { useSesion } from '../context/SesionContext';
import { RUTAS, destinoPendiente } from '../routes/rutas';
import { correoValido } from '../utils/formato';

interface ErroresLogin {
  correo?: string;
  clave?: string;
}

const LoginPage: React.FC = () => {
  const { iniciarSesion } = useSesion();
  const ubicacion = useLocation();
  const router = useIonRouter();

  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [errores, setErrores] = useState<ErroresLogin>({});
  const [errorGeneral, setErrorGeneral] = useState('');
  const [enviando, setEnviando] = useState(false);

  /** Ruta a la que se vuelve tras iniciar sesión; por defecto, el catálogo. */
  const pendiente = destinoPendiente(ubicacion.search);
  const destino = pendiente ?? RUTAS.catalogo;

  const validar = (): boolean => {
    const encontrados: ErroresLogin = {};

    if (!correo.trim()) {
      encontrados.correo = 'Ingresa tu correo electrónico.';
    } else if (!correoValido(correo)) {
      encontrados.correo = 'El formato del correo no es válido.';
    }

    if (!clave) {
      encontrados.clave = 'Ingresa tu contraseña.';
    } else if (clave.length < 6) {
      encontrados.clave = 'La contraseña debe tener al menos 6 caracteres.';
    }

    setErrores(encontrados);
    return Object.keys(encontrados).length === 0;
  };

  const enviar = async (evento: React.FormEvent) => {
    evento.preventDefault();
    setErrorGeneral('');

    if (!validar()) {
      return;
    }

    setEnviando(true);
    try {
      await iniciarSesion({ correo, clave });
      router.push(destino, 'root', 'replace');
    } catch (error) {
      setErrorGeneral(error instanceof Error ? error.message : 'No fue posible iniciar sesión.');
    } finally {
      setEnviando(false);
    }
  };

  const usarCuentaDemo = () => {
    setCorreo(CUENTA_DEMO.correo);
    setClave(CUENTA_DEMO.clave);
    setErrores({});
  };

  return (
    <IonPage>
      <EncabezadoPagina titulo="Iniciar sesión" conVolver />

      <IonContent>
        <div className="acceso">
          <div className="acceso__marca">
            <IonIcon icon={gameControllerOutline} aria-hidden="true" />
            <h1>RePlay Games</h1>
            <IonText color="medium">
              <p>Ingresa para publicar, comprar y seguir tus operaciones.</p>
            </IonText>
          </div>

          {pendiente && (
            <IonText color="primary">
              <p className="nota">
                Necesitas iniciar sesión para continuar. Te devolveremos a la página que intentabas
                abrir.
              </p>
            </IonText>
          )}

          <form onSubmit={enviar} noValidate>
            <IonInput
              className={`ion-margin-bottom ${errores.correo ? 'ion-invalid ion-touched' : ''}`}
              label="Correo electrónico"
              labelPlacement="floating"
              fill="outline"
              type="email"
              inputmode="email"
              autocomplete="email"
              value={correo}
              errorText={errores.correo}
              onIonInput={(evento) => setCorreo(evento.detail.value ?? '')}
            />

            <IonInput
              className={`ion-margin-bottom ${errores.clave ? 'ion-invalid ion-touched' : ''}`}
              label="Contraseña"
              labelPlacement="floating"
              fill="outline"
              type="password"
              autocomplete="current-password"
              value={clave}
              errorText={errores.clave}
              onIonInput={(evento) => setClave(evento.detail.value ?? '')}
            />

            {errorGeneral && (
              <IonText color="danger">
                <p className="nota" role="alert">
                  {errorGeneral}
                </p>
              </IonText>
            )}

            <IonButton type="submit" expand="block" disabled={enviando} className="ion-margin-top">
              {enviando ? <IonSpinner name="crescent" /> : 'Ingresar'}
            </IonButton>
          </form>

          <IonNote className="ion-margin-top">
            <p className="nota">
              Cuenta de prueba para esta entrega: <strong>{CUENTA_DEMO.correo}</strong> /{' '}
              <strong>{CUENTA_DEMO.clave}</strong>
            </p>
          </IonNote>

          <IonButton expand="block" fill="clear" size="small" onClick={usarCuentaDemo}>
            Completar con la cuenta de prueba
          </IonButton>

          <div className="acceso__pie">
            <IonText color="medium">
              <span>¿No tienes cuenta? </span>
            </IonText>
            <IonRouterLink routerLink={RUTAS.registro} routerDirection="forward">
              Crear una cuenta
            </IonRouterLink>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
