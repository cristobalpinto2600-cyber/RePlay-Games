/**
 * Declaración de rutas públicas y protegidas (documento, secciones 4.1, 4.2 y 6.1).
 *
 * Se exporta un arreglo de elementos Route para que sean hijos directos del IonRouterOutlet:
 * es la forma en que Ionic reconoce y anima cada página de la pila de navegación.
 *
 * La matriz de acceso del README se aplica en dos niveles: aquí, con el componente Protegida, y
 * en el backend, que vuelve a verificar el token y el rol en cada solicitud.
 */
import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import AdminUsuariosPage from '../pages/AdminUsuariosPage';
import CatalogoPage from '../pages/CatalogoPage';
import DetallePublicacionPage from '../pages/DetallePublicacionPage';
import LoginPage from '../pages/LoginPage';
import MisPublicacionesPage from '../pages/MisPublicacionesPage';
import NoEncontradaPage from '../pages/NoEncontradaPage';
import OperacionesPage from '../pages/OperacionesPage';
import PublicarPage from '../pages/PublicarPage';
import RegistroPage from '../pages/RegistroPage';
import type { Rol } from '../models';
import Protegida from './Protegida';
import { RUTAS } from './rutas';

/** Ruta que exige sesión iniciada y, opcionalmente, un rol específico. */
function rutaProtegida(clave: string, ruta: string, Pagina: React.FC, rol?: Rol): React.ReactElement {
  return (
    <Route
      key={clave}
      exact
      path={ruta}
      render={() => (
        <Protegida rol={rol}>
          <Pagina />
        </Protegida>
      )}
    />
  );
}

export const rutasApp: React.ReactElement[] = [
  // Inicio: el documento define el catálogo como pantalla de entrada.
  <Redirect key="inicio" exact from={RUTAS.inicio} to={RUTAS.catalogo} />,

  // Rutas públicas.
  <Route key="catalogo" exact path={RUTAS.catalogo} component={CatalogoPage} />,
  <Route key="detalle" exact path={RUTAS.detalle} component={DetallePublicacionPage} />,
  <Route key="login" exact path={RUTAS.login} component={LoginPage} />,
  <Route key="registro" exact path={RUTAS.registro} component={RegistroPage} />,

  // Rutas protegidas del Usuario: comprar y vender.
  rutaProtegida('publicar', RUTAS.publicar, PublicarPage, 'usuario'),
  rutaProtegida('editar', RUTAS.editar, PublicarPage, 'usuario'),
  rutaProtegida('mis-publicaciones', RUTAS.misPublicaciones, MisPublicacionesPage, 'usuario'),
  rutaProtegida('operaciones', RUTAS.operaciones, OperacionesPage, 'usuario'),

  // Rutas protegidas del Administrador.
  <Redirect key="admin" exact from={RUTAS.admin} to={RUTAS.adminUsuarios} />,
  rutaProtegida('admin-usuarios', RUTAS.adminUsuarios, AdminUsuariosPage, 'administrador'),

  // Cualquier otra dirección: Ionic toma como "ruta no encontrada" la que no declara path.
  <Route key="no-encontrada" component={NoEncontradaPage} />,
];
