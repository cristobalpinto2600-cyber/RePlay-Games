/** Utilidades de formato compartidas por las vistas. */

const formateadorPrecio = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0,
});

const formateadorFecha = new Intl.DateTimeFormat('es-CL', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
});

/** Formatea un monto en pesos chilenos, por ejemplo: $18.990 */
export function formatearPrecio(valor: number): string {
  return formateadorPrecio.format(valor);
}

/** Formatea una fecha ISO (AAAA-MM-DD) en formato legible. */
export function formatearFecha(iso: string): string {
  const fecha = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(fecha.getTime())) {
    return iso;
  }
  return formateadorFecha.format(fecha);
}

/** Iniciales del título, usadas en la portada generada del videojuego. */
export function iniciales(titulo: string): string {
  const palabras = titulo.split(/\s+/).filter((palabra) => palabra.length > 2);
  const base = palabras.length > 0 ? palabras : titulo.split(/\s+/);
  return base
    .slice(0, 2)
    .map((palabra) => palabra.charAt(0).toUpperCase())
    .join('');
}

/** Tono de color estable derivado del texto, para que cada juego tenga su propia portada. */
export function tonoDesdeTexto(texto: string): number {
  let acumulado = 0;
  for (let i = 0; i < texto.length; i += 1) {
    acumulado = (acumulado + texto.charCodeAt(i) * (i + 3)) % 360;
  }
  return acumulado;
}

/** Validación básica de correo electrónico para los formularios. */
export function correoValido(correo: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(correo.trim());
}
