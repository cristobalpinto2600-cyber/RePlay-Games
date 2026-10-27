/** Validación de las rutas de usuarios. */
const { body } = require('express-validator');
const { idEnRuta } = require('./comunes');

const cambiarEstado = [idEnRuta, body('activo').isBoolean({ strict: true }).withMessage('Indica activo: true o false.')];

module.exports = { porId: [idEnRuta], cambiarEstado };
