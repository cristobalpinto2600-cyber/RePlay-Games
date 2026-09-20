/**
 * Acceso seguro a localStorage.
 * Se usa únicamente para conservar la sesión iniciada: si se cierra la pestaña o se recarga,
 * el usuario sigue autenticado y las rutas protegidas se pueden demostrar sin volver a entrar.
 */

export function leer<T>(clave: string): T | null {
  try {
    const valor = window.localStorage.getItem(clave);
    return valor ? (JSON.parse(valor) as T) : null;
  } catch {
    return null;
  }
}

export function escribir(clave: string, valor: unknown): void {
  try {
    window.localStorage.setItem(clave, JSON.stringify(valor));
  } catch {
    // El navegador puede bloquear el almacenamiento (modo privado): la aplicación sigue funcionando.
  }
}

export function borrar(clave: string): void {
  try {
    window.localStorage.removeItem(clave);
  } catch {
    // Sin acción: ver comentario anterior.
  }
}
