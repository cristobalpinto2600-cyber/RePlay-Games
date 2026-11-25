/** Reglas reutilizadas por varios validadores, con sanitización contra XSS (EF3). */
const { param } = require('express-validator');
const { limpiarTexto } = require('../middlewares/sanitizar');

const idEnRuta = param('id').isInt({ min: 1 }).withMessage('El identificador no es válido.').toInt();

/** Texto opcional: un valor vacío o ausente se trata como "sin dato". */
const textoOpcional = (cadena) =>
  cadena
    .optional({ values: 'falsy' })
    .isString()
    .withMessage('Debe ser texto.')
    .customSanitizer(limpiarTexto);

/** Texto obligatorio con el mismo mensaje si falta, no es texto o queda vacío. */
const textoObligatorio = (cadena, mensaje) =>
  cadena
    .isString()
    .withMessage(mensaje)
    .bail()
    .customSanitizer(limpiarTexto)
    .notEmpty()
    .withMessage(mensaje);

module.exports = { idEnRuta, textoOpcional, textoObligatorio, limpiarTexto };
