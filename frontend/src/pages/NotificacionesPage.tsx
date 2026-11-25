/**
 * Bandeja de notificaciones del usuario autenticado (EF1).
 */
import {
  IonBadge,
  IonButton,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSkeletonText,
  IonToast,
  useIonRouter,
  useIonViewWillEnter,
} from '@ionic/react';
import {
  checkmarkDoneOutline,
  cloudOfflineOutline,
  notificationsOutline,
  shieldCheckmarkOutline,
  starOutline,
  swapHorizontalOutline,
} from 'ionicons/icons';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import EncabezadoPagina from '../components/EncabezadoPagina';
import MensajeVacio from '../components/MensajeVacio';
import type { Notificacion, TipoNotificacion } from '../models';
import { mensajeDeError, notificarCambioNotificaciones } from '../services/api';
import {
  listarNotificaciones,
  marcarNotificacionLeida,
  marcarTodasNotificacionesLeidas,
} from '../services/notificacionesService';

function iconoPorTipo(tipo: TipoNotificacion): string {
  switch (tipo) {
    case 'operacion':
      return swapHorizontalOutline;
    case 'calificacion':
      return starOutline;
    case 'moderacion':
      return shieldCheckmarkOutline;
    default:
      return notificationsOutline;
  }
}

const NotificacionesPage: React.FC = () => {
  const router = useIonRouter();
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [noLeidas, setNoLeidas] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [aviso, setAviso] = useState('');
  const primeraVisita = useRef(true);

  const cargar = useCallback(async () => {
    setError('');
    try {
      const datos = await listarNotificaciones();
      setNotificaciones(datos.notificaciones);
      setNoLeidas(datos.noLeidas);
    } catch (causa) {
      setError(mensajeDeError(causa));
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  useIonViewWillEnter(() => {
    if (primeraVisita.current) {
      primeraVisita.current = false;
      return;
    }
    void cargar();
  });

  const abrir = async (item: Notificacion) => {
    if (!item.leida) {
      try {
        await marcarNotificacionLeida(item.id);
        setNotificaciones((actuales) =>
          actuales.map((n) => (n.id === item.id ? { ...n, leida: true } : n)),
        );
        setNoLeidas((valor) => Math.max(0, valor - 1));
        notificarCambioNotificaciones();
      } catch {
        // Permite navegar igualmente si falla el marcado.
      }
    }
    if (item.ruta) {
      router.push(item.ruta, 'root');
    }
  };

  const marcarTodas = async () => {
    try {
      await marcarTodasNotificacionesLeidas();
      setNotificaciones((actuales) => actuales.map((n) => ({ ...n, leida: true })));
      setNoLeidas(0);
      notificarCambioNotificaciones();
      setAviso('Todas las notificaciones quedaron marcadas como leídas.');
    } catch (causa) {
      setAviso(mensajeDeError(causa));
    }
  };

  return (
    <IonPage>
      <EncabezadoPagina titulo="Notificaciones" conVolver ocultarNotificaciones>
        {noLeidas > 0 && (
          <IonButton onClick={() => void marcarTodas()} aria-label="Marcar todas como leídas">
            <IonIcon slot="icon-only" icon={checkmarkDoneOutline} />
          </IonButton>
        )}
      </EncabezadoPagina>

      <IonContent>
        <div className="operaciones">
          {cargando ? (
            [0, 1, 2].map((posicion) => (
              <IonSkeletonText
                key={posicion}
                animated
                style={{ height: '74px', borderRadius: '14px', marginBottom: '10px' }}
              />
            ))
          ) : error ? (
            <MensajeVacio
              icono={cloudOfflineOutline}
              titulo="No pudimos cargar tus notificaciones"
              descripcion={error}
            >
              <IonButton fill="outline" onClick={() => void cargar()}>
                Reintentar
              </IonButton>
            </MensajeVacio>
          ) : notificaciones.length === 0 ? (
            <MensajeVacio
              icono={notificationsOutline}
              titulo="Sin notificaciones"
              descripcion="Te avisaremos aquí cuando recibas solicitudes de compra, calificaciones o avisos de moderación."
            />
          ) : (
            <IonList lines="full">
              {notificaciones.map((item) => (
                <IonItem
                  key={item.id}
                  button
                  detail={Boolean(item.ruta)}
                  className={item.leida ? 'notificacion-item' : 'notificacion-item notificacion-item--no-leida'}
                  onClick={() => void abrir(item)}
                >
                  <IonIcon
                    slot="start"
                    icon={iconoPorTipo(item.tipo)}
                    color={item.leida ? 'medium' : 'primary'}
                    aria-hidden="true"
                  />
                  <IonLabel>
                    <h3>{item.titulo}</h3>
                    <p>{item.mensaje}</p>
                    <p className="operacion__meta">{item.fechaCreacion}</p>
                  </IonLabel>
                  {!item.leida && (
                    <IonBadge slot="end" color="primary">
                      Nueva
                    </IonBadge>
                  )}
                </IonItem>
              ))}
            </IonList>
          )}
        </div>

        <IonToast
          isOpen={aviso !== ''}
          message={aviso}
          duration={2600}
          onDidDismiss={() => setAviso('')}
        />
      </IonContent>
    </IonPage>
  );
};

export default NotificacionesPage;
