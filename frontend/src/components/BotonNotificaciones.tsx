/**
 * Botón de campana en el encabezado con contador de notificaciones no leídas (EF1).
 */
import { IonBadge, IonButton, IonIcon } from '@ionic/react';
import { notificationsOutline } from 'ionicons/icons';
import React, { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSesion } from '../context/SesionContext';
import { RUTAS } from '../routes/rutas';
import { EVENTO_NOTIFICACIONES } from '../services/api';
import { listarNotificaciones } from '../services/notificacionesService';

const BotonNotificaciones: React.FC = () => {
  const { usuario } = useSesion();
  const { pathname } = useLocation();
  const [noLeidas, setNoLeidas] = useState(0);

  const cargar = useCallback(async () => {
    if (!usuario) {
      setNoLeidas(0);
      return;
    }
    try {
      const datos = await listarNotificaciones();
      setNoLeidas(datos.noLeidas);
    } catch {
      // No interrumpe la navegación si falla el conteo auxiliar.
    }
  }, [usuario]);

  useEffect(() => {
    void cargar();
  }, [cargar, pathname]);

  useEffect(() => {
    const actualizar = () => void cargar();
    window.addEventListener(EVENTO_NOTIFICACIONES, actualizar);
    window.addEventListener('focus', actualizar);
    return () => {
      window.removeEventListener(EVENTO_NOTIFICACIONES, actualizar);
      window.removeEventListener('focus', actualizar);
    };
  }, [cargar]);

  if (!usuario) {
    return null;
  }

  return (
    <IonButton
      routerLink={RUTAS.notificaciones}
      routerDirection="forward"
      className="boton-notificaciones"
      aria-label={
        noLeidas > 0 ? `Notificaciones (${noLeidas} sin leer)` : 'Notificaciones'
      }
    >
      <IonIcon slot="icon-only" icon={notificationsOutline} />
      {noLeidas > 0 && (
        <IonBadge color="danger" className="boton-notificaciones__badge">
          {noLeidas > 99 ? '99+' : noLeidas}
        </IonBadge>
      )}
    </IonButton>
  );
};

export default BotonNotificaciones;
