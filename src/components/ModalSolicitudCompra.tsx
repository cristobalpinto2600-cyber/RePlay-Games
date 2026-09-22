/**
 * Solicitud de compra (RF-06).
 * Antes de crear la operación se muestra el resumen del producto y se exige elegir una
 * modalidad de entrega ofrecida por el vendedor (documento, sección 4.7: confirmación de compra).
 */
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonItem,
  IonList,
  IonModal,
  IonRadio,
  IonRadioGroup,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import React, { useEffect, useState } from 'react';
import type { ModalidadEntrega, Publicacion, Usuario } from '../models';
import { formatearPrecio } from '../utils/formato';
import PortadaJuego from './PortadaJuego';

interface Props {
  publicacion: Publicacion;
  vendedor?: Usuario;
  abierto: boolean;
  onCerrar: () => void;
  onConfirmar: (modalidad: ModalidadEntrega) => void;
}

const ModalSolicitudCompra: React.FC<Props> = ({
  publicacion,
  vendedor,
  abierto,
  onCerrar,
  onConfirmar,
}) => {
  const [modalidad, setModalidad] = useState<ModalidadEntrega>(publicacion.entregas[0]);

  useEffect(() => {
    if (abierto) {
      setModalidad(publicacion.entregas[0]);
    }
  }, [abierto, publicacion]);

  return (
    <IonModal isOpen={abierto} onDidDismiss={onCerrar}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Solicitud de compra</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onCerrar}>Cancelar</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="resumen-compra">
          <PortadaJuego
            titulo={publicacion.titulo}
            consola={publicacion.consola}
            tamano="miniatura"
          />
          <div>
            <h3>{publicacion.titulo}</h3>
            <p className="precio">{formatearPrecio(publicacion.precio)}</p>
            <IonText color="medium">
              <p>
                {publicacion.consola} · {publicacion.estadoConservacion}
                {vendedor ? ` · Vendedor: ${vendedor.nombreUsuario}` : ''}
              </p>
            </IonText>
          </div>
        </div>

        <h4 className="titulo-seccion">Modalidad de entrega</h4>
        <IonList lines="full">
          <IonRadioGroup
            value={modalidad}
            onIonChange={(evento) => setModalidad(evento.detail.value as ModalidadEntrega)}
          >
            {publicacion.entregas.map((entrega) => (
              <IonItem key={entrega}>
                <IonRadio value={entrega} labelPlacement="end" justify="start">
                  {entrega}
                </IonRadio>
              </IonItem>
            ))}
          </IonRadioGroup>
        </IonList>

        <IonText color="medium">
          <p className="nota">
            En esta entrega no se realizan pagos en línea: la solicitud queda registrada como una
            operación pendiente entre comprador y vendedor.
          </p>
        </IonText>
      </IonContent>

      <IonFooter>
        <IonToolbar>
          <div className="ion-padding">
            <IonButton expand="block" onClick={() => onConfirmar(modalidad)}>
              Confirmar solicitud
            </IonButton>
          </div>
        </IonToolbar>
      </IonFooter>
    </IonModal>
  );
};

export default ModalSolicitudCompra;
