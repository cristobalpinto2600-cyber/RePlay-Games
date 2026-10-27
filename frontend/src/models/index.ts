/**
 * Modelos del dominio de RePlay Games (EP1).
 * Estas interfaces describen la información que en EP2 entregará la API REST,
 * por lo que las páginas y los componentes solo dependen de estos tipos.
 */

/** Roles del sistema (documento, sección 2.4). */
export type Rol = 'usuario' | 'administrador';

/** Estado de conservación estandarizado del videojuego (RF-02). */
export type EstadoConservacion =
  | 'Nuevo / sellado'
  | 'Como nuevo'
  | 'Bueno'
  | 'Aceptable'
  | 'Con detalles';

/** Estado de la publicación dentro de la plataforma (RF-04). */
export type EstadoPublicacion = 'activa' | 'pausada' | 'vendida';

/** Modalidades de entrega ofrecidas por el vendedor (RF-06). */
export type ModalidadEntrega = 'Retiro en persona' | 'Punto de encuentro' | 'Envío por pagar';

/** Estados por los que pasa una operación entre comprador y vendedor (RF-07). */
export type EstadoOperacion = 'pendiente' | 'confirmada' | 'completada' | 'cancelada';

export interface Usuario {
  id: string;
  nombreUsuario: string;
  correo: string;
  rol: Rol;
  region?: string;
  comuna?: string;
  /** Promedio de calificaciones recibidas, de 0 a 5. */
  reputacion: number;
  totalCalificaciones: number;
  fechaRegistro: string;
}

export interface Publicacion {
  id: string;
  titulo: string;
  consola: string;
  genero: string;
  /** Precio en pesos chilenos. */
  precio: number;
  estadoConservacion: EstadoConservacion;
  estadoPublicacion: EstadoPublicacion;
  descripcion: string;
  region: string;
  comuna: string;
  entregas: ModalidadEntrega[];
  incluyeCaja: boolean;
  incluyeManual: boolean;
  vendedorId: string;
  fechaPublicacion: string;
}

export interface Operacion {
  id: string;
  publicacionId: string;
  compradorId: string;
  vendedorId: string;
  estado: EstadoOperacion;
  modalidadEntrega: ModalidadEntrega;
  fechaCreacion: string;
  calificada: boolean;
}

/** Filtros del catálogo (RF-01). Un valor vacío significa "sin filtrar". */
export interface FiltrosCatalogo {
  texto: string;
  consola: string;
  genero: string;
  estadoConservacion: string;
  comuna: string;
  precioMaximo: number;
}

export interface Credenciales {
  correo: string;
  clave: string;
}

export interface DatosRegistro {
  nombreUsuario: string;
  correo: string;
  clave: string;
  region?: string;
  comuna?: string;
}
