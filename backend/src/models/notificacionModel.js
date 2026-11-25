/**
 * Acceso a notificaciones persistentes del usuario (EF1).
 */
const { pool } = require('../config/db');

function aNotificacion(fila) {
  return {
    id: fila.id,
    tipo: fila.tipo,
    titulo: fila.titulo,
    mensaje: fila.mensaje,
    ruta: fila.ruta ?? undefined,
    leida: Boolean(fila.leida),
    fechaCreacion: fila.creado_en.slice(0, 16).replace('T', ' '),
  };
}

async function crear({ usuarioId, tipo = 'sistema', titulo, mensaje, ruta = null }) {
  const [resultado] = await pool.execute(
    `INSERT INTO notificaciones (usuario_id, tipo, titulo, mensaje, ruta)
     VALUES (?, ?, ?, ?, ?)`,
    [usuarioId, tipo, titulo.slice(0, 100), mensaje.slice(0, 255), ruta],
  );
  return resultado.insertId;
}

/** Emite una notificación sin interrumpir la operación principal si ocurre un fallo auxiliar. */
async function crearSilenciosa(datos) {
  try {
    return await crear(datos);
  } catch (error) {
    console.error('No se pudo registrar notificación:', error.message);
    return null;
  }
}

async function listarPorUsuario(usuarioId, limite = 30) {
  const limiteSeguro = Math.min(Math.max(Number.parseInt(limite, 10) || 30, 1), 100);
  const [filas] = await pool.execute(
    `SELECT id, tipo, titulo, mensaje, ruta, leida, creado_en
       FROM notificaciones
      WHERE usuario_id = ?
      ORDER BY creado_en DESC, id DESC
      LIMIT ${limiteSeguro}`,
    [usuarioId],
  );
  return filas.map(aNotificacion);
}

async function contarNoLeidas(usuarioId) {
  const [filas] = await pool.execute(
    'SELECT COUNT(*) AS total FROM notificaciones WHERE usuario_id = ? AND leida = 0',
    [usuarioId],
  );
  return filas[0].total;
}

async function marcarLeida(id, usuarioId) {
  const [resultado] = await pool.execute(
    'UPDATE notificaciones SET leida = 1 WHERE id = ? AND usuario_id = ?',
    [id, usuarioId],
  );
  return resultado.affectedRows > 0;
}

async function marcarTodasLeidas(usuarioId) {
  await pool.execute(
    'UPDATE notificaciones SET leida = 1 WHERE usuario_id = ? AND leida = 0',
    [usuarioId],
  );
}

module.exports = {
  crear,
  crearSilenciosa,
  listarPorUsuario,
  contarNoLeidas,
  marcarLeida,
  marcarTodasLeidas,
};
