/**
 * Registro y consulta de calificaciones de operaciones completadas (RF-08).
 */
const { matchedData } = require('express-validator');
const calificacionModel = require('../models/calificacionModel');
const notificacionModel = require('../models/notificacionModel');
const operacionModel = require('../models/operacionModel');
const usuarioModel = require('../models/usuarioModel');
const ErrorHttp = require('../utils/ErrorHttp');

async function crear(req, res) {
  const { operacionId, puntaje, comentario } = matchedData(req, {
    locations: ['body'],
    includeOptionals: true,
  });
  const evaluadorId = req.usuario.id;

  const operacion = await operacionModel.buscarPorId(operacionId);
  if (!operacion) {
    throw new ErrorHttp(404, 'La operación no existe.');
  }
  if (operacion.compradorId !== evaluadorId && operacion.vendedorId !== evaluadorId) {
    throw new ErrorHttp(403, 'Solo quienes participan en la operación pueden calificarla.');
  }
  if (operacion.estado !== 'completada') {
    throw new ErrorHttp(409, 'Solo se pueden calificar operaciones en estado completada.');
  }
  if (operacion.calificada || (await calificacionModel.buscarPorOperacion(operacion.id))) {
    throw new ErrorHttp(409, 'Esta operación ya fue calificada.');
  }

  const evaluadoId =
    operacion.compradorId === evaluadorId ? operacion.vendedorId : operacion.compradorId;

  const resultado = await calificacionModel.crear({
    operacionId: operacion.id,
    evaluadorId,
    evaluadoId,
    puntaje,
    comentario: comentario ?? '',
  });

  await notificacionModel.crearSilenciosa({
    usuarioId: evaluadoId,
    tipo: 'calificacion',
    titulo: 'Recibiste una nueva calificación',
    mensaje: `${req.usuario.nombreUsuario} te calificó con ${puntaje} ${puntaje === 1 ? 'estrella' : 'estrellas'}.`,
    ruta: '/perfil',
  });

  res.status(201).json({
    id: resultado.id,
    operacionId: operacion.id,
    puntaje,
    comentario: comentario ?? '',
    reputacionEvaluado: resultado.reputacion,
    totalCalificacionesEvaluado: resultado.totalCalificaciones,
  });
}

async function listarPorUsuario(req, res) {
  const usuario = await usuarioModel.buscarPublicoPorId(req.params.id);
  if (!usuario) {
    throw new ErrorHttp(404, 'El usuario no existe.');
  }
  res.json(await calificacionModel.listarPorEvaluado(usuario.id));
}

module.exports = { crear, listarPorUsuario };
