/** Validación de calificaciones de operaciones completadas (RF-08). */
const { body } = require('express-validator');
const { idEnRuta, limpiarTexto } = require('./comunes');

const crear = [
  body('operacionId').isInt({ min: 1 }).withMessage('Indica la operación a calificar.').toInt(),
  body('puntaje')
    .isInt({ min: 1, max: 5 })
    .withMessage('Selecciona una calificación entre 1 y 5 estrellas.')
    .toInt(),
  body('comentario')
    .optional({ values: 'falsy' })
    .isString()
    .withMessage('El comentario debe ser texto.')
    .bail()
    .customSanitizer(limpiarTexto)
    .isLength({ max: 300 })
    .withMessage('El comentario no puede superar los 300 caracteres.'),
];

module.exports = { crear, porUsuario: [idEnRuta] };
