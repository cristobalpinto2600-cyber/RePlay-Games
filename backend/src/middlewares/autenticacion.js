/**
 * Autenticación con JWT (FT-02, RNF-SEG-01).
 *
 * Lee el encabezado "Authorization: Bearer <token>", verifica la firma y la expiración y vuelve
 * a consultar al usuario en la base de datos: así una cuenta desactivada por la administración
 * pierde el acceso de inmediato y el rol usado siempre es el vigente.
 *
 * Respuestas: 401 si falta el token, si es inválido, si expiró o si la cuenta ya no está activa.
 */
const usuarioModel = require('../models/usuarioModel');
const ErrorHttp = require('../utils/ErrorHttp');
const { verificarToken } = require('../utils/token');

function extraerToken(req) {
  const encabezado = req.get('Authorization') || '';
  const [esquema, token] = encabezado.split(' ');
  return esquema === 'Bearer' && token ? token : null;
}

async function usuarioDesdeToken(token) {
  let contenido;
  try {
    contenido = verificarToken(token);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new ErrorHttp(401, 'Tu sesión expiró. Inicia sesión nuevamente.');
    }
    throw new ErrorHttp(401, 'El token de sesión no es válido.');
  }

  const usuario = await usuarioModel.buscarPorId(Number(contenido.sub));
  if (!usuario || !usuario.activo) {
    throw new ErrorHttp(401, 'La cuenta no existe o está desactivada.');
  }
  return { id: usuario.id, rol: usuario.rol, nombreUsuario: usuario.nombreUsuario };
}

/** Exige una sesión válida. Deja en req.usuario el id, el rol y el nombre de usuario. */
async function requiereAutenticacion(req, res, next) {
  const token = extraerToken(req);
  if (!token) {
    throw new ErrorHttp(401, 'Debes iniciar sesión para continuar.');
  }
  req.usuario = await usuarioDesdeToken(token);
  next();
}

/**
 * Identifica a la persona si envía un token válido, pero no exige sesión.
 * Se usa en rutas públicas que muestran más información al dueño o al administrador.
 */
async function autenticacionOpcional(req, res, next) {
  const token = extraerToken(req);
  if (token) {
    try {
      req.usuario = await usuarioDesdeToken(token);
    } catch {
      req.usuario = undefined;
    }
  }
  next();
}

module.exports = { requiereAutenticacion, autenticacionOpcional };
