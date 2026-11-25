/**
 * Acceso a reportes de publicaciones y acciones de moderación administrativa (RF-09, RF-10).
 */
const { pool, conTransaccion } = require('../config/db');

const MOTIVOS_REPORTE = [
  'Información falsa o engañosa',
  'Producto no corresponde a un videojuego físico',
  'Precio sospechoso o estafa',
  'Contenido ofensivo o inapropiado',
  'Publicación duplicada',
  'Otro',
];

function aReporte(fila) {
  return {
    id: fila.id,
    publicacionId: fila.publicacion_id,
    motivo: fila.motivo,
    comentario: fila.comentario,
    estado: fila.estado,
    accionTomada: fila.accion_tomada,
    notaModeracion: fila.nota_moderacion ?? undefined,
    fechaCreacion: fila.creado_en.slice(0, 16).replace('T', ' '),
    fechaResolucion: fila.resuelto_en ? fila.resuelto_en.slice(0, 16).replace('T', ' ') : undefined,
    publicacion: {
      id: fila.publicacion_id,
      titulo: fila.publicacion_titulo,
      consola: fila.publicacion_consola,
      precio: fila.publicacion_precio,
      oculta: Boolean(fila.publicacion_oculta),
      estadoPublicacion: fila.publicacion_estado,
      vendedorId: fila.vendedor_id,
      vendedorNombre: fila.vendedor_nombre,
    },
    reportante: {
      id: fila.reportante_id,
      nombreUsuario: fila.reportante_nombre,
    },
    moderadorNombre: fila.moderador_nombre ?? undefined,
  };
}

const SELECT_REPORTE = `
  SELECT r.id, r.publicacion_id, r.reportante_id, r.motivo, r.comentario,
         r.estado, r.accion_tomada, r.moderador_id, r.nota_moderacion,
         r.creado_en, r.resuelto_en,
         p.titulo AS publicacion_titulo,
         p.precio AS publicacion_precio,
         p.oculta AS publicacion_oculta,
         p.estado_publicacion AS publicacion_estado,
         p.vendedor_id AS vendedor_id,
         co.nombre AS publicacion_consola,
         rep.nombre_usuario AS reportante_nombre,
         vend.nombre_usuario AS vendedor_nombre,
         mod_u.nombre_usuario AS moderador_nombre
    FROM reportes r
    JOIN publicaciones p ON p.id = r.publicacion_id
    JOIN consolas co ON co.id = p.consola_id
    JOIN usuarios rep ON rep.id = r.reportante_id
    JOIN usuarios vend ON vend.id = p.vendedor_id
    LEFT JOIN usuarios mod_u ON mod_u.id = r.moderador_id`;

async function existePendiente(publicacionId, reportanteId) {
  const [filas] = await pool.execute(
    `SELECT COUNT(*) AS total
       FROM reportes
      WHERE publicacion_id = ? AND reportante_id = ? AND estado = 'pendiente'`,
    [publicacionId, reportanteId],
  );
  return filas[0].total > 0;
}

async function crear({ publicacionId, reportanteId, motivo, comentario }) {
  const [resultado] = await pool.execute(
    `INSERT INTO reportes (publicacion_id, reportante_id, motivo, comentario)
     VALUES (?, ?, ?, ?)`,
    [publicacionId, reportanteId, motivo, comentario ?? ''],
  );
  return resultado.insertId;
}

async function buscarPorId(id) {
  const [filas] = await pool.execute(`${SELECT_REPORTE} WHERE r.id = ?`, [id]);
  return filas[0] ? aReporte(filas[0]) : null;
}

async function listar({ estado } = {}) {
  const condiciones = [];
  const parametros = [];
  if (estado) {
    condiciones.push('r.estado = ?');
    parametros.push(estado);
  }
  const clausulaWhere = condiciones.length > 0 ? `WHERE ${condiciones.join(' AND ')}` : '';
  const [filas] = await pool.execute(
    `${SELECT_REPORTE} ${clausulaWhere}
      ORDER BY (r.estado = 'pendiente') DESC, r.creado_en DESC, r.id DESC`,
    parametros,
  );
  return filas.map(aReporte);
}

/**
 * Resuelve el reporte y aplica la decisión sobre la publicación dentro de una transacción.
 */
async function resolver({ id, publicacionId, moderadorId, accion, notaModeracion }) {
  await conTransaccion(async (conexion) => {
    const nota = notaModeracion || null;

    if (accion === 'ocultar') {
      await conexion.execute('UPDATE publicaciones SET oculta = 1 WHERE id = ?', [publicacionId]);
      await conexion.execute(
        `UPDATE reportes
            SET estado = 'revisado', accion_tomada = 'ocultar', moderador_id = ?,
                nota_moderacion = ?, resuelto_en = NOW()
          WHERE id = ?`,
        [moderadorId, nota, id],
      );
      await conexion.execute(
        `UPDATE reportes
            SET estado = 'revisado', accion_tomada = 'ocultar', moderador_id = ?,
                nota_moderacion = COALESCE(nota_moderacion, ?), resuelto_en = NOW()
          WHERE publicacion_id = ? AND id <> ? AND estado = 'pendiente'`,
        [moderadorId, nota, publicacionId, id],
      );
      return;
    }

    if (accion === 'mantener') {
      await conexion.execute('UPDATE publicaciones SET oculta = 0 WHERE id = ?', [publicacionId]);
      await conexion.execute(
        `UPDATE reportes
            SET estado = 'revisado', accion_tomada = 'mantener', moderador_id = ?,
                nota_moderacion = ?, resuelto_en = NOW()
          WHERE id = ?`,
        [moderadorId, nota, id],
      );
      return;
    }

    await conexion.execute(
      `UPDATE reportes
          SET estado = 'descartado', accion_tomada = 'ninguna', moderador_id = ?,
              nota_moderacion = ?, resuelto_en = NOW()
        WHERE id = ?`,
      [moderadorId, nota, id],
    );
  });

  return buscarPorId(id);
}

async function resumenAdmin() {
  const [[fila]] = await pool.execute(
    `SELECT
       (SELECT COUNT(*) FROM reportes WHERE estado = 'pendiente') AS reportes_pendientes,
       (SELECT COUNT(*) FROM publicaciones WHERE oculta = 0 AND estado_publicacion = 'activa') AS publicaciones_activas,
       (SELECT COUNT(*) FROM publicaciones WHERE oculta = 1) AS publicaciones_ocultas,
       (SELECT COUNT(*) FROM usuarios WHERE activo = 1) AS usuarios_activos,
       (SELECT COUNT(*) FROM usuarios) AS usuarios_totales`,
  );
  return {
    reportesPendientes: fila.reportes_pendientes,
    publicacionesActivas: fila.publicaciones_activas,
    publicacionesOcultas: fila.publicaciones_ocultas,
    usuariosActivos: fila.usuarios_activos,
    usuariosTotales: fila.usuarios_totales,
  };
}

module.exports = {
  MOTIVOS_REPORTE,
  existePendiente,
  crear,
  buscarPorId,
  listar,
  resolver,
  resumenAdmin,
};
