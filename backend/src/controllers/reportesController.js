/**
 * Reportes de publicaciones (RF-09) y resolución administrativa (RF-10).
 */
const { matchedData } = require('express-validator');
const notificacionModel = require('../models/notificacionModel');
const publicacionModel = require('../models/publicacionModel');
const reporteModel = require('../models/reporteModel');
const ErrorHttp = require('../utils/ErrorHttp');

async function crear(req, res) {
  const { publicacionId, motivo, comentario } = matchedData(req, {
    locations: ['body'],
    includeOptionals: true,
  });
  const reportanteId = req.usuario.id;

  const publicacion = await publicacionModel.buscarPorId(publicacionId);
  if (!publicacion || publicacion.oculta) {
    throw new ErrorHttp(404, 'La publicación no existe o ya fue retirada del catálogo.');
  }
  if (publicacion.vendedorId === reportanteId) {
    throw new ErrorHttp(409, 'No puedes reportar tu propia publicación.');
  }
  if (await reporteModel.existePendiente(publicacion.id, reportanteId)) {
    throw new ErrorHttp(409, 'Ya enviaste un reporte pendiente para esta publicación.');
  }

  const id = await reporteModel.crear({
    publicacionId: publicacion.id,
    reportanteId,
    motivo,
    comentario: comentario ?? '',
  });
  const creado = await reporteModel.buscarPorId(id);
  res.status(201).location(`/api/reportes/${id}`).json(creado);
}

async function listar(req, res) {
  const filtros = matchedData(req, { locations: ['query'] });
  res.json(await reporteModel.listar(filtros));
}

async function resumen(req, res) {
  res.json(await reporteModel.resumenAdmin());
}

async function resolver(req, res) {
  const { id, accion, notaModeracion } = matchedData(req, {
    locations: ['params', 'body'],
    includeOptionals: true,
  });

  const reporte = await reporteModel.buscarPorId(id);
  if (!reporte) {
    throw new ErrorHttp(404, 'El reporte no existe.');
  }

  const actualizado = await reporteModel.resolver({
    id: reporte.id,
    publicacionId: reporte.publicacionId,
    moderadorId: req.usuario.id,
    accion,
    notaModeracion,
  });

  if (accion === 'ocultar' || accion === 'mantener') {
    await notificacionModel.crearSilenciosa({
      usuarioId: reporte.publicacion.vendedorId,
      tipo: 'moderacion',
      titulo:
        accion === 'ocultar'
          ? 'Publicación ocultada por moderación'
          : 'Publicación revisada y visible',
      mensaje:
        accion === 'ocultar'
          ? `Tu publicación "${reporte.publicacion.titulo}" fue ocultada tras revisar un reporte.`
          : `Tu publicación "${reporte.publicacion.titulo}" se mantiene visible tras revisión.`,
      ruta: '/mis-publicaciones',
    });
  }

  res.json(actualizado);
}

module.exports = { crear, listar, resumen, resolver };
