/**
 * Registro de usuarios (FT-01).
 *
 * Solicita únicamente los datos justificados en la sección 5.2 del documento: nombre de usuario,
 * correo, contraseña con confirmación, región y comuna opcionales, y aceptación de términos.
 * No se piden RUT, dirección exacta, teléfono ni fecha de nacimiento (RNF-SEG-03).
 */
import {
  IonAlert,
  IonButton,
  IonCheckbox,
  IonContent,
  IonIcon,
  IonInput,
  IonNote,
  IonPage,
  IonRouterLink,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonText,
  useIonRouter,
} from '@ionic/react';
import { personAddOutline } from 'ionicons/icons';
import React, { useState } from 'react';
import EncabezadoPagina from '../components/EncabezadoPagina';
import { REGIONES } from '../data/catalogos';
import { useSesion } from '../context/SesionContext';
import { RUTAS } from '../routes/rutas';
import { correoValido } from '../utils/formato';

interface ErroresRegistro {
  nombreUsuario?: string;
  correo?: string;
  clave?: string;
  confirmacion?: string;
  terminos?: string;
}

const RegistroPage: React.FC = () => {
  const { registrar } = useSesion();
  const router = useIonRouter();

  const [nombreUsuario, setNombreUsuario] = useState('');
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [confirmacion, setConfirmacion] = useState('');
  const [region, setRegion] = useState('');
  const [comuna, setComuna] = useState('');
  const [terminos, setTerminos] = useState(false);

  const [errores, setErrores] = useState<ErroresRegistro>({});
  const [errorGeneral, setErrorGeneral] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [creada, setCreada] = useState(false);

  const comunasDisponibles = REGIONES.find((item) => item.nombre === region)?.comunas ?? [];

  const validar = (): boolean => {
    const encontrados: ErroresRegistro = {};

    if (nombreUsuario.trim().length < 3) {
      encontrados.nombreUsuario = 'Usa al menos 3 caracteres.';
    }

    if (!correo.trim()) {
      encontrados.correo = 'Ingresa tu correo electrónico.';
    } else if (!correoValido(correo)) {
      encontrados.correo = 'El formato del correo no es válido.';
    }

    if (clave.length < 6) {
      encontrados.clave = 'La contraseña debe tener al menos 6 caracteres.';
    } else if (!/[a-zA-Z]/.test(clave) || !/\d/.test(clave)) {
      encontrados.clave = 'Combina al menos una letra y un número.';
    }

    if (confirmacion !== clave) {
      encontrados.confirmacion = 'Las contraseñas no coinciden.';
    }

    if (!terminos) {
      encontrados.terminos = 'Debes aceptar los términos para crear la cuenta.';
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
      await registrar({
        nombreUsuario,
        correo,
        clave,
        region: region || undefined,
        comuna: comuna || undefined,
      });
      setCreada(true);
    } catch (error) {
      setErrorGeneral(error instanceof Error ? error.message : 'No fue posible crear la cuenta.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <IonPage>
      <EncabezadoPagina titulo="Crear cuenta" conVolver rutaVolver={RUTAS.login} />

      <IonContent>
        <div className="acceso">
          <div className="acceso__marca">
            <IonIcon icon={personAddOutline} aria-hidden="true" />
            <h1>Crear cuenta</h1>
            <IonText color="medium">
              <p>Solo pedimos los datos necesarios para usar la plataforma.</p>
            </IonText>
          </div>

          <form onSubmit={enviar} noValidate>
            <IonInput
              className={`ion-margin-bottom ${errores.nombreUsuario ? 'ion-invalid ion-touched' : ''}`}
              label="Nombre de usuario"
              labelPlacement="floating"
              fill="outline"
              value={nombreUsuario}
              helperText="Así te verán otras personas en la plataforma."
              errorText={errores.nombreUsuario}
              onIonInput={(evento) => setNombreUsuario(evento.detail.value ?? '')}
            />

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
              autocomplete="new-password"
              value={clave}
              helperText="Mínimo 6 caracteres, con letras y números."
              errorText={errores.clave}
              onIonInput={(evento) => setClave(evento.detail.value ?? '')}
            />

            <IonInput
              className={`ion-margin-bottom ${errores.confirmacion ? 'ion-invalid ion-touched' : ''}`}
              label="Repetir contraseña"
              labelPlacement="floating"
              fill="outline"
              type="password"
              autocomplete="new-password"
              value={confirmacion}
              errorText={errores.confirmacion}
              onIonInput={(evento) => setConfirmacion(evento.detail.value ?? '')}
            />

            <IonSelect
              className="ion-margin-bottom"
              label="Región (opcional)"
              labelPlacement="floating"
              fill="outline"
              placeholder="Selecciona una región"
              value={region}
              onIonChange={(evento) => {
                setRegion(evento.detail.value);
                setComuna('');
              }}
            >
              <IonSelectOption value="">Prefiero no indicarla</IonSelectOption>
              {REGIONES.map((item) => (
                <IonSelectOption key={item.nombre} value={item.nombre}>
                  {item.nombre}
                </IonSelectOption>
              ))}
            </IonSelect>

            <IonSelect
              className="ion-margin-bottom"
              label="Comuna (opcional)"
              labelPlacement="floating"
              fill="outline"
              placeholder={region ? 'Selecciona una comuna' : 'Primero elige una región'}
              disabled={comunasDisponibles.length === 0}
              value={comuna}
              onIonChange={(evento) => setComuna(evento.detail.value)}
            >
              {comunasDisponibles.map((item) => (
                <IonSelectOption key={item} value={item}>
                  {item}
                </IonSelectOption>
              ))}
            </IonSelect>

            <IonCheckbox
              className="ion-margin-top"
              labelPlacement="end"
              justify="start"
              checked={terminos}
              onIonChange={(evento) => setTerminos(evento.detail.checked)}
            >
              Acepto los términos de uso de la plataforma
            </IonCheckbox>

            {errores.terminos && (
              <IonText color="danger">
                <p className="nota" role="alert">
                  {errores.terminos}
                </p>
              </IonText>
            )}

            {errorGeneral && (
              <IonText color="danger">
                <p className="nota" role="alert">
                  {errorGeneral}
                </p>
              </IonText>
            )}

            <IonButton type="submit" expand="block" disabled={enviando} className="ion-margin-top">
              {enviando ? <IonSpinner name="crescent" /> : 'Crear cuenta'}
            </IonButton>
          </form>

          <IonNote>
            <p className="nota">
              No solicitamos RUT, dirección exacta ni teléfono: no son necesarios para las
              funcionalidades de esta entrega.
            </p>
          </IonNote>

          <div className="acceso__pie">
            <IonText color="medium">
              <span>¿Ya tienes cuenta? </span>
            </IonText>
            <IonRouterLink routerLink={RUTAS.login} routerDirection="back">
              Iniciar sesión
            </IonRouterLink>
          </div>
        </div>

        <IonAlert
          isOpen={creada}
          header="Cuenta creada"
          message={`¡Bienvenido/a, ${nombreUsuario}! Ya puedes publicar y seguir tus operaciones.`}
          buttons={[
            {
              text: 'Comenzar',
              handler: () => {
                setCreada(false);
                router.push(RUTAS.catalogo, 'root', 'replace');
              },
            },
          ]}
          onDidDismiss={() => setCreada(false)}
        />
      </IonContent>
    </IonPage>
  );
};

export default RegistroPage;
