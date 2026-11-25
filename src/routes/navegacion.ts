/**
 * Secciones de navegación compartidas por el menú lateral y la barra inferior (RNF-UX-02).
 * Cada sección indica el rol que la usa:
 *  - visitante: catálogo y las secciones de Usuario marcadas como "Requiere sesión";
 *  - usuario: catálogo, favoritos, publicar, mis publicaciones, operaciones y perfil;
 *  - administrador: catálogo, panel admin, reportes, publicaciones y usuarios.
 */
import {
  addCircleOutline,
  albumsOutline,
  flagOutline,
  gameControllerOutline,
  heartOutline,
  peopleOutline,
  personOutline,
  shieldCheckmarkOutline,
  statsChartOutline,
  swapHorizontalOutline,
} from 'ionicons/icons';
import type { Rol, Usuario } from '../models';
import { RUTAS } from './rutas';

export interface SeccionNavegacion {
  clave: string;
  /** Nombre en el menú lateral. */
  titulo: string;
  /** Nombre abreviado para la barra inferior en móvil. */
  tituloCorto: string;
  ruta: string;
  icono: string;
  /** Rol que usa la sección; sin rol, es pública. */
  rol?: Rol;
  /** Permite ocultar ítems secundarios de la barra inferior móvil para conservar hasta 5 pestañas. */
  enBarraInferior?: boolean;
}

const SECCIONES: SeccionNavegacion[] = [
  { clave: 'catalogo', titulo: 'Catálogo', tituloCorto: 'Catálogo', ruta: RUTAS.catalogo, icono: gameControllerOutline },
  {
    clave: 'favoritos',
    titulo: 'Favoritos',
    tituloCorto: 'Favoritos',
    ruta: RUTAS.favoritos,
    icono: heartOutline,
    rol: 'usuario',
  },
  {
    clave: 'publicar',
    titulo: 'Publicar juego',
    tituloCorto: 'Publicar',
    ruta: RUTAS.publicar,
    icono: addCircleOutline,
    rol: 'usuario',
  },
  {
    clave: 'mis-publicaciones',
    titulo: 'Mis publicaciones',
    tituloCorto: 'Mis juegos',
    ruta: RUTAS.misPublicaciones,
    icono: albumsOutline,
    rol: 'usuario',
  },
  {
    clave: 'operaciones',
    titulo: 'Compras y ventas',
    tituloCorto: 'Operaciones',
    ruta: RUTAS.operaciones,
    icono: swapHorizontalOutline,
    rol: 'usuario',
  },
  {
    clave: 'perfil',
    titulo: 'Mi perfil',
    tituloCorto: 'Perfil',
    ruta: RUTAS.perfil,
    icono: personOutline,
    rol: 'usuario',
    enBarraInferior: false,
  },
  {
    clave: 'admin-panel',
    titulo: 'Panel administrador',
    tituloCorto: 'Panel',
    ruta: RUTAS.admin,
    icono: statsChartOutline,
    rol: 'administrador',
  },
  {
    clave: 'admin-reportes',
    titulo: 'Reportes',
    tituloCorto: 'Reportes',
    ruta: RUTAS.adminReportes,
    icono: flagOutline,
    rol: 'administrador',
  },
  {
    clave: 'admin-publicaciones',
    titulo: 'Moderar publicaciones',
    tituloCorto: 'Moderación',
    ruta: RUTAS.adminPublicaciones,
    icono: shieldCheckmarkOutline,
    rol: 'administrador',
  },
  {
    clave: 'admin-usuarios',
    titulo: 'Usuarios',
    tituloCorto: 'Usuarios',
    ruta: RUTAS.adminUsuarios,
    icono: peopleOutline,
    rol: 'administrador',
  },
];

export function seccionesVisibles(usuario: Usuario | null): SeccionNavegacion[] {
  return SECCIONES.filter((seccion) => {
    if (!seccion.rol) {
      return true;
    }
    return usuario ? usuario.rol === seccion.rol : seccion.rol === 'usuario';
  });
}
