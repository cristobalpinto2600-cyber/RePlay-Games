/**
 * Catálogos fijos usados por formularios y filtros.
 * Centralizarlos evita repetir listas en las vistas y estandariza la información (RF-01, RF-03).
 */
import type { EstadoConservacion, ModalidadEntrega } from '../models';

export const CONSOLAS: string[] = [
  'PlayStation 5',
  'PlayStation 4',
  'Nintendo Switch',
  'Xbox Series X|S',
  'Xbox One',
  'Nintendo 3DS',
];

export const GENEROS: string[] = [
  'Acción / Aventura',
  'RPG',
  'Deportes',
  'Carreras',
  'Plataformas',
  'Estrategia',
  'Terror',
];

export const ESTADOS_CONSERVACION: EstadoConservacion[] = [
  'Nuevo / sellado',
  'Como nuevo',
  'Bueno',
  'Aceptable',
  'Con detalles',
];

export const MODALIDADES_ENTREGA: ModalidadEntrega[] = [
  'Retiro en persona',
  'Punto de encuentro',
  'Envío por pagar',
];

export interface Region {
  nombre: string;
  comunas: string[];
}

export const REGIONES: Region[] = [
  {
    nombre: 'Valparaíso',
    comunas: ['Valparaíso', 'Viña del Mar', 'Quilpué', 'Villa Alemana', 'Concón'],
  },
  {
    nombre: 'Metropolitana',
    comunas: ['Santiago', 'Providencia', 'Ñuñoa', 'Maipú', 'La Florida'],
  },
  {
    nombre: 'Biobío',
    comunas: ['Concepción', 'Talcahuano', 'San Pedro de la Paz'],
  },
];

export const COMUNAS: string[] = REGIONES.flatMap((region) => region.comunas);

/** Tope del filtro de precio del catálogo, en pesos chilenos. */
export const PRECIO_MAXIMO = 80000;
