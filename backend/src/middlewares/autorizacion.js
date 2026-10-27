/**
 * Autorización por rol (FT-04, RNF-SEG-02). Se usa después de requiereAutenticacion.
 * Responde 403 cuando la sesión es válida pero el rol no está permitido.
 */
const ErrorHttp = require('../utils/ErrorHttp');

function permitirRoles(...roles) {
  return (req, res, next) => {
    if (!req.usuario || !roles.includes(req.usuario.rol)) {
      throw new ErrorHttp(403, 'Tu cuenta no tiene permisos para realizar esta acción.');
    }
    next();
  };
}

module.exports = { permitirRoles };
