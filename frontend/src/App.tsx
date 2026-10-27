/**
 * Estructura general de la aplicación (documento, secciones 4.8 y 6.1).
 *
 * Una sola estructura de navegación sirve a las dos versiones:
 *  - en escritorio (a partir de 992 px) el IonSplitPane deja el menú lateral fijo;
 *  - en móvil el menú se abre desde el encabezado y aparece la barra inferior de IonTabs.
 * Las mismas secciones, con los mismos nombres, están disponibles en ambas (RNF-UX-02).
 */
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonSplitPane,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { addCircleOutline, gameControllerOutline, swapHorizontalOutline } from 'ionicons/icons';
import React from 'react';
import { useLocation } from 'react-router-dom';
import MenuLateral from './components/MenuLateral';
import { SesionProvider } from './context/SesionContext';
import { rutasApp } from './routes/AppRoutes';
import { RUTAS } from './routes/rutas';

setupIonicReact();

const Navegacion: React.FC = () => {
  const { pathname } = useLocation();
  // En las pantallas de acceso se oculta la navegación para centrar la atención en el formulario.
  const enAcceso = pathname === RUTAS.login || pathname === RUTAS.registro;

  return (
    <IonSplitPane contentId="main" when="lg" disabled={enAcceso}>
      <MenuLateral deshabilitado={enAcceso} />

      <div id="main" className="contenido-principal">
        <IonTabs>
          <IonRouterOutlet>{rutasApp}</IonRouterOutlet>

          <IonTabBar slot="bottom" className={enAcceso ? 'ion-hide' : 'ion-hide-lg-up'}>
            <IonTabButton tab="catalogo" href={RUTAS.catalogo}>
              <IonIcon icon={gameControllerOutline} aria-hidden="true" />
              <IonLabel>Catálogo</IonLabel>
            </IonTabButton>
            <IonTabButton tab="publicar" href={RUTAS.publicar}>
              <IonIcon icon={addCircleOutline} aria-hidden="true" />
              <IonLabel>Publicar</IonLabel>
            </IonTabButton>
            <IonTabButton tab="operaciones" href={RUTAS.operaciones}>
              <IonIcon icon={swapHorizontalOutline} aria-hidden="true" />
              <IonLabel>Operaciones</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </div>
    </IonSplitPane>
  );
};

const App: React.FC = () => (
  <IonApp>
    <SesionProvider>
      <IonReactRouter>
        <Navegacion />
      </IonReactRouter>
    </SesionProvider>
  </IonApp>
);

export default App;
