/** Consultas sobre usuarios: datos públicos y reputación del vendedor (RF-02). */
import { USUARIOS } from '../data/usuarios';
import type { Usuario } from '../models';
import { demora } from '../utils/demora';

export async function obtenerUsuario(id: string): Promise<Usuario | undefined> {
  await demora(120);
  return USUARIOS.find((usuario) => usuario.id === id);
}

/** Versión sincrónica para listados donde ya se dispone del identificador. */
export function obtenerUsuarioLocal(id: string): Usuario | undefined {
  return USUARIOS.find((usuario) => usuario.id === id);
}
