/**
 * Acceso a publicaciones y a sus modalidades de entrega (RF-01 a RF-04, RF-10, EF4).
 *
 * Optimizaciones EF4:
 *  - Sustituye subconsulta correlacionada de modalidades por LEFT JOIN + GROUP BY.
 *  - Usa índice FULLTEXT ft_publicaciones_busqueda cuando la búsqueda tiene tokens >= 3 caracteres.
 *  - Embebe los datos públicos del vendedor en buscarPorId para ahorrar 1 petición HTTP.
 *  - Soporta paginación (page, limit) y ordenamiento seguro (recientes, precio_asc, precio_desc).
 */
const { pool, conTransaccion } = require('../config/db');

const JOINS_PUBLICACION = `
  FROM publicaciones p
  JOIN consolas co ON co.id = p.consola_id
  JOIN generos g ON g.id = p.genero_id
  JOIN comunas c ON c.id = p.comuna_id
  JOIN regiones r ON r.id = c.region_id
  LEFT JOIN publicacion_entregas pe ON pe.publicacion_id = p.id
  LEFT JOIN modalidades_entrega m ON m.id = pe.modalidad_id`;

const SELECT_PUBLICACION = `
  SELECT p.id, p.titulo, co.nombre AS consola, g.nombre AS genero, p.precio,
         p.estado_conservacion, p.estado_publicacion, p.oculta, p.descripcion,
         p.imagen_url, r.nombre AS region, c.nombre AS comuna, p.incluye_caja,
         p.incluye_manual, p.vendedor_id, p.creado_en,
         GROUP_CONCAT(DISTINCT m.nombre ORDER BY m.id SEPARATOR '|') AS entregas
  ${JOINS_PUBLICACION}`;

const GRUPO_PUBLICACION = 'GROUP BY p.id, co.id, g.id, c.id, r.id';

const ORDENES = {
  recientes: 'p.creado_en DESC, p.id DESC',
  precio_asc: 'p.precio ASC, p.id DESC',
  precio_desc: 'p.precio DESC, p.id DESC',
};

function aPublicacion(fila) {
  const publicacion = {
    id: fila.id,
    titulo: fila.titulo,
    consola: fila.consola,
    genero: fila.genero,
    precio: fila.precio,
    estadoConservacion: fila.estado_conservacion,
    estadoPublicacion: fila.estado_publicacion,
    oculta: Boolean(fila.oculta),
    descripcion: fila.descripcion,
    imagenUrl: fila.imagen_url ?? undefined,
    region: fila.region,
    comuna: fila.comuna,
    entregas: fila.entregas ? fila.entregas.split('|') : [],
    incluyeCaja: Boolean(fila.incluye_caja),
    incluyeManual: Boolean(fila.incluye_manual),
    vendedorId: fila.vendedor_id,
    fechaPublicacion: fila.creado_en.slice(0, 10),
  };

  if (fila.vendedor_nombre) {
    publicacion.vendedor = {
      id: fila.vendedor_id,
      nombreUsuario: fila.vendedor_nombre,
      reputacion: fila.vendedor_reputacion,
      totalCalificaciones: fila.vendedor_total_calificaciones,
      region: fila.vendedor_region ?? undefined,
      comuna: fila.vendedor_comuna ?? undefined,
      fechaRegistro: fila.vendedor_creado_en.slice(0, 10),
    };
  }

  return publicacion;
}

/** Escapa los comodines de LIKE para que el texto buscado se compare literalmente. */
function escaparLike(texto) {
  return texto.replace(/[\\%_]/g, (caracter) => `\\${caracter}`);
}

/** Construye una expresión BOOLEAN MODE segura sin operadores especiales ingresados por el usuario. */
function consultaBooleanaFulltext(texto) {
  const tokens = texto
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .trim()
    .split(/\s+/)
    .filter((palabra) => palabra.length >= 3);
  return tokens.length > 0 ? tokens.map((palabra) => `+${palabra}*`).join(' ') : null;
}

function construirWhereCatalogo(filtros) {
  const condiciones = ['p.oculta = 0', "p.estado_publicacion <> 'vendida'"];
  const parametros = [];

  if (filtros.texto) {
    const patron = `%${escaparLike(filtros.texto)}%`;
    const booleano = consultaBooleanaFulltext(filtros.texto);
    if (booleano) {
      condiciones.push(
        "(MATCH(p.titulo, p.descripcion) AGAINST (? IN BOOLEAN MODE) OR CONCAT_WS(' ', p.titulo, co.nombre, g.nombre) LIKE ?)",
      );
      parametros.push(booleano, patron);
    } else {
      condiciones.push("CONCAT_WS(' ', p.titulo, co.nombre, g.nombre) LIKE ?");
      parametros.push(patron);
    }
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

  return {
    clausulaWhere: `WHERE ${condiciones.join(' AND ')}`,
    parametros,
    orderBy: ORDENES[filtros.orden] || ORDENES.recientes,
  };
}

/**
 * Catálogo público completo (RF-01): publicaciones activas y pausadas que no estén ocultas.
 */
async function listarCatalogo(filtros) {
  const { clausulaWhere, parametros, orderBy } = construirWhereCatalogo(filtros);
  const [filas] = await pool.execute(
    `${SELECT_PUBLICACION} ${clausulaWhere} ${GRUPO_PUBLICACION} ORDER BY ${orderBy}`,
    parametros,
  );
  return filas.map(aPublicacion);
}

/**
 * Catálogo público paginado (EF4). Ejecuta conteo y página en paralelo.
 */
async function listarCatalogoPaginado(filtros) {
  const { clausulaWhere, parametros, orderBy } = construirWhereCatalogo(filtros);
  const page = Math.max(Number.parseInt(filtros.page, 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(filtros.limit, 10) || 12, 1), 50);
  const offset = (page - 1) * limit;

  // Los valores de LIMIT y OFFSET ya están estrictamente convertidos a enteros acotados para evitar
  // errores de argumentos en prepared statements de MySQL/MariaDB.
  const consultaConteo = `
    SELECT COUNT(*) AS total
      FROM publicaciones p
      JOIN consolas co ON co.id = p.consola_id
      JOIN generos g ON g.id = p.genero_id
      JOIN comunas c ON c.id = p.comuna_id
      JOIN regiones r ON r.id = c.region_id
    ${clausulaWhere}`;

  const consultaDatos = `
    ${SELECT_PUBLICACION}
    ${clausulaWhere}
    ${GRUPO_PUBLICACION}
    ORDER BY ${orderBy}
    LIMIT ${limit} OFFSET ${offset}`;

  const [[[conteo]], [filas]] = await Promise.all([
    pool.execute(consultaConteo, parametros),
    pool.execute(consultaDatos, parametros),
  ]);

  const total = conteo.total;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return {
    items: filas.map(aPublicacion),
    total,
    page,
    limit,
    totalPages,
  };
}

/** Detalle de publicación con datos públicos del vendedor embebidos (EF4). */
async function buscarPorId(id) {
  const [filas] = await pool.execute(
    `SELECT p.id, p.titulo, co.nombre AS consola, g.nombre AS genero, p.precio,
            p.estado_conservacion, p.estado_publicacion, p.oculta, p.descripcion,
            p.imagen_url, r.nombre AS region, c.nombre AS comuna, p.incluye_caja,
            p.incluye_manual, p.vendedor_id, p.creado_en,
            u.nombre_usuario AS vendedor_nombre,
            u.reputacion AS vendedor_reputacion,
            u.total_calificaciones AS vendedor_total_calificaciones,
            u.creado_en AS vendedor_creado_en,
            ru.nombre AS vendedor_region,
            cu.nombre AS vendedor_comuna,
            GROUP_CONCAT(DISTINCT m.nombre ORDER BY m.id SEPARATOR '|') AS entregas
       FROM publicaciones p
       JOIN consolas co ON co.id = p.consola_id
       JOIN generos g ON g.id = p.genero_id
       JOIN comunas c ON c.id = p.comuna_id
       JOIN regiones r ON r.id = c.region_id
       JOIN usuarios u ON u.id = p.vendedor_id
       LEFT JOIN regiones ru ON ru.id = u.region_id
       LEFT JOIN comunas cu ON cu.id = u.comuna_id
       LEFT JOIN publicacion_entregas pe ON pe.publicacion_id = p.id
       LEFT JOIN modalidades_entrega m ON m.id = pe.modalidad_id
      WHERE p.id = ?
      GROUP BY p.id, co.id, g.id, c.id, r.id, u.id, ru.id, cu.id`,
    [id],
  );
  return filas[0] ? aPublicacion(filas[0]) : null;
}

async function buscarPorIds(ids) {
  if (ids.length === 0) {
    return [];
  }
  const marcadores = ids.map(() => '?').join(', ');
  const [filas] = await pool.execute(
    `${SELECT_PUBLICACION} WHERE p.id IN (${marcadores}) ${GRUPO_PUBLICACION}`,
    ids,
  );
  return filas.map(aPublicacion);
}

/** Publicaciones propias en cualquier estado (RF-04). */
async function listarPorVendedor(vendedorId) {
  const [filas] = await pool.execute(
    `${SELECT_PUBLICACION} WHERE p.vendedor_id = ? ${GRUPO_PUBLICACION} ORDER BY p.creado_en DESC, p.id DESC`,
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
    datos.imagenUrl || null,
    referencias.comunaId,
    datos.incluyeCaja ? 1 : 0,
    datos.incluyeManual ? 1 : 0,
  ];
}

async function crear(vendedorId, datos, referencias) {
  return conTransaccion(async (conexion) => {
    const [resultado] = await conexion.execute(
      `INSERT INTO publicaciones
         (titulo, consola_id, genero_id, precio, estado_conservacion, descripcion, imagen_url,
          comuna_id, incluye_caja, incluye_manual, vendedor_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
              descripcion = ?, imagen_url = ?, comuna_id = ?, incluye_caja = ?, incluye_manual = ?
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
  SELECT_PUBLICACION,
  GRUPO_PUBLICACION,
  aPublicacion,
  listarCatalogo,
  listarCatalogoPaginado,
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
