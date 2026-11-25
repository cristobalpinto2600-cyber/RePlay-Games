/**
 * Catálogo, detalle y gestión de publicaciones (RF-01 a RF-04) y moderación (RF-10).
 * Usa matchedData para prevenir asignación masiva (mass assignment) y soporta paginación EF4.
 */
const { matchedData } = require('express-validator');
const catalogoModel = require('../models/catalogoModel');
const notificacionModel = require('../models/notificacionModel');
const publicacionModel = require('../models/publicacionModel');
const ErrorHttp = require('../utils/ErrorHttp');

const esAdministrador = (usuario) => usuario?.rol === 'administrador';

/** Busca la publicación y verifica que pertenezca a quien hace la solicitud. */
async function publicacionPropia(id, usuario) {
  const publicacion = await publicacionModel.buscarPorId(id);
  if (!publicacion) {
    throw new ErrorHttp(404, 'La publicación no existe.');
  }
  if (publicacion.vendedorId !== usuario.id) {
    throw new ErrorHttp(403, 'Solo quien publicó el videojuego puede modificar esta publicación.');
  }
  return publicacion;
}

async function listar(req, res) {
  // matchedData entrega los filtros ya validados y saneados (en Express 5 req.query es de solo lectura).
  const filtros = matchedData(req, { locations: ['query'] });

  if (filtros.page !== undefined || filtros.limit !== undefined) {
    const resultado = await publicacionModel.listarCatalogoPaginado(filtros);
    res.set({
      'X-Total-Count': String(resultado.total),
      'X-Page': String(resultado.page),
      'X-Limit': String(resultado.limit),
      'X-Total-Pages': String(resultado.totalPages),
    });
    return res.json(resultado.items);
  }

  const publicaciones = await publicacionModel.listarCatalogo(filtros);
  res.set('X-Total-Count', String(publicaciones.length));
  return res.json(publicaciones);
}

async function listarMias(req, res) {
  res.json(await publicacionModel.listarPorVendedor(req.usuario.id));
}

async function listarAdmin(req, res) {
  res.json(await publicacionModel.listarParaAdmin());
}

/** Las publicaciones ocultas por moderación solo las ven su dueño y el administrador. */
async function obtener(req, res) {
  const publicacion = await publicacionModel.buscarPorId(req.params.id);
  const puedeVerOculta =
    publicacion && (esAdministrador(req.usuario) || req.usuario?.id === publicacion.vendedorId);

  if (!publicacion || (publicacion.oculta && !puedeVerOculta)) {
    throw new ErrorHttp(404, 'La publicación no existe o fue retirada del catálogo.');
  }
  res.json(publicacion);
}

async function crear(req, res) {
  const datos = matchedData(req, { locations: ['body'], includeOptionals: true });
  const referencias = await catalogoModel.resolverReferenciasPublicacion(datos);
  const id = await publicacionModel.crear(req.usuario.id, datos, referencias);
  res.status(201).location(`/api/publicaciones/${id}`).json(await publicacionModel.buscarPorId(id));
}

async function actualizar(req, res) {
  const publicacion = await publicacionPropia(req.params.id, req.usuario);
  if (publicacion.estadoPublicacion === 'vendida') {
    throw new ErrorHttp(409, 'Una publicación vendida ya no se puede editar.');
  }
  const datos = matchedData(req, { locations: ['body'], includeOptionals: true });
  const referencias = await catalogoModel.resolverReferenciasPublicacion(datos);
  await publicacionModel.actualizar(publicacion.id, datos, referencias);
  res.json(await publicacionModel.buscarPorId(publicacion.id));
}

/** Pausar o reactivar (RF-04). */
async function cambiarEstado(req, res) {
  const publicacion = await publicacionPropia(req.params.id, req.usuario);
  if (publicacion.estadoPublicacion === 'vendida') {
    throw new ErrorHttp(409, 'Una publicación vendida no puede cambiar de estado.');
  }
  await publicacionModel.cambiarEstado(publicacion.id, req.body.estadoPublicacion);
  res.json(await publicacionModel.buscarPorId(publicacion.id));
}

/**
 * Eliminar (RF-04): el dueño o el administrador. Si la publicación ya tiene operaciones se
 * conserva para no perder el historial de compras y ventas.
 */
async function eliminar(req, res) {
  const publicacion = await publicacionModel.buscarPorId(req.params.id);
  if (!publicacion) {
    throw new ErrorHttp(404, 'La publicación no existe.');
  }
  if (publicacion.vendedorId !== req.usuario.id && !esAdministrador(req.usuario)) {
    throw new ErrorHttp(403, 'Solo quien publicó el videojuego puede eliminar esta publicación.');
  }
  if ((await publicacionModel.contarOperaciones(publicacion.id)) > 0) {
    throw new ErrorHttp(
      409,
      'La publicación tiene operaciones asociadas y no se puede eliminar. Puedes pausarla.',
    );
  }
  await publicacionModel.eliminar(publicacion.id);
  res.status(204).end();
}

/** Mantener visible u ocultar una publicación (RF-10, solo administrador). */
async function moderar(req, res) {
  const publicacion = await publicacionModel.buscarPorId(req.params.id);
  if (!publicacion) {
    throw new ErrorHttp(404, 'La publicación no existe.');
  }
  await publicacionModel.cambiarOculta(publicacion.id, req.body.oculta);
  await notificacionModel.crearSilenciosa({
    usuarioId: publicacion.vendedorId,
    tipo: 'moderacion',
    titulo: req.body.oculta
      ? 'Publicación ocultada por moderación'
      : 'Publicación restaurada en el catálogo',
    mensaje: req.body.oculta
      ? `Tu publicación "${publicacion.titulo}" fue ocultada por un administrador.`
      : `Tu publicación "${publicacion.titulo}" vuelve a estar visible en el catálogo.`,
    ruta: '/mis-publicaciones',
  });
  res.json(await publicacionModel.buscarPorId(publicacion.id));
}

module.exports = {
  listar,
  listarMias,
  listarAdmin,
  obtener,
  crear,
  actualizar,
  cambiarEstado,
  eliminar,
  moderar,
};
