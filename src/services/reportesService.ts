/**
 * Reportes de publicaciones (RF-09) y resolución administrativa (RF-10).
 */
import type {
  AccionModeracion,
  EstadoReporte,
  MotivoReporte,
  Reporte,
  ResumenAdmin,
} from '../models';
import { solicitar } from './api';

export const MOTIVOS_REPORTE: MotivoReporte[] = [
  'Información falsa o engañosa',
  'Producto no corresponde a un videojuego físico',
  'Precio sospechoso o estafa',
  'Contenido ofensivo o inapropiado',
  'Publicación duplicada',
  'Otro',
];

export interface DatosReporte {
  publicacionId: number;
  motivo: MotivoReporte;
  comentario?: string;
}

export function crearReporte(datos: DatosReporte): Promise<Reporte> {
  return solicitar<Reporte>('/reportes', 'POST', datos);
}

export function obtenerResumenAdmin(): Promise<ResumenAdmin> {
  return solicitar<ResumenAdmin>('/reportes/resumen');
}

export function listarReportes(estado?: EstadoReporte): Promise<Reporte[]> {
  const consulta = estado ? `?estado=${encodeURIComponent(estado)}` : '';
  return solicitar<Reporte[]>(`/reportes${consulta}`);
}

export function resolverReporte(
  id: number,
  accion: AccionModeracion,
  notaModeracion?: string,
): Promise<Reporte> {
  return solicitar<Reporte>(`/reportes/${id}/resolver`, 'PATCH', {
    accion,
    notaModeracion: notaModeracion?.trim() || undefined,
  });
}
