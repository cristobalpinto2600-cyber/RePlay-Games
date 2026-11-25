/**
 * Validación de publicaciones (RF-01, RF-03, RF-04, RF-10, EF3, EF4).
 * Incluye sanitización contra XSS y reglas para paginación, ordenamiento y URL de imagen.
 */
const { body, query } = require('express-validator');
const { ESTADOS_CONSERVACION } = require('../models/catalogoModel');
const { idEnRuta, limpiarTexto, textoObligatorio, textoOpcional } = require('./comunes');

const PRECIO_MAXIMO = 500000;

const datosPublicacion = [
  body('titulo')
    .isString()
    .withMessage('Indica el título del videojuego.')
    .bail()
    .customSanitizer(limpiarTexto)
    .isLength({ min: 3, max: 120 })
    .withMessage('El título debe tener entre 3 y 120 caracteres.'),
  textoObligatorio(body('consola'), 'Selecciona la consola compatible.'),
  textoObligatorio(body('genero'), 'Selecciona el género.'),
  body('estadoConservacion')
    .isIn(ESTADOS_CONSERVACION)
    .withMessage('Indica un estado de conservación válido.'),
  body('precio')
    .isInt({ min: 1, max: PRECIO_MAXIMO })
    .withMessage('Ingresa un precio válido en pesos, hasta $500.000.')
    .toInt(),
  body('descripcion')
    .isString()
    .withMessage('Describe el estado del juego.')
    .bail()
    .customSanitizer(limpiarTexto)
    .isLength({ min: 20, max: 400 })
    .withMessage('La descripción debe tener entre 20 y 400 caracteres.'),
  body('imagenUrl')
    .optional({ values: 'falsy' })
    .isString()
    .withMessage('La URL de la imagen debe ser texto.')
    .bail()
    .trim()
    .isLength({ max: 500 })
    .withMessage('La URL de la imagen no puede superar los 500 caracteres.')
    .isURL({ protocols: ['http', 'https'], require_protocol: true })
    .withMessage('Ingresa una URL de imagen válida (http:// o https://).'),
  textoObligatorio(body('region'), 'Selecciona tu región.'),
  textoObligatorio(body('comuna'), 'Selecciona tu comuna.'),
  body('entregas').isArray({ min: 1 }).withMessage('Elige al menos una modalidad de entrega.'),
  body('entregas.*').isString().withMessage('Modalidad de entrega no válida.').customSanitizer(limpiarTexto),
  body('incluyeCaja').optional().isBoolean({ strict: true }).withMessage('Debe ser verdadero o falso.'),
  body('incluyeManual').optional().isBoolean({ strict: true }).withMessage('Debe ser verdadero o falso.'),
];

const filtrosCatalogo = [
  textoOpcional(query('texto')).isLength({ max: 100 }).withMessage('La búsqueda es demasiado larga.'),
  textoOpcional(query('consola')),
  textoOpcional(query('genero')),
  textoOpcional(query('estadoConservacion')),
  textoOpcional(query('comuna')),
  query('precioMaximo')
    .optional({ values: 'falsy' })
    .isInt({ min: 0 })
    .withMessage('El precio máximo debe ser un número entero.')
    .toInt(),
  query('orden')
    .optional({ values: 'falsy' })
    .isIn(['recientes', 'precio_asc', 'precio_desc'])
    .withMessage('El criterio de orden debe ser recientes, precio_asc o precio_desc.'),
  query('page')
    .optional({ values: 'falsy' })
    .isInt({ min: 1 })
    .withMessage('La página debe ser un entero positivo.')
    .toInt(),
  query('limit')
    .optional({ values: 'falsy' })
    .isInt({ min: 1, max: 50 })
    .withMessage('El límite por página debe estar entre 1 y 50.')
    .toInt(),
];

const crear = datosPublicacion;
const actualizar = [idEnRuta, ...datosPublicacion];
const cambiarEstado = [
  idEnRuta,
  body('estadoPublicacion')
    .isIn(['activa', 'pausada'])
    .withMessage('El estado debe ser "activa" o "pausada".'),
];
const moderar = [idEnRuta, body('oculta').isBoolean({ strict: true }).withMessage('Indica oculta: true o false.')];

module.exports = { filtrosCatalogo, crear, actualizar, cambiarEstado, moderar, porId: [idEnRuta] };
