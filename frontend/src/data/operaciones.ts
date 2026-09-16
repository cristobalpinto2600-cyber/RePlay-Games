/**
 * Operaciones simuladas del usuario demo (RF-06, RF-07, RF-08).
 * Cubren los cuatro estados definidos en el documento para poder mostrarlos en la vista
 * de compras y ventas sin necesidad de backend.
 */
import type { Operacion } from '../models';

export const OPERACIONES: Operacion[] = [
  {
    id: 'op-01',
    publicacionId: 'p-02',
    compradorId: 'u-01',
    vendedorId: 'u-03',
    estado: 'pendiente',
    modalidadEntrega: 'Envío por pagar',
    fechaCreacion: '2026-09-15',
    calificada: false,
  },
  {
    id: 'op-02',
    publicacionId: 'p-03',
    compradorId: 'u-01',
    vendedorId: 'u-04',
    estado: 'confirmada',
    modalidadEntrega: 'Punto de encuentro',
    fechaCreacion: '2026-09-11',
    calificada: false,
  },
  {
    id: 'op-03',
    publicacionId: 'p-09',
    compradorId: 'u-01',
    vendedorId: 'u-04',
    estado: 'completada',
    modalidadEntrega: 'Retiro en persona',
    fechaCreacion: '2026-09-03',
    calificada: false,
  },
  {
    id: 'op-04',
    publicacionId: 'p-10',
    compradorId: 'u-02',
    vendedorId: 'u-01',
    estado: 'completada',
    modalidadEntrega: 'Retiro en persona',
    fechaCreacion: '2026-08-23',
    calificada: true,
  },
  {
    id: 'op-05',
    publicacionId: 'p-05',
    compradorId: 'u-03',
    vendedorId: 'u-01',
    estado: 'pendiente',
    modalidadEntrega: 'Punto de encuentro',
    fechaCreacion: '2026-09-16',
    calificada: false,
  },
  {
    id: 'op-06',
    publicacionId: 'p-08',
    compradorId: 'u-04',
    vendedorId: 'u-01',
    estado: 'cancelada',
    modalidadEntrega: 'Retiro en persona',
    fechaCreacion: '2026-08-27',
    calificada: false,
  },
];
