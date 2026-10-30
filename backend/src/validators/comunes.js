/** Reglas reutilizadas por varios validadores. */
const { param } = require('express-validator');

const idEnRuta = param('id').isInt({ min: 1 }).withMessage('El identificador no es válido.').toInt();

/** Texto opcional: un valor vacío o ausente se trata como "sin dato". */
const textoOpcional = (cadena) =>
  cadena.optional({ values: 'falsy' }).isString().withMessage('Debe ser texto.').trim();

/** Texto obligatorio con el mismo mensaje si falta, no es texto o queda vacío. */
const textoObligatorio = (cadena, mensaje) =>
  cadena.isString().withMessage(mensaje).bail().trim().notEmpty().withMessage(mensaje);

module.exports = { idEnRuta, textoOpcional, textoObligatorio };
