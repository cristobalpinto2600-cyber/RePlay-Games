/**
 * Encabezado común a todas las páginas (RNF-UX-02: navegación consistente).
 * Muestra el botón de menú en las pantallas principales, el botón volver en las de detalle
 * y el acceso a notificaciones cuando hay sesión iniciada.
 */
import { IonBackButton, IonButtons, IonHeader, IonMenuButton, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import { useSesion } from '../context/SesionContext';
import { RUTAS } from '../routes/rutas';
import BotonNotificaciones from './BotonNotificaciones';

interface Props {
  titulo: string;
  /** Muestra el botón volver en lugar del botón de menú. */
  conVolver?: boolean;
  /** Ruta usada al volver cuando se abre la página directamente desde la URL. */
  rutaVolver?: string;
  /** Oculta la campana de notificaciones (por ejemplo en login/registro o en la propia bandeja). */
  ocultarNotificaciones?: boolean;
  /** Acciones opcionales alineadas a la derecha. */
  children?: React.ReactNode;
  /** Segunda barra del encabezado, por ejemplo el buscador del catálogo. */
  barraInferior?: React.ReactNode;
}

const EncabezadoPagina: React.FC<Props> = ({
  titulo,
  conVolver = false,
  rutaVolver = RUTAS.catalogo,
  ocultarNotificaciones = false,
  children,
  barraInferior,
}) => {
  const { usuario } = useSesion();
  const mostrarNotificaciones = Boolean(usuario) && !ocultarNotificaciones;

  return (
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          {conVolver ? <IonBackButton defaultHref={rutaVolver} text="Volver" /> : <IonMenuButton />}
        </IonButtons>
        <IonTitle>{titulo}</IonTitle>
        {(children || mostrarNotificaciones) && (
          <IonButtons slot="end">
            {children}
            {mostrarNotificaciones && <BotonNotificaciones />}
          </IonButtons>
        )}
      </IonToolbar>
      {barraInferior ? <IonToolbar>{barraInferior}</IonToolbar> : null}
    </IonHeader>
  );
};

export default EncabezadoPagina;
