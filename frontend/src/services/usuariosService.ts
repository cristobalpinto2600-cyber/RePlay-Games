/** Datos públicos del vendedor (RF-02) y gestión administrativa de usuarios. */
import type { Usuario } from '../models';
import { ErrorApi, solicitar } from './api';

export async function obtenerUsuario(id: number): Promise<Usuario | undefined> {
  try {
    return await solicitar<Usuario>(`/usuarios/${id}`);
  } catch (error) {
    if (error instanceof ErrorApi && error.estado === 404) {
      return undefined;
    }
    throw error;
  }
}

/** Solo administrador. */
export function listarUsuarios(): Promise<Usuario[]> {
  return solicitar<Usuario[]>('/usuarios');
}

/** Solo administrador: una cuenta desactivada no puede iniciar sesión. */
export function cambiarEstadoUsuario(id: number, activo: boolean): Promise<Usuario> {
  return solicitar<Usuario>(`/usuarios/${id}/estado`, 'PATCH', { activo });
}
