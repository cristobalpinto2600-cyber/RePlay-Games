/** Validación de solicitudes de compra y cambios de estado (RF-06, RF-07). */
const { body } = require('express-validator');
const { idEnRuta, textoObligatorio } = require('./comunes');

const crear = [
  body('publicacionId').isInt({ min: 1 }).withMessage('Indica la publicación.').toInt(),
  textoObligatorio(body('modalidadEntrega'), 'Selecciona una modalidad de entrega.'),
];

const cambiarEstado = [
  idEnRuta,
  body('estado')
    .isIn(['confirmada', 'completada', 'cancelada'])
    .withMessage('El estado debe ser "confirmada", "completada" o "cancelada".'),
];

module.exports = { crear, cambiarEstado };
