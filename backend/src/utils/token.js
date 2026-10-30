/**
 * Emisión y verificación de JWT.
 * El token solo contiene el identificador (sub) y el rol: los datos del perfil se consultan
 * aparte en GET /api/auth/perfil, para no exponer información en el token.
 */
const jwt = require('jsonwebtoken');
const { jwt: configuracion } = require('../config/env');

function firmarToken(usuario) {
  return jwt.sign({ rol: usuario.rol }, configuracion.secreto, {
    subject: String(usuario.id),
    expiresIn: configuracion.expiracion,
    algorithm: 'HS256',
  });
}

/** Devuelve el contenido del token o lanza un error de jsonwebtoken si es inválido o expiró. */
function verificarToken(token) {
  return jwt.verify(token, configuracion.secreto, { algorithms: ['HS256'] });
}

module.exports = { firmarToken, verificarToken, expiracion: configuracion.expiracion };
