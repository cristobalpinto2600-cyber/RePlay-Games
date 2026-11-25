/**
 * Sanitización de entradas contra XSS (EF3).
 *
 * Limpia etiquetas HTML, bloques <script>/<style>, manejadores de eventos inline y esquemas
 * peligrosos (javascript:, vbscript:, data:text/html) sin alterar caracteres válidos de títulos
 * o contraseñas.
 *
 * Nota sobre Express 5: req.query es de solo lectura, por lo que no se reasigna aquí; los
 * parámetros de consulta se sanean directamente en los validadores con limpiarTexto().
 */
const CAMPOS_SENSIBLES = new Set(['clave', 'password', 'claveActual', 'claveNueva']);

/** Elimina contenido potencialmente ejecutable en navegador de una cadena de texto. */
function limpiarTexto(valor) {
  if (typeof valor !== 'string') {
    return valor;
  }
  return valor
    .replace(/\0/g, '')
    .replace(/<(script|style)\b[^>]*>[\s\S]*?(?:<\/\1>|$)/gi, '')
    .replace(/<\/?[a-zA-Z!?][^>]*>/g, '')
    .replace(/\b(?:javascript|vbscript)\s*:/gi, '')
    .replace(/data\s*:\s*text\/html/gi, '')
    .replace(/\bon[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function sanitizarValor(valor, claveActual = '') {
  if (CAMPOS_SENSIBLES.has(claveActual)) {
    return valor;
  }
  if (typeof valor === 'string') {
    return limpiarTexto(valor);
  }
  if (Array.isArray(valor)) {
    return valor.map((item) => sanitizarValor(item));
  }
  if (valor && typeof valor === 'object') {
    const limpio = {};
    for (const [clave, contenido] of Object.entries(valor)) {
      limpio[clave] = sanitizarValor(contenido, clave);
    }
    return limpio;
  }
  return valor;
}

/** Middleware global que sanea req.body antes de ejecutar validadores y controladores. */
function sanitizarEntrada(req, res, next) {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizarValor(req.body);
  }
  next();
}

module.exports = { limpiarTexto, sanitizarEntrada };
