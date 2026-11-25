/** Validación de reportes y moderación administrativa (RF-09, RF-10). */
const { body, query } = require('express-validator');
const { MOTIVOS_REPORTE } = require('../models/reporteModel');
const { idEnRuta, limpiarTexto } = require('./comunes');

const crear = [
  body('publicacionId').isInt({ min: 1 }).withMessage('Indica la publicación a reportar.').toInt(),
  body('motivo')
    .isIn(MOTIVOS_REPORTE)
    .withMessage('Selecciona un motivo de reporte válido.'),
  body('comentario')
    .optional({ values: 'falsy' })
    .isString()
    .withMessage('El comentario debe ser texto.')
    .bail()
    .customSanitizer(limpiarTexto)
    .isLength({ max: 300 })
    .withMessage('El comentario no puede superar los 300 caracteres.'),
];

const listar = [
  query('estado')
    .optional({ values: 'falsy' })
    .isIn(['pendiente', 'revisado', 'descartado'])
    .withMessage('Estado de reporte no válido.'),
];

const resolver = [
  idEnRuta,
  body('accion')
    .isIn(['mantener', 'ocultar', 'descartar'])
    .withMessage('La acción debe ser mantener, ocultar o descartar.'),
  body('notaModeracion')
    .optional({ values: 'falsy' })
    .isString()
    .withMessage('La nota debe ser texto.')
    .bail()
    .customSanitizer(limpiarTexto)
    .isLength({ max: 300 })
    .withMessage('La nota no puede superar los 300 caracteres.'),
];

module.exports = { crear, listar, resolver };
