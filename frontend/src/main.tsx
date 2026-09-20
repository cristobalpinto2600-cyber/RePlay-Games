import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

/* CSS obligatorio de Ionic */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Utilidades opcionales de Ionic usadas por las vistas */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Modo oscuro automático según la preferencia del sistema operativo */
import '@ionic/react/css/palettes/dark.system.css';

/* Tema propio de RePlay Games */
import './theme/variables.css';
import './theme/app.css';

const contenedor = document.getElementById('root');

if (!contenedor) {
  throw new Error('No se encontró el elemento raíz de la aplicación.');
}

createRoot(contenedor).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
