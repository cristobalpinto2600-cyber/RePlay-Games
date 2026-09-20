/**
 * Servicio de autenticación simulado (FT-01, FT-02, FT-03).
 * En EP2 estas funciones pasan a llamar a la API REST con JWT; la firma se mantiene igual
 * para no modificar las páginas que ya las usan.
 */
import { CLAVE_DEMO, USUARIOS } from '../data/usuarios';
import type { Credenciales, DatosRegistro, Usuario } from '../models';
import { demora } from '../utils/demora';
import { borrar, escribir, leer } from './almacenamiento';

const CLAVE_SESION = 'replay.sesion';

/** Valida las credenciales contra las cuentas de ejemplo y deja la sesión iniciada. */
export async function iniciarSesion({ correo, clave }: Credenciales): Promise<Usuario> {
  await demora();
  const usuario = USUARIOS.find(
    (candidato) => candidato.correo.toLowerCase() === correo.trim().toLowerCase(),
  );
  if (!usuario || clave !== CLAVE_DEMO) {
    throw new Error('El correo o la contraseña no son correctos.');
  }
  guardarSesion(usuario);
  return usuario;
}

/**
 * Crea una cuenta de demostración. Los datos mock son estáticos en EP1, por lo que el usuario
 * creado vive solo en la sesión actual y no se agrega al listado de usuarios.
 */
export async function registrar(datos: DatosRegistro): Promise<Usuario> {
  await demora();
  const correo = datos.correo.trim().toLowerCase();
  const yaExiste = USUARIOS.some((usuario) => usuario.correo.toLowerCase() === correo);
  if (yaExiste) {
    throw new Error('Ya existe una cuenta registrada con ese correo.');
  }

  const usuario: Usuario = {
    id: `u-${Date.now()}`,
    nombreUsuario: datos.nombreUsuario.trim(),
    correo,
    rol: 'usuario',
    region: datos.region,
    comuna: datos.comuna,
    reputacion: 0,
    totalCalificaciones: 0,
    fechaRegistro: new Date().toISOString().slice(0, 10),
  };
  guardarSesion(usuario);
  return usuario;
}

export function leerSesion(): Usuario | null {
  return leer<Usuario>(CLAVE_SESION);
}

export function guardarSesion(usuario: Usuario): void {
  escribir(CLAVE_SESION, usuario);
}

export function cerrarSesion(): void {
  borrar(CLAVE_SESION);
}
