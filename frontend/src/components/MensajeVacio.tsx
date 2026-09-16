/**
 * Mensaje para listados sin resultados (RNF-UX-03: retroalimentación al usuario).
 */
import { IonIcon, IonText } from '@ionic/react';
import React from 'react';

interface Props {
  icono: string;
  titulo: string;
  descripcion: string;
  children?: React.ReactNode;
}

const MensajeVacio: React.FC<Props> = ({ icono, titulo, descripcion, children }) => (
  <div className="mensaje-vacio">
    <IonIcon icon={icono} className="mensaje-vacio__icono" aria-hidden="true" />
    <h3>{titulo}</h3>
    <IonText color="medium">
      <p>{descripcion}</p>
    </IonText>
    {children}
  </div>
);

export default MensajeVacio;
