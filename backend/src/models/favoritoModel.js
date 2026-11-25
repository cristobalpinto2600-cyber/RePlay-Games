/**
 * Lista personal de favoritos del usuario (RF-05).
 */
const { pool } = require('../config/db');
const { aPublicacion } = require('./publicacionModel');

async function listarPorUsuario(usuarioId) {
  const [filas] = await pool.execute(
    `SELECT p.id, p.titulo, co.nombre AS consola, g.nombre AS genero, p.precio,
            p.estado_conservacion, p.estado_publicacion, p.oculta, p.descripcion,
            p.imagen_url, r.nombre AS region, c.nombre AS comuna, p.incluye_caja,
            p.incluye_manual, p.vendedor_id, p.creado_en,
            GROUP_CONCAT(DISTINCT m.nombre ORDER BY m.id SEPARATOR '|') AS entregas
       FROM favoritos f
       JOIN publicaciones p ON p.id = f.publicacion_id
       JOIN consolas co ON co.id = p.consola_id
       JOIN generos g ON g.id = p.genero_id
       JOIN comunas c ON c.id = p.comuna_id
       JOIN regiones r ON r.id = c.region_id
       LEFT JOIN publicacion_entregas pe ON pe.publicacion_id = p.id
       LEFT JOIN modalidades_entrega m ON m.id = pe.modalidad_id
      WHERE f.usuario_id = ? AND p.oculta = 0
      GROUP BY p.id, co.id, g.id, c.id, r.id, f.creado_en
      ORDER BY f.creado_en DESC, p.id DESC`,
    [usuarioId],
  );
  return filas.map(aPublicacion);
}

async function listarIds(usuarioId) {
  const [filas] = await pool.execute(
    `SELECT f.publicacion_id
       FROM favoritos f
       JOIN publicaciones p ON p.id = f.publicacion_id
      WHERE f.usuario_id = ? AND p.oculta = 0
      ORDER BY f.creado_en DESC`,
    [usuarioId],
  );
  return filas.map((fila) => fila.publicacion_id);
}

async function agregar(usuarioId, publicacionId) {
  await pool.execute(
    'INSERT IGNORE INTO favoritos (usuario_id, publicacion_id) VALUES (?, ?)',
    [usuarioId, publicacionId],
  );
}

async function quitar(usuarioId, publicacionId) {
  await pool.execute('DELETE FROM favoritos WHERE usuario_id = ? AND publicacion_id = ?', [
    usuarioId,
    publicacionId,
  ]);
}

module.exports = { listarPorUsuario, listarIds, agregar, quitar };
