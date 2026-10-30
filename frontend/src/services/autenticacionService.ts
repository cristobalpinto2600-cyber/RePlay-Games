/**
 * Autenticación contra la API REST con JWT (FT-01, FT-02, FT-03).
 * Las firmas son las mismas de EP1, por lo que las páginas que las usan no cambian.
 */
import type { Credenciales, DatosRegistro, Usuario } from '../models';
import { borrar, escribir, leer } from './almacenamiento';
import { CLAVE_SESION, ErrorApi, type SesionGuardada, solicitar } from './api';

interface RespuestaSesion {
  token: string;
  expiraEn: string;
  usuario: Usuario;
}

function guardarSesion(token: string, usuario: Usuario): void {
  escribir(CLAVE_SESION, { token, usuario } satisfies SesionGuardada);
}

/** Envía las credenciales; si son válidas guarda el token y deja la sesión iniciada. */
export async function iniciarSesion({ correo, clave }: Credenciales): Promise<Usuario> {
  const { token, usuario } = await solicitar<RespuestaSesion>('/auth/login', 'POST', {
    correo: correo.trim(),
    clave,
  });
  guardarSesion(token, usuario);
  return usuario;
}

/** Crea la cuenta en el backend e inicia sesión con ella. */
export async function registrar(datos: DatosRegistro): Promise<Usuario> {
  const { token, usuario } = await solicitar<RespuestaSesion>('/auth/registro', 'POST', {
    ...datos,
    nombreUsuario: datos.nombreUsuario.trim(),
    correo: datos.correo.trim(),
  });
  guardarSesion(token, usuario);
  return usuario;
}

/** Usuario guardado localmente, disponible de inmediato al abrir la aplicación. */
export function leerSesion(): Usuario | null {
  const guardada = leer<SesionGuardada>(CLAVE_SESION);
  return guardada?.token ? guardada.usuario : null;
}

/**
 * Confirma con el backend que el token guardado sigue vigente y actualiza los datos del usuario.
 * Si la API no responde se conserva la sesión local para no expulsar a la persona sin motivo.
 */
export async function verificarSesion(): Promise<Usuario | null> {
  const guardada = leer<SesionGuardada>(CLAVE_SESION);
  if (!guardada?.token) {
    borrar(CLAVE_SESION);
    return null;
  }
  try {
    const usuario = await solicitar<Usuario>('/auth/perfil');
    guardarSesion(guardada.token, usuario);
    return usuario;
  } catch (error) {
    if (error instanceof ErrorApi && error.estado === 401) {
      return null;
    }
    return guardada.usuario;
  }
}

/** Los JWT no guardan estado en el servidor: cerrar sesión es descartar el token. */
export function cerrarSesion(): void {
  borrar(CLAVE_SESION);
}
