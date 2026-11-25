/**
 * Modal para reportar una publicación (RF-09).
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
  IonNote,
  IonRadio,
  IonRadioGroup,
  IonSpinner,
  IonText,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import React, { useEffect, useState } from 'react';
import type { MotivoReporte, Publicacion } from '../models';
import { mensajeDeError } from '../services/api';
import { MOTIVOS_REPORTE, crearReporte } from '../services/reportesService';

interface Props {
  publicacion: Publicacion;
  abierto: boolean;
  onCerrar: () => void;
  onEnviado: (mensaje: string) => void;
}

const ModalReportarPublicacion: React.FC<Props> = ({
  publicacion,
  abierto,
  onCerrar,
  onEnviado,
}) => {
  const [motivo, setMotivo] = useState<MotivoReporte>(MOTIVOS_REPORTE[0]);
  const [comentario, setComentario] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (abierto) {
      setMotivo(MOTIVOS_REPORTE[0]);
      setComentario('');
      setError('');
    }
  }, [abierto, publicacion.id]);

  const enviar = async () => {
    setEnviando(true);
    setError('');
    try {
      await crearReporte({
        publicacionId: publicacion.id,
        motivo,
        comentario: comentario.trim() || undefined,
      });
      onCerrar();
      onEnviado('Reporte enviado. El equipo de administración lo revisará a la brevedad.');
    } catch (causa) {
      setError(mensajeDeError(causa, 'No fue posible registrar el reporte.'));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <IonModal isOpen={abierto} onDidDismiss={onCerrar}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Reportar publicación</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onCerrar} disabled={enviando}>
              Cancelar
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonText color="medium">
          <p className="nota">
            Estás reportando <strong>{publicacion.titulo}</strong>. Selecciona el motivo que mejor
            describe el problema.
          </p>
        </IonText>

        <h4 className="titulo-seccion">Motivo del reporte</h4>
        <IonList lines="full">
          <IonRadioGroup
            value={motivo}
            onIonChange={(evento) => setMotivo(evento.detail.value as MotivoReporte)}
          >
            {MOTIVOS_REPORTE.map((opcion) => (
              <IonItem key={opcion}>
                <IonRadio value={opcion} labelPlacement="end" justify="start">
                  {opcion}
                </IonRadio>
              </IonItem>
            ))}
          </IonRadioGroup>
        </IonList>

        <IonTextarea
          className="ion-margin-top"
          label="Comentario adicional (opcional)"
          labelPlacement="floating"
          fill="outline"
          rows={3}
          counter
          maxlength={300}
          value={comentario}
          onIonInput={(evento) => setComentario(evento.detail.value ?? '')}
        />

        {error && (
          <IonNote color="danger">
            <p className="nota ion-margin-top" role="alert">
              {error}
            </p>
          </IonNote>
        )}
      </IonContent>

      <IonFooter>
        <IonToolbar className="ion-padding-horizontal">
          <IonButton expand="block" color="danger" disabled={enviando} onClick={() => void enviar()}>
            {enviando ? <IonSpinner name="crescent" /> : 'Enviar reporte'}
          </IonButton>
        </IonToolbar>
      </IonFooter>
    </IonModal>
  );
};

export default ModalReportarPublicacion;
