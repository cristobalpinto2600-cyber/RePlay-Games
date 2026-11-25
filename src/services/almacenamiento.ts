/**
 * Acceso seguro a localStorage (EF1: persistencia de sesión, filtros, búsquedas y borradores).
 *
 * Todos los accesos capturan excepciones para no afectar la aplicación en modos privados donde
 * el navegador bloquea el almacenamiento.
 */
import type { EstadoConservacion, FiltrosCatalogo, ModalidadEntrega } from '../models';

export const CLAVE_FILTROS = 'replay.filtros';
export const CLAVE_BUSQUEDAS = 'replay.busquedas';
export const CLAVE_BORRADOR_PUBLICAR = 'replay.borrador_publicar';

const MAX_BUSQUEDAS_RECIENTES = 5;

export interface BorradorPublicacion {
  titulo: string;
  consola: string;
  genero: string;
  estadoConservacion: EstadoConservacion | '';
  precio: string;
  descripcion: string;
  imagenUrl?: string;
  region: string;
  comuna: string;
  entregas: ModalidadEntrega[];
  incluyeCaja: boolean;
  incluyeManual: boolean;
}

export function leer<T>(clave: string): T | null {
  try {
    const valor = window.localStorage.getItem(clave);
    return valor ? (JSON.parse(valor) as T) : null;
  } catch {
    return null;
  }
}

export function escribir(clave: string, valor: unknown): void {
  try {
    window.localStorage.setItem(clave, JSON.stringify(valor));
  } catch {
    // El navegador puede bloquear el almacenamiento (modo privado): la aplicación sigue funcionando.
  }
}

export function borrar(clave: string): void {
  try {
    window.localStorage.removeItem(clave);
  } catch {
    // Sin acción: ver comentario anterior.
  }
}

export function leerFiltros(): Partial<FiltrosCatalogo> | null {
  return leer<Partial<FiltrosCatalogo>>(CLAVE_FILTROS);
}

export function guardarFiltros(filtros: FiltrosCatalogo): void {
  escribir(CLAVE_FILTROS, filtros);
}

export function borrarFiltros(): void {
  borrar(CLAVE_FILTROS);
}

export function leerBusquedasRecientes(): string[] {
  const guardadas = leer<string[]>(CLAVE_BUSQUEDAS);
  return Array.isArray(guardadas) ? guardadas.filter((item) => typeof item === 'string') : [];
}

export function agregarBusquedaReciente(texto: string): string[] {
  const limpio = texto.trim();
  if (limpio.length < 3) {
    return leerBusquedasRecientes();
  }
  const actual = leerBusquedasRecientes().filter(
    (item) => item.toLowerCase() !== limpio.toLowerCase(),
  );
  const actualizado = [limpio, ...actual].slice(0, MAX_BUSQUEDAS_RECIENTES);
  escribir(CLAVE_BUSQUEDAS, actualizado);
  return actualizado;
}

export function limpiarBusquedasRecientes(): void {
  borrar(CLAVE_BUSQUEDAS);
}

export function leerBorradorPublicacion(): BorradorPublicacion | null {
  return leer<BorradorPublicacion>(CLAVE_BORRADOR_PUBLICAR);
}

export function guardarBorradorPublicacion(borrador: BorradorPublicacion): void {
  escribir(CLAVE_BORRADOR_PUBLICAR, borrador);
}

export function borrarBorradorPublicacion(): void {
  borrar(CLAVE_BORRADOR_PUBLICAR);
}
