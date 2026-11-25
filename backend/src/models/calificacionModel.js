/**
 * Acceso a calificaciones vinculadas a operaciones completadas (RF-08).
 */
const { pool, conTransaccion } = require('../config/db');

function aCalificacion(fila) {
  return {
    id: fila.id,
    operacionId: fila.operacion_id,
    puntaje: fila.puntaje,
    comentario: fila.comentario,
    fecha: fila.creado_en.slice(0, 10),
    evaluador: {
      id: fila.evaluador_id,
      nombreUsuario: fila.evaluador_nombre,
    },
    publicacion: {
      id: fila.publicacion_id,
      titulo: fila.publicacion_titulo,
    },
  };
}

async function buscarPorOperacion(operacionId) {
  const [filas] = await pool.execute('SELECT id FROM calificaciones WHERE operacion_id = ?', [
    operacionId,
  ]);
  return filas[0] ?? null;
}

async function listarPorEvaluado(usuarioId) {
  const [filas] = await pool.execute(
    `SELECT ca.id, ca.operacion_id, ca.puntaje, ca.comentario, ca.creado_en,
            u.id AS evaluador_id, u.nombre_usuario AS evaluador_nombre,
            p.id AS publicacion_id, p.titulo AS publicacion_titulo
       FROM calificaciones ca
       JOIN usuarios u ON u.id = ca.evaluador_id
       JOIN operaciones o ON o.id = ca.operacion_id
       JOIN publicaciones p ON p.id = o.publicacion_id
      WHERE ca.evaluado_id = ?
      ORDER BY ca.creado_en DESC, ca.id DESC`,
    [usuarioId],
  );
  return filas.map(aCalificacion);
}

/**
 * Registra la calificación, marca la operación como calificada y recalcula la reputación
 * promedio del usuario evaluado dentro de una misma transacción.
 */
async function crear({ operacionId, evaluadorId, evaluadoId, puntaje, comentario }) {
  return conTransaccion(async (conexion) => {
    const [resultado] = await conexion.execute(
      `INSERT INTO calificaciones (operacion_id, evaluador_id, evaluado_id, puntaje, comentario)
       VALUES (?, ?, ?, ?, ?)`,
      [operacionId, evaluadorId, evaluadoId, puntaje, comentario ?? ''],
    );

    await conexion.execute('UPDATE operaciones SET calificada = 1 WHERE id = ?', [operacionId]);

    const [[resumen]] = await conexion.execute(
      `SELECT ROUND(AVG(puntaje), 1) AS promedio, COUNT(*) AS total
         FROM calificaciones
        WHERE evaluado_id = ?`,
      [evaluadoId],
    );

    await conexion.execute(
      'UPDATE usuarios SET reputacion = ?, total_calificaciones = ? WHERE id = ?',
      [resumen.promedio ?? 0, resumen.total ?? 0, evaluadoId],
    );

    return {
      id: resultado.insertId,
      reputacion: Number(resumen.promedio ?? 0),
      totalCalificaciones: resumen.total ?? 0,
    };
  });
}

module.exports = { buscarPorOperacion, listarPorEvaluado, crear };
