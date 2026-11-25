/**
 * Gestión de publicaciones guardadas en favoritos (RF-05).
 */
const favoritoModel = require('../models/favoritoModel');
const publicacionModel = require('../models/publicacionModel');
const ErrorHttp = require('../utils/ErrorHttp');

async function listar(req, res) {
  res.json(await favoritoModel.listarPorUsuario(req.usuario.id));
}

async function listarIds(req, res) {
  res.json({ ids: await favoritoModel.listarIds(req.usuario.id) });
}

async function agregar(req, res) {
  const publicacion = await publicacionModel.buscarPorId(req.params.id);
  if (!publicacion || publicacion.oculta) {
    throw new ErrorHttp(404, 'La publicación no existe o fue retirada del catálogo.');
  }
  await favoritoModel.agregar(req.usuario.id, publicacion.id);
  res.status(201).json({ ok: true, publicacionId: publicacion.id });
}

async function quitar(req, res) {
  await favoritoModel.quitar(req.usuario.id, req.params.id);
  res.status(204).end();
}

module.exports = { listar, listarIds, agregar, quitar };
