/**
 * Declaración de rutas públicas y protegidas (documento, secciones 4.1, 4.2 y 6.1).
 *
 * Se exporta un arreglo de elementos Route para que sean hijos directos del IonRouterOutlet:
 * es la forma en que Ionic reconoce y anima cada página de la pila de navegación.
 */
import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import CatalogoPage from '../pages/CatalogoPage';
import DetallePublicacionPage from '../pages/DetallePublicacionPage';
import LoginPage from '../pages/LoginPage';
import NoEncontradaPage from '../pages/NoEncontradaPage';
import OperacionesPage from '../pages/OperacionesPage';
import PublicarPage from '../pages/PublicarPage';
import RegistroPage from '../pages/RegistroPage';
import Protegida from './Protegida';
import { RUTAS } from './rutas';

export const rutasApp: React.ReactElement[] = [
  // Inicio: el documento define el catálogo como pantalla de entrada.
  <Redirect key="inicio" exact from={RUTAS.inicio} to={RUTAS.catalogo} />,

  // Rutas públicas.
  <Route key="catalogo" exact path={RUTAS.catalogo} component={CatalogoPage} />,
  <Route key="detalle" exact path={RUTAS.detalle} component={DetallePublicacionPage} />,
  <Route key="login" exact path={RUTAS.login} component={LoginPage} />,
  <Route key="registro" exact path={RUTAS.registro} component={RegistroPage} />,

  // Rutas protegidas: requieren sesión iniciada.
  <Route
    key="publicar"
    exact
    path={RUTAS.publicar}
    render={() => (
      <Protegida>
        <PublicarPage />
      </Protegida>
    )}
  />,
  <Route
    key="operaciones"
    exact
    path={RUTAS.operaciones}
    render={() => (
      <Protegida>
        <OperacionesPage />
      </Protegida>
    )}
  />,

  // Cualquier otra dirección: Ionic toma como "ruta no encontrada" la que no declara path.
  <Route key="no-encontrada" component={NoEncontradaPage} />,
];
