/**
 * Validación de registro e inicio de sesión (FT-01, FT-02).
 * Replica las reglas del formulario de registro de EP1 para que el backend no dependa de que
 * el frontend haya validado antes.
 */
const { body } = require('express-validator');
const { textoOpcional } = require('./comunes');

const nombreUsuario = () =>
  body('nombreUsuario')
    .isString()
    .withMessage('Indica un nombre de usuario.')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('El nombre de usuario debe tener entre 3 y 30 caracteres.')
    .matches(/^[\p{L}\p{N} _.-]+$/u)
    .withMessage('Usa solo letras, números, espacios, punto, guion o guion bajo.');

const registro = [
  nombreUsuario(),
  body('correo')
    .isString()
    .withMessage('Ingresa tu correo electrónico.')
    .trim()
    .toLowerCase()
    .isEmail()
    .withMessage('El formato del correo no es válido.')
    .isLength({ max: 120 })
    .withMessage('El correo no puede superar los 120 caracteres.'),
  body('clave')
    .isString()
    .withMessage('Ingresa una contraseña.')
    .isLength({ min: 6, max: 72 })
    .withMessage('La contraseña debe tener entre 6 y 72 caracteres.')
    .matches(/[a-zA-Z]/)
    .withMessage('Combina al menos una letra y un número.')
    .matches(/\d/)
    .withMessage('Combina al menos una letra y un número.'),
  textoOpcional(body('region')),
  textoOpcional(body('comuna')),
];

const login = [
  body('correo')
    .isString()
    .withMessage('Ingresa tu correo electrónico.')
    .trim()
    .toLowerCase()
    .isEmail()
    .withMessage('El formato del correo no es válido.'),
  body('clave').isString().withMessage('Ingresa tu contraseña.').notEmpty().withMessage('Ingresa tu contraseña.'),
];

const perfil = [
  nombreUsuario().optional(),
  body('region').optional({ values: 'null' }).isString().withMessage('Debe ser texto.').trim(),
  body('comuna').optional({ values: 'null' }).isString().withMessage('Debe ser texto.').trim(),
];

module.exports = { registro, login, perfil };
