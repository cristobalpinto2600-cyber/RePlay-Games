/**
 * Consumo de la integración externa RAWG vía backend (EF5).
 */
import { solicitar } from './api';

export interface JuegoExterno {
  idExterno: number;
  titulo: string;
  fechaLanzamiento: string | null;
  metacritic: number | null;
  rating: number | null;
  imagenUrl: string | null;
  plataformas: string[];
  generos: string[];
}

export interface RespuestaBusquedaExterna {
  disponible: boolean;
  fuente: string;
  mensaje?: string;
  resultados: JuegoExterno[];
}

export interface RespuestaFichaExterna {
  disponible: boolean;
  fuente: string;
  mensaje?: string;
  ficha: JuegoExterno | null;
}

export function buscarJuegosExternos(consulta: string): Promise<RespuestaBusquedaExterna> {
  return solicitar<RespuestaBusquedaExterna>(
    `/juegos-externos/buscar?q=${encodeURIComponent(consulta.trim())}`,
  );
}

export function obtenerFichaExterna(titulo: string): Promise<RespuestaFichaExterna> {
  return solicitar<RespuestaFichaExterna>(
    `/juegos-externos/ficha?titulo=${encodeURIComponent(titulo.trim())}`,
  );
}
