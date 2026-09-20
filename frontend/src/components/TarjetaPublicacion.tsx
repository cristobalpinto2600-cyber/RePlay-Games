/**
 * Tarjeta de una publicación dentro del catálogo (RF-01).
 * Muestra la información mínima comparable definida en el documento: portada, título, precio,
 * consola, estado de conservación y comuna.
 */
import { IonBadge, IonCard, IonCardContent, IonChip, IonIcon } from '@ionic/react';
import { locationOutline } from 'ionicons/icons';
import React from 'react';
import type { Publicacion } from '../models';
import { rutaDetalle } from '../routes/rutas';
import { formatearPrecio } from '../utils/formato';
import PortadaJuego from './PortadaJuego';

interface Props {
  publicacion: Publicacion;
}

const TarjetaPublicacion: React.FC<Props> = ({ publicacion }) => (
  <IonCard className="tarjeta" button routerLink={rutaDetalle(publicacion.id)}>
    <div className="tarjeta__portada">
      <PortadaJuego titulo={publicacion.titulo} consola={publicacion.consola} />
      {publicacion.estadoPublicacion !== 'activa' && (
        <IonBadge color="warning" className="tarjeta__estado">
          {publicacion.estadoPublicacion === 'pausada' ? 'Pausada' : 'Vendida'}
        </IonBadge>
      )}
    </div>

    <IonCardContent className="tarjeta__cuerpo">
      <h3 className="tarjeta__titulo">{publicacion.titulo}</h3>
      <p className="precio">{formatearPrecio(publicacion.precio)}</p>

      <div className="tarjeta__chips">
        <IonChip outline color="primary">
          {publicacion.consola}
        </IonChip>
        <IonChip outline color="medium">
          {publicacion.estadoConservacion}
        </IonChip>
      </div>

      <p className="tarjeta__ubicacion">
        <IonIcon icon={locationOutline} aria-hidden="true" />
        {publicacion.comuna}
      </p>
    </IonCardContent>
  </IonCard>
);

export default TarjetaPublicacion;
