/**
 * Consulta y marcado de notificaciones del usuario autenticado (EF1).
 */
const notificacionModel = require('../models/notificacionModel');
const ErrorHttp = require('../utils/ErrorHttp');

async function listar(req, res) {
  const [notificaciones, noLeidas] = await Promise.all([
    notificacionModel.listarPorUsuario(req.usuario.id),
    notificacionModel.contarNoLeidas(req.usuario.id),
  ]);
  res.json({ notificaciones, noLeidas });
}

async function marcarLeida(req, res) {
  const actualizada = await notificacionModel.marcarLeida(req.params.id, req.usuario.id);
  if (!actualizada) {
    throw new ErrorHttp(404, 'La notificación no existe.');
  }
  res.json({ ok: true });
}

async function marcarTodasLeidas(req, res) {
  await notificacionModel.marcarTodasLeidas(req.usuario.id);
  res.json({ ok: true });
}

module.exports = { listar, marcarLeida, marcarTodasLeidas };
