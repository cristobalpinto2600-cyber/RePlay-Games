/**
 * Cliente HTTP de la API REST (EP2).
 *
 * Centraliza la URL base, el envío del token JWT en el encabezado Authorization y la conversión
 * de las respuestas de error, de modo que cada servicio solo indique qué recurso consulta.
 * Si la API responde 401 a una solicitud que llevaba token (sesión expirada o cuenta
 * desactivada), se borra la sesión guardada y se avisa al resto de la aplicación.
 */
import type { Usuario } from '../models';
import { borrar, leer } from './almacenamiento';

export const URL_API = (import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api').replace(/\/$/, '');

/** Clave de localStorage donde se guardan el token y los datos del usuario autenticado. */
export const CLAVE_SESION = 'replay.sesion';

/** Evento que se emite cuando la API rechaza el token guardado. */
export const EVENTO_SESION_EXPIRADA = 'replay:sesion-expirada';

export interface SesionGuardada {
  token: string;
  usuario: Usuario;
}

export interface ErrorCampo {
  campo: string;
  mensaje: string;
}

/** Error devuelto por la API, con su código HTTP y el detalle por campo cuando existe. */
export class ErrorApi extends Error {
  readonly estado: number;
  readonly errores: ErrorCampo[];

  constructor(estado: number, mensaje: string, errores: ErrorCampo[] = []) {
    super(mensaje);
    this.name = 'ErrorApi';
    this.estado = estado;
    this.errores = errores;
  }
}

type Metodo = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export async function solicitar<T>(ruta: string, metodo: Metodo = 'GET', cuerpo?: unknown): Promise<T> {
  const token = leer<SesionGuardada>(CLAVE_SESION)?.token;
  const encabezados: Record<string, string> = { Accept: 'application/json' };
  if (cuerpo !== undefined) {
    encabezados['Content-Type'] = 'application/json';
  }
  if (token) {
    encabezados.Authorization = `Bearer ${token}`;
  }

  let respuesta: Response;
  try {
    respuesta = await fetch(`${URL_API}${ruta}`, {
      method: metodo,
      headers: encabezados,
      body: cuerpo === undefined ? undefined : JSON.stringify(cuerpo),
    });
  } catch {
    throw new ErrorApi(0, 'No fue posible conectar con el servidor. Verifica que la API esté en ejecución.');
  }

  if (respuesta.status === 204) {
    return undefined as T;
  }

  const datos = await respuesta.json().catch(() => null);
  if (!respuesta.ok) {
    if (respuesta.status === 401 && token) {
      borrar(CLAVE_SESION);
      window.dispatchEvent(new Event(EVENTO_SESION_EXPIRADA));
    }
    throw new ErrorApi(
      respuesta.status,
      datos?.mensaje ?? 'Ocurrió un error inesperado. Intenta nuevamente.',
      datos?.errores ?? [],
    );
  }
  return datos as T;
}

/** Mensaje legible de cualquier error, para mostrarlo en un aviso. */
export function mensajeDeError(error: unknown, alternativo = 'Ocurrió un error inesperado.'): string {
  return error instanceof Error ? error.message : alternativo;
}

/** Errores por campo de la API como objeto { campo: mensaje }, listo para los formularios. */
export function erroresPorCampo(error: unknown): Record<string, string> {
  if (!(error instanceof ErrorApi)) {
    return {};
  }
  return Object.fromEntries(error.errores.map(({ campo, mensaje }) => [campo, mensaje]));
}
