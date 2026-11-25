/**
 * Catálogo, detalle, gestión de publicaciones y moderación contra la API REST (RF-01 a RF-04, RF-10, EF2).
 */
import { PRECIO_MAXIMO } from '../data/catalogos';
import type {
  DatosPublicacion,
  EstadoPublicacion,
  FiltrosCatalogo,
  Publicacion,
  PublicacionAdmin,
} from '../models';
import { ErrorApi, solicitar, solicitarConCabeceras } from './api';

export type OrdenCatalogo = 'recientes' | 'precio_asc' | 'precio_desc';

export interface OpcionesCatalogo {
  page?: number;
  limit?: number;
  orden?: OrdenCatalogo;
}

export interface RespuestaCatalogoPaginado {
  items: Publicacion[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/** Estado inicial de los filtros del catálogo: sin filtrar. */
export const FILTROS_INICIALES: FiltrosCatalogo = {
  texto: '',
  consola: '',
  genero: '',
  estadoConservacion: '',
  comuna: '',
  precioMaximo: PRECIO_MAXIMO,
};

function construirQueryCatalogo(
  filtros: FiltrosCatalogo,
  opciones: OpcionesCatalogo = {},
): string {
  const parametros = new URLSearchParams();
  const texto = filtros.texto.trim();
  if (texto) parametros.set('texto', texto);
  if (filtros.consola) parametros.set('consola', filtros.consola);
  if (filtros.genero) parametros.set('genero', filtros.genero);
  if (filtros.estadoConservacion) parametros.set('estadoConservacion', filtros.estadoConservacion);
  if (filtros.comuna) parametros.set('comuna', filtros.comuna);
  if (filtros.precioMaximo < PRECIO_MAXIMO) {
    parametros.set('precioMaximo', String(filtros.precioMaximo));
  }
  if (opciones.orden && opciones.orden !== 'recientes') {
    parametros.set('orden', opciones.orden);
  }
  if (opciones.page !== undefined) {
    parametros.set('page', String(opciones.page));
  }
  if (opciones.limit !== undefined) {
    parametros.set('limit', String(opciones.limit));
  }
  const consulta = parametros.toString();
  return consulta ? `?${consulta}` : '';
}

export function listarPublicaciones(filtros: FiltrosCatalogo): Promise<Publicacion[]> {
  return solicitar<Publicacion[]>(`/publicaciones${construirQueryCatalogo(filtros)}`);
}

/** Lista paginada para carga progresiva en el catálogo (EF2, EF4). */
export async function listarPublicacionesPaginadas(
  filtros: FiltrosCatalogo,
  opciones: OpcionesCatalogo = { page: 1, limit: 8, orden: 'recientes' },
): Promise<RespuestaCatalogoPaginado> {
  const query = construirQueryCatalogo(filtros, opciones);
  const { datos, headers } = await solicitarConCabeceras<Publicacion[]>(`/publicaciones${query}`);

  const total = Number(headers.get('X-Total-Count')) || datos.length;
  const page = Number(headers.get('X-Page')) || opciones.page || 1;
  const limit = Number(headers.get('X-Limit')) || opciones.limit || Math.max(datos.length, 1);
  const totalPages = Number(headers.get('X-Total-Pages')) || Math.max(1, Math.ceil(total / limit));

  return { items: datos, total, page, limit, totalPages };
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

/** Listado completo para moderación administrativa (RF-10). */
export function listarPublicacionesAdmin(): Promise<PublicacionAdmin[]> {
  return solicitar<PublicacionAdmin[]>('/publicaciones/admin');
}

/** Ocultar o restaurar una publicación como administrador (RF-10). */
export function moderarPublicacion(id: number, oculta: boolean): Promise<Publicacion> {
  return solicitar<Publicacion>(`/publicaciones/${id}/moderacion`, 'PATCH', { oculta });
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
