/**
 * Carga dinámica y cacheada de los catálogos del sistema desde GET /api/catalogos (EF2),
 * con respaldo en los datos locales si el servidor no responde inicialmente.
 */
import {
  CONSOLAS,
  ESTADOS_CONSERVACION,
  GENEROS,
  MODALIDADES_ENTREGA,
  REGIONES,
  type Region,
} from '../data/catalogos';
import type { EstadoConservacion, ModalidadEntrega } from '../models';
import { solicitar } from './api';

export interface CatalogosSistema {
  consolas: string[];
  generos: string[];
  estadosConservacion: EstadoConservacion[];
  modalidadesEntrega: ModalidadEntrega[];
  regiones: Region[];
}

export const CATALOGOS_RESPALDO: CatalogosSistema = {
  consolas: CONSOLAS,
  generos: GENEROS,
  estadosConservacion: ESTADOS_CONSERVACION,
  modalidadesEntrega: MODALIDADES_ENTREGA,
  regiones: REGIONES,
};

let cache: CatalogosSistema | null = null;
let promesaEnCurso: Promise<CatalogosSistema> | null = null;

export function obtenerCatalogos(): Promise<CatalogosSistema> {
  if (cache) {
    return Promise.resolve(cache);
  }
  if (!promesaEnCurso) {
    promesaEnCurso = solicitar<CatalogosSistema>('/catalogos')
      .then((datos) => {
        cache = datos;
        return datos;
      })
      .catch(() => CATALOGOS_RESPALDO)
      .finally(() => {
        promesaEnCurso = null;
      });
  }
  return promesaEnCurso;
}
