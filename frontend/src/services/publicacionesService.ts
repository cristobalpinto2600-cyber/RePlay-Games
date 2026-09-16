/**
 * Consulta del catálogo y del detalle de publicaciones (RF-01, RF-02).
 * Los datos son estáticos en EP1; en EP2 el cuerpo de estas funciones se reemplaza por
 * llamadas fetch a la API REST sin cambiar las páginas ni los componentes.
 */
import { PRECIO_MAXIMO } from '../data/catalogos';
import { PUBLICACIONES } from '../data/publicaciones';
import type { FiltrosCatalogo, Publicacion } from '../models';
import { demora } from '../utils/demora';

/** Estado inicial de los filtros del catálogo: sin filtrar. */
export const FILTROS_INICIALES: FiltrosCatalogo = {
  texto: '',
  consola: '',
  genero: '',
  estadoConservacion: '',
  comuna: '',
  precioMaximo: PRECIO_MAXIMO,
};

/** Quita tildes para que la búsqueda encuentre "pokemon" y "Pokémon" por igual. */
function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Publicaciones visibles en el catálogo.
 * Se incluyen las pausadas, marcadas con su estado, para poder mostrar en la demo que una
 * publicación no disponible no permite iniciar una operación (documento, sección 4.7).
 * Las vendidas quedan fuera del catálogo y solo se alcanzan desde el historial de operaciones.
 */
export async function listarPublicaciones(filtros: FiltrosCatalogo): Promise<Publicacion[]> {
  await demora();
  const texto = normalizar(filtros.texto);

  return PUBLICACIONES.filter((publicacion) => {
    if (publicacion.estadoPublicacion === 'vendida') {
      return false;
    }
    if (
      texto &&
      !normalizar(`${publicacion.titulo} ${publicacion.consola} ${publicacion.genero}`).includes(texto)
    ) {
      return false;
    }
    if (filtros.consola && publicacion.consola !== filtros.consola) {
      return false;
    }
    if (filtros.genero && publicacion.genero !== filtros.genero) {
      return false;
    }
    if (filtros.estadoConservacion && publicacion.estadoConservacion !== filtros.estadoConservacion) {
      return false;
    }
    if (filtros.comuna && publicacion.comuna !== filtros.comuna) {
      return false;
    }
    return publicacion.precio <= filtros.precioMaximo;
  }).sort((a, b) => b.fechaPublicacion.localeCompare(a.fechaPublicacion));
}

export async function obtenerPublicacion(id: string): Promise<Publicacion | undefined> {
  await demora();
  return PUBLICACIONES.find((publicacion) => publicacion.id === id);
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
