/**
 * Consulta de compras y ventas del usuario (RF-06, RF-07).
 * En EP1 las operaciones son datos estáticos: la solicitud de compra del detalle muestra la
 * confirmación y el resumen, pero no crea registros nuevos.
 */
import { OPERACIONES } from '../data/operaciones';
import { PUBLICACIONES } from '../data/publicaciones';
import type { EstadoOperacion, Operacion, Publicacion, Usuario } from '../models';
import { demora } from '../utils/demora';
import { obtenerUsuarioLocal } from './usuariosService';

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

function detallar(operacion: Operacion, usuarioId: string): OperacionDetallada | null {
  const publicacion = PUBLICACIONES.find((item) => item.id === operacion.publicacionId);
  const esComprador = operacion.compradorId === usuarioId;
  const contraparte = obtenerUsuarioLocal(esComprador ? operacion.vendedorId : operacion.compradorId);

  if (!publicacion || !contraparte) {
    return null;
  }
  return {
    operacion,
    publicacion,
    contraparte,
    rolUsuario: esComprador ? 'comprador' : 'vendedor',
  };
}

/** Separa las operaciones del usuario en compras y ventas, de la más reciente a la más antigua. */
export async function listarOperaciones(usuarioId: string): Promise<OperacionesDelUsuario> {
  await demora();
  const ordenadas = [...OPERACIONES].sort((a, b) => b.fechaCreacion.localeCompare(a.fechaCreacion));

  const detalladas = ordenadas
    .filter(
      (operacion) => operacion.compradorId === usuarioId || operacion.vendedorId === usuarioId,
    )
    .map((operacion) => detallar(operacion, usuarioId))
    .filter((item): item is OperacionDetallada => item !== null);

  return {
    compras: detalladas.filter((item) => item.rolUsuario === 'comprador'),
    ventas: detalladas.filter((item) => item.rolUsuario === 'vendedor'),
  };
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
