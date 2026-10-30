/**
 * Catálogo, detalle y gestión de publicaciones contra la API REST (RF-01 a RF-04).
 */
import { PRECIO_MAXIMO } from '../data/catalogos';
import type { DatosPublicacion, EstadoPublicacion, FiltrosCatalogo, Publicacion } from '../models';
import { ErrorApi, solicitar } from './api';

/** Estado inicial de los filtros del catálogo: sin filtrar. */
export const FILTROS_INICIALES: FiltrosCatalogo = {
  texto: '',
  consola: '',
  genero: '',
  estadoConservacion: '',
  comuna: '',
  precioMaximo: PRECIO_MAXIMO,
};

/**
 * Publicaciones visibles en el catálogo. La API devuelve las activas y las pausadas (marcadas con
 * su estado) y deja fuera las vendidas y las ocultas por moderación. La búsqueda por texto ignora
 * mayúsculas y tildes. Con el precio en el tope del control no se filtra por precio.
 */
export function listarPublicaciones(filtros: FiltrosCatalogo): Promise<Publicacion[]> {
  const parametros = new URLSearchParams();
  const texto = filtros.texto.trim();
  if (texto) parametros.set('texto', texto);
  if (filtros.consola) parametros.set('consola', filtros.consola);
  if (filtros.genero) parametros.set('genero', filtros.genero);
  if (filtros.estadoConservacion) parametros.set('estadoConservacion', filtros.estadoConservacion);
  if (filtros.comuna) parametros.set('comuna', filtros.comuna);
  if (filtros.precioMaximo < PRECIO_MAXIMO) parametros.set('precioMaximo', String(filtros.precioMaximo));

  const consulta = parametros.toString();
  return solicitar<Publicacion[]>(`/publicaciones${consulta ? `?${consulta}` : ''}`);
}

/** Detalle de una publicación; undefined si no existe o fue retirada del catálogo. */
export async function obtenerPublicacion(id: string | number): Promise<Publicacion | undefined> {
  try {
    return await solicitar<Publicacion>(`/publicaciones/${encodeURIComponent(id)}`);
  } catch (error) {
    if (error instanceof ErrorApi && (error.estado === 404 || error.estado === 400)) {
      return undefined;
    }
    throw error;
  }
}

/** Publicaciones propias en cualquier estado (RF-04). */
export function listarMisPublicaciones(): Promise<Publicacion[]> {
  return solicitar<Publicacion[]>('/publicaciones/mias');
}

export function crearPublicacion(datos: DatosPublicacion): Promise<Publicacion> {
  return solicitar<Publicacion>('/publicaciones', 'POST', datos);
}

export function actualizarPublicacion(id: number, datos: DatosPublicacion): Promise<Publicacion> {
  return solicitar<Publicacion>(`/publicaciones/${id}`, 'PUT', datos);
}

/** Pausar o reactivar una publicación propia. */
export function cambiarEstadoPublicacion(
  id: number,
  estadoPublicacion: Exclude<EstadoPublicacion, 'vendida'>,
): Promise<Publicacion> {
  return solicitar<Publicacion>(`/publicaciones/${id}/estado`, 'PATCH', { estadoPublicacion });
}

export function eliminarPublicacion(id: number): Promise<void> {
  return solicitar<void>(`/publicaciones/${id}`, 'DELETE');
}

/** Indica si la publicación admite iniciar una solicitud de compra (RF-06). */
export function estaDisponible(publicacion: Publicacion): boolean {
  return publicacion.estadoPublicacion === 'activa';
}

/** Cantidad de filtros activos, usada para avisar al usuario en el catálogo. */
export function contarFiltrosActivos(filtros: FiltrosCatalogo): number {
  let total = 0;
  if (filtros.consola) total += 1;
  if (filtros.genero) total += 1;
  if (filtros.estadoConservacion) total += 1;
  if (filtros.comuna) total += 1;
  if (filtros.precioMaximo < PRECIO_MAXIMO) total += 1;
  return total;
}

/** Color del badge según el estado de la publicación. */
export function colorEstadoPublicacion(estado: EstadoPublicacion): string {
  switch (estado) {
    case 'activa':
      return 'success';
    case 'pausada':
      return 'warning';
    default:
      return 'medium';
  }
}
