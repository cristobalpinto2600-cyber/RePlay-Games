/**
 * Control de acceso a rutas protegidas (RNF-SEG-01, RNF-SEG-02).
 *
 * Envuelve el contenido de una ruta y decide si mostrarlo:
 *  - mientras se recupera la sesión guardada muestra un estado de carga;
 *  - sin sesión redirige a /login recordando la ruta solicitada, para volver a ella después;
 *  - con un rol distinto al exigido devuelve al catálogo.
 *
 * Siempre devuelve un IonPage, incluso al redirigir, porque el contenedor de rutas de Ionic
 * espera una página en cada transición.
 */
import { IonContent, IonPage, IonSpinner, IonText } from '@ionic/react';
import React from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import { useSesion } from '../context/SesionContext';
import type { Rol } from '../models';
import { RUTAS, rutaLoginCon } from './rutas';

interface PropsTransicion {
  mensaje: string;
  children?: React.ReactNode;
}

const PantallaTransicion: React.FC<PropsTransicion> = ({ mensaje, children }) => (
  <IonPage>
    <IonContent className="ion-padding">
      <div className="pantalla-transicion">
        <IonSpinner name="crescent" />
        <IonText color="medium">
          <p>{mensaje}</p>
        </IonText>
      </div>
      {children}
    </IonContent>
  </IonPage>
);

interface PropsProtegida {
  /** Rol exigido por la ruta. Si se omite, basta con tener sesión iniciada. */
  rol?: Rol;
  children: React.ReactNode;
}

const Protegida: React.FC<PropsProtegida> = ({ rol, children }) => {
  const { usuario, cargando } = useSesion();
  const ubicacion = useLocation();

  if (cargando) {
    return <PantallaTransicion mensaje="Verificando tu sesión…" />;
  }

  if (!usuario) {
    return (
      <PantallaTransicion mensaje="Necesitas iniciar sesión. Te llevamos al acceso…">
        <Redirect to={rutaLoginCon(`${ubicacion.pathname}${ubicacion.search}`)} />
      </PantallaTransicion>
    );
  }

  if (rol && usuario.rol !== rol) {
    return (
      <PantallaTransicion mensaje="Tu cuenta no tiene permisos para esta sección.">
        <Redirect to={RUTAS.catalogo} />
      </PantallaTransicion>
    );
  }

  return <>{children}</>;
};

export default Protegida;
