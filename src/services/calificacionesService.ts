/**
 * Calificaciones de operaciones completadas y consulta de reseñas por usuario (RF-08).
 */
import type { Calificacion } from '../models';
import { solicitar } from './api';

export interface DatosCalificacion {
  operacionId: number;
  puntaje: number;
  comentario?: string;
}

export interface RespuestaCalificacion {
  id: number;
  operacionId: number;
  puntaje: number;
  comentario: string;
  reputacionEvaluado: number;
  totalCalificacionesEvaluado: number;
}

export function crearCalificacion(datos: DatosCalificacion): Promise<RespuestaCalificacion> {
  return solicitar<RespuestaCalificacion>('/calificaciones', 'POST', datos);
}

export function listarCalificacionesUsuario(usuarioId: number): Promise<Calificacion[]> {
  return solicitar<Calificacion[]>(`/calificaciones/usuario/${usuarioId}`);
}
