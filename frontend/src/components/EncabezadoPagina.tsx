/**
 * Encabezado común a todas las páginas (RNF-UX-02: navegación consistente).
 * Muestra el botón de menú en las pantallas principales y el botón volver en las de detalle.
 * En escritorio el botón de menú se oculta solo, porque el menú queda fijo a un costado.
 */
import { IonBackButton, IonButtons, IonHeader, IonMenuButton, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import { RUTAS } from '../routes/rutas';

interface Props {
  titulo: string;
  /** Muestra el botón volver en lugar del botón de menú. */
  conVolver?: boolean;
  /** Ruta usada al volver cuando se abre la página directamente desde la URL. */
  rutaVolver?: string;
  /** Acciones opcionales alineadas a la derecha. */
  children?: React.ReactNode;
  /** Segunda barra del encabezado, por ejemplo el buscador del catálogo. */
  barraInferior?: React.ReactNode;
}

const EncabezadoPagina: React.FC<Props> = ({
  titulo,
  conVolver = false,
  rutaVolver = RUTAS.catalogo,
  children,
  barraInferior,
}) => (
  <IonHeader>
    <IonToolbar>
      <IonButtons slot="start">
        {conVolver ? <IonBackButton defaultHref={rutaVolver} text="Volver" /> : <IonMenuButton />}
      </IonButtons>
      <IonTitle>{titulo}</IonTitle>
      {children ? <IonButtons slot="end">{children}</IonButtons> : null}
    </IonToolbar>
    {barraInferior ? <IonToolbar>{barraInferior}</IonToolbar> : null}
  </IonHeader>
);

export default EncabezadoPagina;
