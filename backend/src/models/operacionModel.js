/**
 * Acceso a operaciones de compra y venta (RF-06, RF-07).
 */
const { pool, conTransaccion } = require('../config/db');

const SELECT_OPERACION = `
  SELECT o.id, o.publicacion_id, o.comprador_id, o.vendedor_id, o.estado, o.calificada,
         o.creado_en, m.nombre AS modalidad
    FROM operaciones o
    JOIN modalidades_entrega m ON m.id = o.modalidad_id`;

function aOperacion(fila) {
  return {
    id: fila.id,
    publicacionId: fila.publicacion_id,
    compradorId: fila.comprador_id,
    vendedorId: fila.vendedor_id,
    estado: fila.estado,
    modalidadEntrega: fila.modalidad,
    fechaCreacion: fila.creado_en.slice(0, 10),
    calificada: Boolean(fila.calificada),
  };
}

async function buscarPorId(id) {
  const [filas] = await pool.execute(`${SELECT_OPERACION} WHERE o.id = ?`, [id]);
  return filas[0] ? aOperacion(filas[0]) : null;
}

/** Operaciones donde la persona es compradora o vendedora, de la más reciente a la más antigua. */
async function listarPorUsuario(usuarioId) {
  const [filas] = await pool.execute(
    `${SELECT_OPERACION} WHERE o.comprador_id = ? OR o.vendedor_id = ? ORDER BY o.creado_en DESC, o.id DESC`,
    [usuarioId, usuarioId],
  );
  return filas.map(aOperacion);
}

/** Indica si el comprador ya tiene una solicitud en curso (pendiente o confirmada) por la publicación. */
async function existeEnCurso(publicacionId, compradorId) {
  const [filas] = await pool.execute(
    `SELECT COUNT(*) AS total FROM operaciones
      WHERE publicacion_id = ? AND comprador_id = ? AND estado IN ('pendiente', 'confirmada')`,
    [publicacionId, compradorId],
  );
  return filas[0].total > 0;
}

async function crear({ publicacionId, compradorId, vendedorId, modalidadId }) {
  const [resultado] = await pool.execute(
    `INSERT INTO operaciones (publicacion_id, comprador_id, vendedor_id, modalidad_id)
     VALUES (?, ?, ?, ?)`,
    [publicacionId, compradorId, vendedorId, modalidadId],
  );
  return resultado.insertId;
}

async function cambiarEstado(id, estado) {
  await pool.execute('UPDATE operaciones SET estado = ? WHERE id = ?', [estado, id]);
}

/**
 * Completa la operación en una transacción: la publicación queda vendida y las demás
 * solicitudes en curso sobre ella se cancelan, porque el juego ya no está disponible.
 */
async function completar(operacion) {
  await conTransaccion(async (conexion) => {
    await conexion.execute("UPDATE operaciones SET estado = 'completada' WHERE id = ?", [operacion.id]);
    await conexion.execute("UPDATE publicaciones SET estado_publicacion = 'vendida' WHERE id = ?", [
      operacion.publicacionId,
    ]);
    await conexion.execute(
      `UPDATE operaciones SET estado = 'cancelada'
        WHERE publicacion_id = ? AND id <> ? AND estado IN ('pendiente', 'confirmada')`,
      [operacion.publicacionId, operacion.id],
    );
  });
}

module.exports = { buscarPorId, listarPorUsuario, existeEnCurso, crear, cambiarEstado, completar };
