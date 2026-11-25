/**
 * Notificaciones persistentes del usuario autenticado (EF1).
 */
import type { Notificacion } from '../models';
import { solicitar } from './api';

export interface RespuestaNotificaciones {
  notificaciones: Notificacion[];
  noLeidas: number;
}

export function listarNotificaciones(): Promise<RespuestaNotificaciones> {
  return solicitar<RespuestaNotificaciones>('/notificaciones');
}

export function marcarNotificacionLeida(id: number): Promise<{ ok: boolean }> {
  return solicitar<{ ok: boolean }>(`/notificaciones/${id}/leer`, 'PATCH');
}

export function marcarTodasNotificacionesLeidas(): Promise<{ ok: boolean }> {
  return solicitar<{ ok: boolean }>('/notificaciones/leer-todas', 'PATCH');
}
