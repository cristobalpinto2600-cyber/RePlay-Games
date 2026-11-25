/**
 * Solicitudes de compra y seguimiento de operaciones contra la API REST (RF-06, RF-07).
 */
import type { EstadoOperacion, ModalidadEntrega, Operacion, Publicacion, Usuario } from '../models';
import { solicitar } from './api';

/** Operación junto con la información que la vista necesita mostrar. */
export interface OperacionDetallada {
  operacion: Operacion;
  publicacion: Publicacion;
  contraparte: Usuario;
  rolUsuario: 'comprador' | 'vendedor';
}

export interface OperacionesDelUsuario {
  compras: OperacionDetallada[];
  ventas: OperacionDetallada[];
}

/** Acción que la persona puede realizar sobre una operación según su rol y el estado actual. */
export interface AccionOperacion {
  estado: Exclude<EstadoOperacion, 'pendiente'>;
  texto: string;
  color: string;
}

/** Compras y ventas del usuario autenticado, de la más reciente a la más antigua. */
export function listarOperaciones(): Promise<OperacionesDelUsuario> {
  return solicitar<OperacionesDelUsuario>('/operaciones');
}

/** Crea la solicitud de compra; queda pendiente de confirmación del vendedor. */
export function crearOperacion(
  publicacionId: number,
  modalidadEntrega: ModalidadEntrega,
): Promise<OperacionDetallada> {
  return solicitar<OperacionDetallada>('/operaciones', 'POST', { publicacionId, modalidadEntrega });
}

export function cambiarEstadoOperacion(
  id: number,
  estado: AccionOperacion['estado'],
): Promise<OperacionDetallada> {
  return solicitar<OperacionDetallada>(`/operaciones/${id}/estado`, 'PATCH', { estado });
}

/**
 * Mismas reglas que valida el backend: el vendedor confirma, completa o cancela; el comprador solo
 * puede cancelar mientras la solicitud está pendiente.
 */
export function accionesDisponibles({ operacion, rolUsuario }: OperacionDetallada): AccionOperacion[] {
  const cancelar: AccionOperacion = { estado: 'cancelada', texto: 'Cancelar', color: 'medium' };
  if (rolUsuario === 'vendedor') {
    if (operacion.estado === 'pendiente') {
      return [{ estado: 'confirmada', texto: 'Confirmar', color: 'primary' }, cancelar];
    }
    if (operacion.estado === 'confirmada') {
      return [{ estado: 'completada', texto: 'Marcar completada', color: 'success' }, cancelar];
    }
    return [];
  }
  return operacion.estado === 'pendiente' ? [cancelar] : [];
}

/** Color del badge según el estado de la operación (RNF-UX-02: mismos estados, mismos colores). */
export function colorEstado(estado: EstadoOperacion): string {
  switch (estado) {
    case 'pendiente':
      return 'warning';
    case 'confirmada':
      return 'primary';
    case 'completada':
      return 'success';
    case 'cancelada':
      return 'medium';
    default:
      return 'medium';
  }
}

/** Texto de apoyo que explica qué significa cada estado. */
export function descripcionEstado(estado: EstadoOperacion): string {
  switch (estado) {
    case 'pendiente':
      return 'Esperando que el vendedor confirme la solicitud.';
    case 'confirmada':
      return 'Acordada con el vendedor. Pendiente de entrega.';
    case 'completada':
      return 'Entrega realizada. Puedes calificar esta operación.';
    case 'cancelada':
      return 'La operación fue cancelada.';
    default:
      return '';
  }
}
