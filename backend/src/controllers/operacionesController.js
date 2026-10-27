/**
 * Solicitudes de compra y seguimiento de operaciones (RF-06, RF-07).
 */
const catalogoModel = require('../models/catalogoModel');
const operacionModel = require('../models/operacionModel');
const publicacionModel = require('../models/publicacionModel');
const usuarioModel = require('../models/usuarioModel');
const ErrorHttp = require('../utils/ErrorHttp');

/**
 * Cambios de estado permitidos según quién participa en la operación:
 * el vendedor confirma, completa o cancela; el comprador solo puede cancelar mientras está pendiente.
 */
const TRANSICIONES = {
  vendedor: {
    pendiente: ['confirmada', 'cancelada'],
    confirmada: ['completada', 'cancelada'],
  },
  comprador: {
    pendiente: ['cancelada'],
  },
};

/**
 * Completa cada operación con su publicación y la contraparte, en el formato que usa la vista
 * "Compras y ventas" del frontend (OperacionDetallada).
 */
async function detallar(operaciones, usuarioId) {
  const publicaciones = await publicacionModel.buscarPorIds([...new Set(operaciones.map((o) => o.publicacionId))]);
  const contrapartes = await usuarioModel.buscarPublicosPorIds([
    ...new Set(operaciones.map((o) => (o.compradorId === usuarioId ? o.vendedorId : o.compradorId))),
  ]);

  return operaciones.map((operacion) => {
    const esComprador = operacion.compradorId === usuarioId;
    const contraparteId = esComprador ? operacion.vendedorId : operacion.compradorId;
    return {
      operacion,
      publicacion: publicaciones.find((p) => p.id === operacion.publicacionId),
      contraparte: contrapartes.find((u) => u.id === contraparteId),
      rolUsuario: esComprador ? 'comprador' : 'vendedor',
    };
  });
}

async function listar(req, res) {
  const detalladas = await detallar(await operacionModel.listarPorUsuario(req.usuario.id), req.usuario.id);
  res.json({
    compras: detalladas.filter((item) => item.rolUsuario === 'comprador'),
    ventas: detalladas.filter((item) => item.rolUsuario === 'vendedor'),
  });
}

async function crear(req, res) {
  const { publicacionId, modalidadEntrega } = req.body;
  const compradorId = req.usuario.id;

  const publicacion = await publicacionModel.buscarPorId(publicacionId);
  if (!publicacion || publicacion.oculta) {
    throw new ErrorHttp(404, 'La publicación no existe o fue retirada del catálogo.');
  }
  if (publicacion.vendedorId === compradorId) {
    throw new ErrorHttp(409, 'No puedes comprar tu propia publicación.');
  }
  if (publicacion.estadoPublicacion !== 'activa') {
    throw new ErrorHttp(409, `La publicación está ${publicacion.estadoPublicacion} y no admite nuevas solicitudes.`);
  }
  if (!publicacion.entregas.includes(modalidadEntrega)) {
    throw new ErrorHttp(400, 'Revisa los datos enviados.', [
      { campo: 'modalidadEntrega', mensaje: 'El vendedor no ofrece esa modalidad de entrega.' },
    ]);
  }
  if (await operacionModel.existeEnCurso(publicacion.id, compradorId)) {
    throw new ErrorHttp(409, 'Ya tienes una solicitud en curso para esta publicación.');
  }

  const id = await operacionModel.crear({
    publicacionId: publicacion.id,
    compradorId,
    vendedorId: publicacion.vendedorId,
    modalidadId: await catalogoModel.idPorNombre('modalidades_entrega', modalidadEntrega),
  });
  const [detallada] = await detallar([await operacionModel.buscarPorId(id)], compradorId);
  res.status(201).location(`/api/operaciones/${id}`).json(detallada);
}

async function cambiarEstado(req, res) {
  const operacion = await operacionModel.buscarPorId(req.params.id);
  if (!operacion) {
    throw new ErrorHttp(404, 'La operación no existe.');
  }

  const usuarioId = req.usuario.id;
  let rol = null;
  if (operacion.vendedorId === usuarioId) rol = 'vendedor';
  else if (operacion.compradorId === usuarioId) rol = 'comprador';
  if (!rol) {
    throw new ErrorHttp(403, 'No participas en esta operación.');
  }

  const nuevo = req.body.estado;
  const permitidos = TRANSICIONES[rol][operacion.estado] ?? [];
  if (!permitidos.includes(nuevo)) {
    throw new ErrorHttp(
      409,
      `Como ${rol} no puedes cambiar una operación ${operacion.estado} a ${nuevo}.`,
    );
  }

  if (nuevo === 'completada') {
    await operacionModel.completar(operacion);
  } else {
    await operacionModel.cambiarEstado(operacion.id, nuevo);
  }

  const [detallada] = await detallar([await operacionModel.buscarPorId(operacion.id)], usuarioId);
  res.json(detallada);
}

module.exports = { listar, crear, cambiarEstado };
