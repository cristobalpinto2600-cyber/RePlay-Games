/**
 * Declaración de rutas públicas y protegidas con code splitting por página (EF2).
 *
 * Las páginas secundarias y administrativas se cargan bajo demanda con React.lazy y Suspense
 * para reducir el tamaño del bundle inicial sin perder compatibilidad con IonRouterOutlet.
 */
import { IonContent, IonPage, IonSpinner, IonText } from '@ionic/react';
import React, { Suspense, lazy } from 'react';
import { Redirect, Route } from 'react-router-dom';
import type { Rol } from '../models';
import CatalogoPage from '../pages/CatalogoPage';
import DetallePublicacionPage from '../pages/DetallePublicacionPage';
import LoginPage from '../pages/LoginPage';
import NoEncontradaPage from '../pages/NoEncontradaPage';
import RegistroPage from '../pages/RegistroPage';
import Protegida from './Protegida';
import { RUTAS } from './rutas';

const FavoritosPage = lazy(() => import('../pages/FavoritosPage'));
const PublicarPage = lazy(() => import('../pages/PublicarPage'));
const MisPublicacionesPage = lazy(() => import('../pages/MisPublicacionesPage'));
const OperacionesPage = lazy(() => import('../pages/OperacionesPage'));
const CalificarOperacionPage = lazy(() => import('../pages/CalificarOperacionPage'));
const PerfilPage = lazy(() => import('../pages/PerfilPage'));
const NotificacionesPage = lazy(() => import('../pages/NotificacionesPage'));
const AdminPanelPage = lazy(() => import('../pages/AdminPanelPage'));
const AdminReportesPage = lazy(() => import('../pages/AdminReportesPage'));
const AdminPublicacionesPage = lazy(() => import('../pages/AdminPublicacionesPage'));
const AdminUsuariosPage = lazy(() => import('../pages/AdminUsuariosPage'));

const CargandoVista: React.FC = () => (
  <IonPage>
    <IonContent>
      <div className="pantalla-transicion">
        <IonSpinner name="crescent" />
        <IonText color="medium">
          <p>Cargando vista…</p>
        </IonText>
      </div>
    </IonContent>
  </IonPage>
);

function paginaDiferida(
  Componente: React.LazyExoticComponent<React.FC>,
): React.ReactElement {
  return (
    <Suspense fallback={<CargandoVista />}>
      <Componente />
    </Suspense>
  );
}

/** Ruta que exige sesión iniciada y, opcionalmente, un rol específico. */
function rutaProtegida(
  clave: string,
  ruta: string,
  Pagina: React.LazyExoticComponent<React.FC>,
  rol?: Rol,
): React.ReactElement {
  return (
    <Route
      key={clave}
      exact
      path={ruta}
      render={() => <Protegida rol={rol}>{paginaDiferida(Pagina)}</Protegida>}
    />
  );
}

export const rutasApp: React.ReactElement[] = [
  <Redirect key="inicio" exact from={RUTAS.inicio} to={RUTAS.catalogo} />,

  // Rutas públicas principales.
  <Route key="catalogo" exact path={RUTAS.catalogo} component={CatalogoPage} />,
  <Route key="detalle" exact path={RUTAS.detalle} component={DetallePublicacionPage} />,
  <Route key="login" exact path={RUTAS.login} component={LoginPage} />,
  <Route key="registro" exact path={RUTAS.registro} component={RegistroPage} />,

  // Rutas protegidas compartidas por cualquier sesión iniciada.
  rutaProtegida('notificaciones', RUTAS.notificaciones, NotificacionesPage),

  // Rutas protegidas del Usuario: comprar, vender, favoritos, calificar y perfil.
  rutaProtegida('favoritos', RUTAS.favoritos, FavoritosPage, 'usuario'),
  rutaProtegida('publicar', RUTAS.publicar, PublicarPage, 'usuario'),
  rutaProtegida('editar', RUTAS.editar, PublicarPage, 'usuario'),
  rutaProtegida('mis-publicaciones', RUTAS.misPublicaciones, MisPublicacionesPage, 'usuario'),
  rutaProtegida('operaciones', RUTAS.operaciones, OperacionesPage, 'usuario'),
  rutaProtegida('calificar', RUTAS.calificar, CalificarOperacionPage, 'usuario'),
  rutaProtegida('perfil', RUTAS.perfil, PerfilPage, 'usuario'),

  // Rutas protegidas del Administrador.
  rutaProtegida('admin', RUTAS.admin, AdminPanelPage, 'administrador'),
  rutaProtegida('admin-reportes', RUTAS.adminReportes, AdminReportesPage, 'administrador'),
  rutaProtegida('admin-publicaciones', RUTAS.adminPublicaciones, AdminPublicacionesPage, 'administrador'),
  rutaProtegida('admin-usuarios', RUTAS.adminUsuarios, AdminUsuariosPage, 'administrador'),

  // Cualquier otra dirección: Ionic toma como "ruta no encontrada" la que no declara path.
  <Route key="no-encontrada" component={NoEncontradaPage} />,
];
