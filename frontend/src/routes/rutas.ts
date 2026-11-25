/**
 * Rutas de la aplicación (documento, sección 4.1 y 4.2).
 * Centralizarlas evita escribir rutas a mano en las vistas y mantiene la navegación consistente.
 */
export const RUTAS = {
  inicio: '/',
  catalogo: '/catalogo',
  detalle: '/publicacion/:id',
  favoritos: '/favoritos',
  publicar: '/publicar',
  editar: '/publicaciones/:id/editar',
  misPublicaciones: '/mis-publicaciones',
  operaciones: '/operaciones',
  calificar: '/calificar/:operacionId',
  perfil: '/perfil',
  notificaciones: '/notificaciones',
  admin: '/admin',
  adminReportes: '/admin/reportes',
  adminPublicaciones: '/admin/publicaciones',
  adminUsuarios: '/admin/usuarios',
  login: '/login',
  registro: '/registro',
} as const;

/** Construye la ruta al detalle de una publicación concreta. */
export function rutaDetalle(id: string | number): string {
  return `/publicacion/${id}`;
}

/** Construye la ruta para editar una publicación propia (RF-04). */
export function rutaEditar(id: string | number): string {
  return `/publicaciones/${id}/editar`;
}

/** Construye la ruta para calificar una operación completada (RF-08). */
export function rutaCalificar(operacionId: string | number): string {
  return `/calificar/${operacionId}`;
}

/**
 * Ruta de acceso que recuerda la página solicitada, para volver a ella después de iniciar
 * sesión (Task Flow 1). Se usa un parámetro en la URL en lugar del estado de navegación
 * porque el contenedor de rutas de Ionic no conserva ese estado entre redirecciones.
 */
export function rutaLoginCon(destino: string): string {
  return `${RUTAS.login}?volver=${encodeURIComponent(destino)}`;
}

/** Lee el destino pendiente desde la query string de /login. */
export function destinoPendiente(busqueda: string): string | null {
  return new URLSearchParams(busqueda).get('volver');
}
