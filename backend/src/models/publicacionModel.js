/**
 * Acceso a publicaciones y a sus modalidades de entrega (RF-01 a RF-04, RF-10).
 * Las respuestas usan los mismos nombres de campo que frontend/src/models (interfaz Publicacion).
 */
const { pool, conTransaccion } = require('../config/db');

const SELECT_PUBLICACION = `
  SELECT p.id, p.titulo, co.nombre AS consola, g.nombre AS genero, p.precio,
         p.estado_conservacion, p.estado_publicacion, p.oculta, p.descripcion,
         r.nombre AS region, c.nombre AS comuna, p.incluye_caja, p.incluye_manual,
         p.vendedor_id, p.creado_en,
         (SELECT GROUP_CONCAT(m.nombre ORDER BY m.id SEPARATOR '|')
            FROM publicacion_entregas pe
            JOIN modalidades_entrega m ON m.id = pe.modalidad_id
           WHERE pe.publicacion_id = p.id) AS entregas
    FROM publicaciones p
    JOIN consolas co ON co.id = p.consola_id
    JOIN generos g ON g.id = p.genero_id
    JOIN comunas c ON c.id = p.comuna_id
    JOIN regiones r ON r.id = c.region_id`;

function aPublicacion(fila) {
  return {
    id: fila.id,
    titulo: fila.titulo,
    consola: fila.consola,
    genero: fila.genero,
    precio: fila.precio,
    estadoConservacion: fila.estado_conservacion,
    estadoPublicacion: fila.estado_publicacion,
    oculta: Boolean(fila.oculta),
    descripcion: fila.descripcion,
    region: fila.region,
    comuna: fila.comuna,
    entregas: fila.entregas ? fila.entregas.split('|') : [],
    incluyeCaja: Boolean(fila.incluye_caja),
    incluyeManual: Boolean(fila.incluye_manual),
    vendedorId: fila.vendedor_id,
    fechaPublicacion: fila.creado_en.slice(0, 10),
  };
}

/** Escapa los comodines de LIKE para que el texto buscado se compare literalmente. */
function escaparLike(texto) {
  return texto.replace(/[\\%_]/g, (caracter) => `\\${caracter}`);
}

/**
 * Catálogo público (RF-01): publicaciones activas y pausadas que no estén ocultas por moderación.
 * La intercalación utf8mb4_unicode_ci hace que la búsqueda ignore mayúsculas y tildes.
 */
async function listarCatalogo(filtros) {
  const condiciones = ["p.oculta = 0", "p.estado_publicacion <> 'vendida'"];
  const parametros = [];

  if (filtros.texto) {
    condiciones.push("CONCAT_WS(' ', p.titulo, co.nombre, g.nombre) LIKE ?");
    parametros.push(`%${escaparLike(filtros.texto)}%`);
  }
  if (filtros.consola) {
    condiciones.push('co.nombre = ?');
    parametros.push(filtros.consola);
  }
  if (filtros.genero) {
    condiciones.push('g.nombre = ?');
    parametros.push(filtros.genero);
  }
  if (filtros.estadoConservacion) {
    condiciones.push('p.estado_conservacion = ?');
    parametros.push(filtros.estadoConservacion);
  }
  if (filtros.comuna) {
    condiciones.push('c.nombre = ?');
    parametros.push(filtros.comuna);
  }
  if (filtros.precioMaximo !== undefined) {
    condiciones.push('p.precio <= ?');
    parametros.push(filtros.precioMaximo);
  }

  const [filas] = await pool.execute(
    `${SELECT_PUBLICACION} WHERE ${condiciones.join(' AND ')} ORDER BY p.creado_en DESC, p.id DESC`,
    parametros,
  );
  return filas.map(aPublicacion);
}

async function buscarPorId(id) {
  const [filas] = await pool.execute(`${SELECT_PUBLICACION} WHERE p.id = ?`, [id]);
  return filas[0] ? aPublicacion(filas[0]) : null;
}

async function buscarPorIds(ids) {
  if (ids.length === 0) {
    return [];
  }
  const marcadores = ids.map(() => '?').join(', ');
  const [filas] = await pool.execute(`${SELECT_PUBLICACION} WHERE p.id IN (${marcadores})`, ids);
  return filas.map(aPublicacion);
}

/** Publicaciones propias en cualquier estado (RF-04). */
async function listarPorVendedor(vendedorId) {
  const [filas] = await pool.execute(
    `${SELECT_PUBLICACION} WHERE p.vendedor_id = ? ORDER BY p.creado_en DESC, p.id DESC`,
    [vendedorId],
  );
  return filas.map(aPublicacion);
}

async function guardarEntregas(conexion, publicacionId, modalidadIds) {
  await conexion.execute('DELETE FROM publicacion_entregas WHERE publicacion_id = ?', [publicacionId]);
  for (const modalidadId of modalidadIds) {
    await conexion.execute(
      'INSERT INTO publicacion_entregas (publicacion_id, modalidad_id) VALUES (?, ?)',
      [publicacionId, modalidadId],
    );
  }
}

function columnas(datos, referencias) {
  return [
    datos.titulo,
    referencias.consolaId,
    referencias.generoId,
    datos.precio,
    datos.estadoConservacion,
    datos.descripcion,
    referencias.comunaId,
    datos.incluyeCaja ? 1 : 0,
    datos.incluyeManual ? 1 : 0,
  ];
}

async function crear(vendedorId, datos, referencias) {
  return conTransaccion(async (conexion) => {
    const [resultado] = await conexion.execute(
      `INSERT INTO publicaciones
         (titulo, consola_id, genero_id, precio, estado_conservacion, descripcion, comuna_id,
          incluye_caja, incluye_manual, vendedor_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [...columnas(datos, referencias), vendedorId],
    );
    await guardarEntregas(conexion, resultado.insertId, referencias.modalidadIds);
    return resultado.insertId;
  });
}

async function actualizar(id, datos, referencias) {
  await conTransaccion(async (conexion) => {
    await conexion.execute(
      `UPDATE publicaciones
          SET titulo = ?, consola_id = ?, genero_id = ?, precio = ?, estado_conservacion = ?,
              descripcion = ?, comuna_id = ?, incluye_caja = ?, incluye_manual = ?
        WHERE id = ?`,
      [...columnas(datos, referencias), id],
    );
    await guardarEntregas(conexion, id, referencias.modalidadIds);
  });
}

async function cambiarEstado(id, estadoPublicacion) {
  await pool.execute('UPDATE publicaciones SET estado_publicacion = ? WHERE id = ?', [estadoPublicacion, id]);
}

async function cambiarOculta(id, oculta) {
  await pool.execute('UPDATE publicaciones SET oculta = ? WHERE id = ?', [oculta ? 1 : 0, id]);
}

async function contarOperaciones(id) {
  const [filas] = await pool.execute('SELECT COUNT(*) AS total FROM operaciones WHERE publicacion_id = ?', [id]);
  return filas[0].total;
}

/** Las modalidades de entrega se eliminan en cascada (ON DELETE CASCADE). */
async function eliminar(id) {
  await pool.execute('DELETE FROM publicaciones WHERE id = ?', [id]);
}

module.exports = {
  listarCatalogo,
  buscarPorId,
  buscarPorIds,
  listarPorVendedor,
  crear,
  actualizar,
  cambiarEstado,
  cambiarOculta,
  contarOperaciones,
  eliminar,
};
