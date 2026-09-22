/**
 * Panel de filtros del catálogo (RF-01).
 * El mismo componente se usa fijo a un costado en escritorio y dentro de un modal en móvil,
 * manteniendo los mismos nombres y comportamientos en ambas versiones (documento, sección 5.1).
 */
import {
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonNote,
  IonRange,
  IonSelect,
  IonSelectOption,
} from '@ionic/react';
import { refreshOutline } from 'ionicons/icons';
import React from 'react';
import { COMUNAS, CONSOLAS, ESTADOS_CONSERVACION, GENEROS, PRECIO_MAXIMO } from '../data/catalogos';
import type { FiltrosCatalogo } from '../models';
import { formatearPrecio } from '../utils/formato';

interface Props {
  filtros: FiltrosCatalogo;
  onCambiar: (filtros: FiltrosCatalogo) => void;
  onLimpiar: () => void;
  /** Sólo en móvil: cierra el modal que contiene el panel. */
  onCerrar?: () => void;
}

const PanelFiltros: React.FC<Props> = ({ filtros, onCambiar, onLimpiar, onCerrar }) => {
  const actualizar = (cambio: Partial<FiltrosCatalogo>) => onCambiar({ ...filtros, ...cambio });

  return (
    <div className="panel-filtros">
      <IonList lines="full">
        <IonListHeader>
          <IonLabel>Filtros</IonLabel>
        </IonListHeader>

        <IonItem>
          <IonSelect
            label="Consola"
            labelPlacement="floating"
            placeholder="Todas"
            value={filtros.consola}
            onIonChange={(evento) => actualizar({ consola: evento.detail.value })}
          >
            <IonSelectOption value="">Todas</IonSelectOption>
            {CONSOLAS.map((consola) => (
              <IonSelectOption key={consola} value={consola}>
                {consola}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>

        <IonItem>
          <IonSelect
            label="Género"
            labelPlacement="floating"
            placeholder="Todos"
            value={filtros.genero}
            onIonChange={(evento) => actualizar({ genero: evento.detail.value })}
          >
            <IonSelectOption value="">Todos</IonSelectOption>
            {GENEROS.map((genero) => (
              <IonSelectOption key={genero} value={genero}>
                {genero}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>

        <IonItem>
          <IonSelect
            label="Estado"
            labelPlacement="floating"
            placeholder="Cualquiera"
            value={filtros.estadoConservacion}
            onIonChange={(evento) => actualizar({ estadoConservacion: evento.detail.value })}
          >
            <IonSelectOption value="">Cualquiera</IonSelectOption>
            {ESTADOS_CONSERVACION.map((estado) => (
              <IonSelectOption key={estado} value={estado}>
                {estado}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>

        <IonItem>
          <IonSelect
            label="Comuna"
            labelPlacement="floating"
            placeholder="Todas"
            value={filtros.comuna}
            onIonChange={(evento) => actualizar({ comuna: evento.detail.value })}
          >
            <IonSelectOption value="">Todas</IonSelectOption>
            {COMUNAS.map((comuna) => (
              <IonSelectOption key={comuna} value={comuna}>
                {comuna}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>

        <IonItem lines="none">
          <IonLabel position="stacked">Precio máximo</IonLabel>
          <IonNote slot="end" className="panel-filtros__precio">
            {formatearPrecio(filtros.precioMaximo)}
          </IonNote>
          <IonRange
            aria-label="Precio máximo"
            min={5000}
            max={PRECIO_MAXIMO}
            step={1000}
            value={filtros.precioMaximo}
            onIonChange={(evento) => actualizar({ precioMaximo: evento.detail.value as number })}
          />
        </IonItem>
      </IonList>

      <div className="panel-filtros__acciones">
        <IonButton expand="block" fill="clear" onClick={onLimpiar}>
          <IonIcon slot="start" icon={refreshOutline} />
          Limpiar filtros
        </IonButton>
        {onCerrar && (
          <IonButton expand="block" onClick={onCerrar}>
            Ver resultados
          </IonButton>
        )}
      </div>
    </div>
  );
};

export default PanelFiltros;
