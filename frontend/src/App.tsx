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
import React from 'react';
import { useLocation } from 'react-router-dom';
import MenuLateral from './components/MenuLateral';
import { SesionProvider, useSesion } from './context/SesionContext';
import { rutasApp } from './routes/AppRoutes';
import { seccionesVisibles } from './routes/navegacion';
import { RUTAS } from './routes/rutas';

setupIonicReact();

const Navegacion: React.FC = () => {
  const { pathname } = useLocation();
  const { usuario } = useSesion();
  // En las pantallas de acceso se oculta la navegación para centrar la atención en el formulario.
  const enAcceso = pathname === RUTAS.login || pathname === RUTAS.registro;

  return (
    <IonSplitPane contentId="main" when="lg" disabled={enAcceso}>
      <MenuLateral deshabilitado={enAcceso} />

      <div id="main" className="contenido-principal">
        <IonTabs>
          <IonRouterOutlet>{rutasApp}</IonRouterOutlet>

          <IonTabBar slot="bottom" className={enAcceso ? 'ion-hide' : 'ion-hide-lg-up'}>
            {seccionesVisibles(usuario).map((seccion) => (
              <IonTabButton key={seccion.clave} tab={seccion.clave} href={seccion.ruta}>
                <IonIcon icon={seccion.icono} aria-hidden="true" />
                <IonLabel>{seccion.tituloCorto}</IonLabel>
              </IonTabButton>
            ))}
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
