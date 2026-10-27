/**
 * Error con código HTTP. Los controladores lo lanzan y el manejador central de errores
 * lo transforma en la respuesta JSON { mensaje, errores? }.
 */
class ErrorHttp extends Error {
  /**
   * @param {number} estado Código HTTP (400, 401, 403, 404, 409...).
   * @param {string} mensaje Mensaje comprensible para la persona usuaria.
   * @param {{ campo: string, mensaje: string }[]} [errores] Detalle por campo, si corresponde.
   */
  constructor(estado, mensaje, errores) {
    super(mensaje);
    this.estado = estado;
    this.errores = errores;
  }
}

module.exports = ErrorHttp;
