/**
 * Acceso a la tabla usuarios. Las respuestas de la API se construyen con aUsuario o
 * aUsuarioPublico, que nunca incluyen el hash de la contraseña (RNF-SEG-03).
 */
const { pool } = require('../config/db');

const SELECT_USUARIO = `
  SELECT u.id, u.nombre_usuario, u.correo, u.clave_hash, u.activo, u.reputacion,
         u.total_calificaciones, u.creado_en, ro.nombre AS rol,
         re.nombre AS region, co.nombre AS comuna
    FROM usuarios u
    JOIN roles ro ON ro.id = u.rol_id
    LEFT JOIN regiones re ON re.id = u.region_id
    LEFT JOIN comunas co ON co.id = u.comuna_id`;

/** Datos de la propia cuenta o de la vista administrativa. */
function aUsuario(fila) {
  return {
    id: fila.id,
    nombreUsuario: fila.nombre_usuario,
    correo: fila.correo,
    rol: fila.rol,
    region: fila.region ?? undefined,
    comuna: fila.comuna ?? undefined,
    reputacion: fila.reputacion,
    totalCalificaciones: fila.total_calificaciones,
    fechaRegistro: fila.creado_en.slice(0, 10),
    activo: Boolean(fila.activo),
  };
}

/** Datos públicos del vendedor que ve cualquier visitante (RF-02): sin correo ni estado. */
function aUsuarioPublico(fila) {
  const { correo, activo, ...publico } = aUsuario(fila);
  return publico;
}

async function buscarPorId(id) {
  const [filas] = await pool.execute(`${SELECT_USUARIO} WHERE u.id = ?`, [id]);
  return filas[0] ? aUsuario(filas[0]) : null;
}

/** Incluye clave_hash: solo debe usarse para verificar la contraseña en el login. */
async function buscarFilaPorCorreo(correo) {
  const [filas] = await pool.execute(`${SELECT_USUARIO} WHERE u.correo = ?`, [correo]);
  return filas[0] ?? null;
}

async function buscarPublicoPorId(id) {
  const [filas] = await pool.execute(`${SELECT_USUARIO} WHERE u.id = ?`, [id]);
  return filas[0] ? aUsuarioPublico(filas[0]) : null;
}

/** Lista de usuarios por id, para completar operaciones con los datos de la contraparte. */
async function buscarPublicosPorIds(ids) {
  if (ids.length === 0) {
    return [];
  }
  const marcadores = ids.map(() => '?').join(', ');
  const [filas] = await pool.execute(`${SELECT_USUARIO} WHERE u.id IN (${marcadores})`, ids);
  return filas.map(aUsuarioPublico);
}

async function listar() {
  const [filas] = await pool.execute(`${SELECT_USUARIO} ORDER BY u.id`);
  return filas.map(aUsuario);
}

/** Indica qué datos únicos ya están en uso por otra cuenta. */
async function buscarDuplicados({ correo, nombreUsuario }, excluirId = 0) {
  const [filas] = await pool.execute(
    'SELECT correo, nombre_usuario FROM usuarios WHERE (correo = ? OR nombre_usuario = ?) AND id <> ?',
    [correo ?? '', nombreUsuario ?? '', excluirId],
  );
  const iguales = (a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }) === 0;
  return {
    correo: Boolean(correo) && filas.some((fila) => iguales(fila.correo, correo)),
    nombreUsuario: Boolean(nombreUsuario) && filas.some((fila) => iguales(fila.nombre_usuario, nombreUsuario)),
  };
}

async function crear({ nombreUsuario, correo, claveHash, regionId, comunaId }) {
  const [resultado] = await pool.execute(
    `INSERT INTO usuarios (nombre_usuario, correo, clave_hash, rol_id, region_id, comuna_id)
     VALUES (?, ?, ?, (SELECT id FROM roles WHERE nombre = 'usuario'), ?, ?)`,
    [nombreUsuario, correo, claveHash, regionId, comunaId],
  );
  return resultado.insertId;
}

async function actualizarPerfil(id, { nombreUsuario, regionId, comunaId }) {
  await pool.execute(
    'UPDATE usuarios SET nombre_usuario = ?, region_id = ?, comuna_id = ? WHERE id = ?',
    [nombreUsuario, regionId, comunaId, id],
  );
}

async function cambiarActivo(id, activo) {
  await pool.execute('UPDATE usuarios SET activo = ? WHERE id = ?', [activo ? 1 : 0, id]);
}

module.exports = {
  aUsuario,
  buscarPorId,
  buscarFilaPorCorreo,
  buscarPublicoPorId,
  buscarPublicosPorIds,
  listar,
  buscarDuplicados,
  crear,
  actualizarPerfil,
  cambiarActivo,
};
