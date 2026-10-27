/**
 * Registro, inicio de sesión y perfil de la sesión actual (FT-01, FT-02, FT-03).
 * El cierre de sesión ocurre en el cliente, que descarta el token: los JWT no guardan estado
 * en el servidor y expiran según JWT_EXPIRES_IN.
 */
const bcrypt = require('bcryptjs');
const catalogoModel = require('../models/catalogoModel');
const usuarioModel = require('../models/usuarioModel');
const ErrorHttp = require('../utils/ErrorHttp');
const { firmarToken, expiracion } = require('../utils/token');

const RONDAS_BCRYPT = 10;
// Hash de referencia para comparar aunque el correo no exista, de modo que el tiempo de
// respuesta no revele qué correos están registrados.
const HASH_REFERENCIA = bcrypt.hashSync('clave-de-referencia', RONDAS_BCRYPT);

function respuestaSesion(usuario) {
  return { token: firmarToken(usuario), expiraEn: expiracion, usuario };
}

async function registrar(req, res) {
  const { nombreUsuario, correo, clave, region, comuna } = req.body;

  const duplicados = await usuarioModel.buscarDuplicados({ correo, nombreUsuario });
  if (duplicados.correo) {
    throw new ErrorHttp(409, 'Ya existe una cuenta registrada con ese correo.', [
      { campo: 'correo', mensaje: 'Ya existe una cuenta registrada con ese correo.' },
    ]);
  }
  if (duplicados.nombreUsuario) {
    throw new ErrorHttp(409, 'Ese nombre de usuario ya está en uso.', [
      { campo: 'nombreUsuario', mensaje: 'Ese nombre de usuario ya está en uso.' },
    ]);
  }

  const { regionId, comunaId } = await catalogoModel.resolverUbicacionOpcional(region, comuna);
  const claveHash = await bcrypt.hash(clave, RONDAS_BCRYPT);
  const id = await usuarioModel.crear({ nombreUsuario, correo, claveHash, regionId, comunaId });
  const usuario = await usuarioModel.buscarPorId(id);

  res.status(201).location(`/api/usuarios/${id}`).json(respuestaSesion(usuario));
}

async function iniciarSesion(req, res) {
  const { correo, clave } = req.body;
  const fila = await usuarioModel.buscarFilaPorCorreo(correo);
  const coincide = await bcrypt.compare(clave, fila ? fila.clave_hash : HASH_REFERENCIA);

  if (!fila || !coincide) {
    throw new ErrorHttp(401, 'El correo o la contraseña no son correctos.');
  }
  if (!fila.activo) {
    throw new ErrorHttp(403, 'Tu cuenta está desactivada. Contacta a la administración de RePlay Games.');
  }

  res.json(respuestaSesion(usuarioModel.aUsuario(fila)));
}

async function perfil(req, res) {
  res.json(await usuarioModel.buscarPorId(req.usuario.id));
}

module.exports = { registrar, iniciarSesion, perfil };
