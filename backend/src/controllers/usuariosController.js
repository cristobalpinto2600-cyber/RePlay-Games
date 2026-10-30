/**
 * Perfil propio, perfil público del vendedor (RF-02) y gestión administrativa de usuarios.
 */
const catalogoModel = require('../models/catalogoModel');
const usuarioModel = require('../models/usuarioModel');
const ErrorHttp = require('../utils/ErrorHttp');

async function obtenerPublico(req, res) {
  const usuario = await usuarioModel.buscarPublicoPorId(req.params.id);
  if (!usuario) {
    throw new ErrorHttp(404, 'El usuario no existe.');
  }
  res.json(usuario);
}

/** Actualiza los datos editables de la propia cuenta. Los campos omitidos se conservan. */
async function actualizarPerfil(req, res) {
  const actual = await usuarioModel.buscarPorId(req.usuario.id);
  const nombreUsuario = req.body.nombreUsuario ?? actual.nombreUsuario;
  const region = req.body.region !== undefined ? req.body.region : actual.region;
  const comuna = req.body.comuna !== undefined ? req.body.comuna : actual.comuna;

  const duplicados = await usuarioModel.buscarDuplicados({ nombreUsuario }, actual.id);
  if (duplicados.nombreUsuario) {
    throw new ErrorHttp(409, 'Ese nombre de usuario ya está en uso.', [
      { campo: 'nombreUsuario', mensaje: 'Ese nombre de usuario ya está en uso.' },
    ]);
  }

  const { regionId, comunaId } = await catalogoModel.resolverUbicacionOpcional(region, comuna);
  await usuarioModel.actualizarPerfil(actual.id, { nombreUsuario, regionId, comunaId });
  res.json(await usuarioModel.buscarPorId(actual.id));
}

/** Vista administrativa de usuarios (solo administrador). */
async function listar(req, res) {
  res.json(await usuarioModel.listar());
}

/** Activa o desactiva una cuenta (solo administrador). Una cuenta desactivada no puede entrar. */
async function cambiarEstado(req, res) {
  const id = req.params.id;
  if (id === req.usuario.id) {
    throw new ErrorHttp(400, 'No puedes desactivar tu propia cuenta.');
  }
  const usuario = await usuarioModel.buscarPorId(id);
  if (!usuario) {
    throw new ErrorHttp(404, 'El usuario no existe.');
  }
  await usuarioModel.cambiarActivo(id, req.body.activo);
  res.json(await usuarioModel.buscarPorId(id));
}

module.exports = { obtenerPublico, actualizarPerfil, listar, cambiarEstado };
