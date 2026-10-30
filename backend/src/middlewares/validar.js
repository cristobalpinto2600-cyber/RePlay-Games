/**
 * Corta la solicitud con 400 cuando las reglas de express-validator encuentran errores.
 * Devuelve un mensaje general y el primer error de cada campo, para que el frontend los muestre
 * junto al control correspondiente.
 */
const { validationResult } = require('express-validator');
const ErrorHttp = require('../utils/ErrorHttp');

function validar(req, res, next) {
  const resultado = validationResult(req);
  if (!resultado.isEmpty()) {
    const errores = resultado
      .array({ onlyFirstError: true })
      .map((error) => ({ campo: error.path, mensaje: error.msg }));
    throw new ErrorHttp(400, 'Revisa los datos enviados.', errores);
  }
  next();
}

module.exports = validar;
