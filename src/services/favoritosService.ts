/**
 * Gestión de favoritos contra la API REST (RF-05).
 */
import type { Publicacion } from '../models';
import { solicitar } from './api';

export function listarFavoritos(): Promise<Publicacion[]> {
  return solicitar<Publicacion[]>('/favoritos');
}

export async function listarIdsFavoritos(): Promise<number[]> {
  const { ids } = await solicitar<{ ids: number[] }>('/favoritos/ids');
  return ids;
}

export function agregarFavorito(publicacionId: number): Promise<{ ok: boolean; publicacionId: number }> {
  return solicitar(`/favoritos/${publicacionId}`, 'POST');
}

export function quitarFavorito(publicacionId: number): Promise<void> {
  return solicitar<void>(`/favoritos/${publicacionId}`, 'DELETE');
}
