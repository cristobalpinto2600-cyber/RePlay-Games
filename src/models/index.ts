/**
 * Modelos del dominio de RePlay Games.
 * Estas interfaces describen la información que entrega la API REST del backend, por lo que
 * las páginas y los componentes solo dependen de estos tipos.
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
  id: number;
  nombreUsuario: string;
  /** Solo se recibe en la propia cuenta y en la vista administrativa, nunca en el perfil público. */
  correo?: string;
  rol: Rol;
  region?: string;
  comuna?: string;
  /** Promedio de calificaciones recibidas, de 0 a 5. */
  reputacion: number;
  totalCalificaciones: number;
  fechaRegistro: string;
  /** Estado de la cuenta; una cuenta desactivada por la administración no puede iniciar sesión. */
  activo?: boolean;
}

export interface Publicacion {
  id: number;
  titulo: string;
  consola: string;
  genero: string;
  /** Precio en pesos chilenos. */
  precio: number;
  estadoConservacion: EstadoConservacion;
  estadoPublicacion: EstadoPublicacion;
  descripcion: string;
  imagenUrl?: string;
  region: string;
  comuna: string;
  entregas: ModalidadEntrega[];
  incluyeCaja: boolean;
  incluyeManual: boolean;
  vendedorId: number;
  /** Datos públicos del vendedor embebidos en el detalle para evitar peticiones extra (EF4). */
  vendedor?: Usuario;
  fechaPublicacion: string;
  /** Oculta por moderación del administrador (RF-10). */
  oculta?: boolean;
}

export interface PublicacionAdmin extends Publicacion {
  vendedorNombre: string;
  reportesPendientes: number;
}

/** Datos que se envían al crear o editar una publicación (RF-03, RF-04). */
export type DatosPublicacion = Pick<
  Publicacion,
  | 'titulo'
  | 'consola'
  | 'genero'
  | 'precio'
  | 'estadoConservacion'
  | 'descripcion'
  | 'imagenUrl'
  | 'region'
  | 'comuna'
  | 'entregas'
  | 'incluyeCaja'
  | 'incluyeManual'
>;

export interface Operacion {
  id: number;
  publicacionId: number;
  compradorId: number;
  vendedorId: number;
  estado: EstadoOperacion;
  modalidadEntrega: ModalidadEntrega;
  fechaCreacion: string;
  calificada: boolean;
}

export interface Calificacion {
  id: number;
  operacionId: number;
  puntaje: number;
  comentario: string;
  fecha: string;
  evaluador: {
    id: number;
    nombreUsuario: string;
  };
  publicacion: {
    id: number;
    titulo: string;
  };
}

export type MotivoReporte =
  | 'Información falsa o engañosa'
  | 'Producto no corresponde a un videojuego físico'
  | 'Precio sospechoso o estafa'
  | 'Contenido ofensivo o inapropiado'
  | 'Publicación duplicada'
  | 'Otro';

export type EstadoReporte = 'pendiente' | 'revisado' | 'descartado';
export type AccionModeracion = 'mantener' | 'ocultar' | 'descartar';

export interface Reporte {
  id: number;
  publicacionId: number;
  motivo: MotivoReporte;
  comentario: string;
  estado: EstadoReporte;
  accionTomada: 'ninguna' | 'mantener' | 'ocultar';
  notaModeracion?: string;
  fechaCreacion: string;
  fechaResolucion?: string;
  publicacion: {
    id: number;
    titulo: string;
    consola: string;
    precio: number;
    oculta: boolean;
    estadoPublicacion: EstadoPublicacion;
    vendedorId: number;
    vendedorNombre: string;
  };
  reportante: {
    id: number;
    nombreUsuario: string;
  };
  moderadorNombre?: string;
}

export type TipoNotificacion = 'operacion' | 'calificacion' | 'moderacion' | 'sistema';

export interface Notificacion {
  id: number;
  tipo: TipoNotificacion;
  titulo: string;
  mensaje: string;
  ruta?: string;
  leida: boolean;
  fechaCreacion: string;
}

export interface ResumenAdmin {
  reportesPendientes: number;
  publicacionesActivas: number;
  publicacionesOcultas: number;
  usuariosActivos: number;
  usuariosTotales: number;
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
