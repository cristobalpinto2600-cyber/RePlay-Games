/**
 * Administración de usuarios (FT-04, RNF-SEG-02). Ruta protegida del rol Administrador.
 *
 * Muestra las cuentas registradas y permite desactivarlas o reactivarlas. Una cuenta desactivada
 * no puede iniciar sesión y su token deja de ser aceptado por la API de inmediato. La acción pide
 * confirmación y el backend impide que la administración desactive su propia cuenta.
 */
import {
  IonBadge,
  IonButton,
  IonContent,
  IonPage,
  IonSkeletonText,
  IonText,
  IonToast,
  useIonAlert,
} from '@ionic/react';
import { cloudOfflineOutline, peopleOutline } from 'ionicons/icons';
import React, { useCallback, useEffect, useState } from 'react';
import EncabezadoPagina from '../components/EncabezadoPagina';
import MensajeVacio from '../components/MensajeVacio';
import { useSesion } from '../context/SesionContext';
import type { Usuario } from '../models';
import { mensajeDeError } from '../services/api';
import { cambiarEstadoUsuario, listarUsuarios } from '../services/usuariosService';
import { formatearFecha } from '../utils/formato';

const AdminUsuariosPage: React.FC = () => {
  const { usuario: sesion } = useSesion();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [aviso, setAviso] = useState('');
  const [actualizando, setActualizando] = useState<number | null>(null);
  const [presentarAlerta] = useIonAlert();

  const cargar = useCallback(async () => {
    setError('');
    try {
      setUsuarios(await listarUsuarios());
    } catch (causa) {
      setError(mensajeDeError(causa));
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  const cambiarEstado = async (usuario: Usuario, activo: boolean) => {
    setActualizando(usuario.id);
    try {
      const actualizado = await cambiarEstadoUsuario(usuario.id, activo);
      setUsuarios((actuales) => actuales.map((item) => (item.id === actualizado.id ? actualizado : item)));
      setAviso(`La cuenta de ${usuario.nombreUsuario} quedó ${activo ? 'activa' : 'desactivada'}.`);
    } catch (causa) {
      setAviso(mensajeDeError(causa, 'No fue posible cambiar el estado de la cuenta.'));
    } finally {
      setActualizando(null);
    }
  };

  const confirmar = (usuario: Usuario) => {
    const activar = !usuario.activo;
    presentarAlerta({
      header: activar ? 'Reactivar cuenta' : 'Desactivar cuenta',
      message: activar
        ? `${usuario.nombreUsuario} podrá volver a iniciar sesión.`
        : `${usuario.nombreUsuario} no podrá iniciar sesión y su sesión actual se cerrará.`,
      buttons: [
        { text: 'Volver', role: 'cancel' },
        { text: activar ? 'Reactivar' : 'Desactivar', handler: () => void cambiarEstado(usuario, activar) },
      ],
    });
  };

  return (
    <IonPage>
      <EncabezadoPagina titulo="Administración de usuarios" />

      <IonContent>
        <div className="operaciones">
          {cargando ? (
            [0, 1, 2].map((posicion) => (
              <IonSkeletonText
                key={posicion}
                animated
                style={{ height: '96px', borderRadius: '16px', marginBottom: '12px' }}
              />
            ))
          ) : error ? (
            <MensajeVacio icono={cloudOfflineOutline} titulo="No pudimos cargar los usuarios" descripcion={error}>
              <IonButton fill="outline" onClick={() => void cargar()}>
                Reintentar
              </IonButton>
            </MensajeVacio>
          ) : usuarios.length === 0 ? (
            <MensajeVacio icono={peopleOutline} titulo="Sin usuarios" descripcion="Aún no hay cuentas registradas." />
          ) : (
            usuarios.map((usuario) => (
              <article className="operacion" key={usuario.id}>
                <div className="operacion__datos">
                  <h3 className="operacion__titulo">{usuario.nombreUsuario}</h3>
                  <IonBadge color={usuario.rol === 'administrador' ? 'tertiary' : 'primary'}>{usuario.rol}</IonBadge>{' '}
                  <IonBadge color={usuario.activo ? 'success' : 'medium'}>
                    {usuario.activo ? 'activa' : 'desactivada'}
                  </IonBadge>
                  <p className="operacion__meta">{usuario.correo}</p>
                  <p className="operacion__meta">
                    {usuario.comuna ? `${usuario.comuna}, ${usuario.region}` : usuario.region ?? 'Sin ubicación'} ·
                    Registro: {formatearFecha(usuario.fechaRegistro)}
                  </p>

                  <div className="operacion__acciones">
                    {usuario.id === sesion?.id ? (
                      <IonText color="medium">
                        <span className="nota">Esta es tu cuenta.</span>
                      </IonText>
                    ) : (
                      <IonButton
                        size="small"
                        color={usuario.activo ? 'danger' : 'success'}
                        fill={usuario.activo ? 'outline' : 'solid'}
                        disabled={actualizando === usuario.id}
                        onClick={() => confirmar(usuario)}
                      >
                        {usuario.activo ? 'Desactivar' : 'Reactivar'}
                      </IonButton>
                    )}
                  </div>
                </div>
              </article>
            ))
          )}
        </div>

        <IonToast isOpen={aviso !== ''} message={aviso} duration={3000} onDidDismiss={() => setAviso('')} />
      </IonContent>
    </IonPage>
  );
};

export default AdminUsuariosPage;
