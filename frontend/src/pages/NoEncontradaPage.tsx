/**
 * Página mostrada cuando la dirección no corresponde a ninguna ruta definida.
 * Evita que una URL equivocada deje la aplicación en blanco (RNF-UX-03).
 */
import { IonButton, IonContent, IonPage } from '@ionic/react';
import { compassOutline } from 'ionicons/icons';
import React from 'react';
import EncabezadoPagina from '../components/EncabezadoPagina';
import MensajeVacio from '../components/MensajeVacio';
import { RUTAS } from '../routes/rutas';

const NoEncontradaPage: React.FC = () => (
  <IonPage>
    <EncabezadoPagina titulo="Página no encontrada" />
    <IonContent>
      <MensajeVacio
        icono={compassOutline}
        titulo="No encontramos esta página"
        descripcion="La dirección que abriste no existe en RePlay Games."
      >
        <IonButton routerLink={RUTAS.catalogo} routerDirection="root">
          Ir al catálogo
        </IonButton>
      </MensajeVacio>
    </IonContent>
  </IonPage>
);

export default NoEncontradaPage;
