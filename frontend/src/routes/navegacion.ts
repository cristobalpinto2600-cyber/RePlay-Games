/**
 * Secciones de navegación compartidas por el menú lateral y la barra inferior (RNF-UX-02).
 * Cada sección indica el rol que la usa, de modo que ambas vistas muestran lo mismo:
 *  - visitante: catálogo y las secciones de Usuario, marcadas como "Requiere sesión";
 *  - usuario: catálogo, publicar, mis publicaciones y compras y ventas;
 *  - administrador: catálogo y administración.
 */
import {
  addCircleOutline,
  albumsOutline,
  gameControllerOutline,
  shieldCheckmarkOutline,
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
}

const SECCIONES: SeccionNavegacion[] = [
  { clave: 'catalogo', titulo: 'Catálogo', tituloCorto: 'Catálogo', ruta: RUTAS.catalogo, icono: gameControllerOutline },
  { clave: 'publicar', titulo: 'Publicar juego', tituloCorto: 'Publicar', ruta: RUTAS.publicar, icono: addCircleOutline, rol: 'usuario' },
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
    clave: 'admin',
    titulo: 'Administración',
    tituloCorto: 'Admin',
    ruta: RUTAS.adminUsuarios,
    icono: shieldCheckmarkOutline,
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
