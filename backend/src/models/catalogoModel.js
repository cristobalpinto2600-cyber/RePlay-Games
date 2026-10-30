/**
 * Catálogos fijos (consolas, géneros, regiones, comunas y modalidades de entrega).
 * Además de listarlos, traduce los nombres que envía el frontend a los identificadores de las
 * tablas relacionadas, informando por campo los valores que no existen.
 */
const { pool } = require('../config/db');
const ErrorHttp = require('../utils/ErrorHttp');

const ESTADOS_CONSERVACION = ['Nuevo / sellado', 'Como nuevo', 'Bueno', 'Aceptable', 'Con detalles'];

async function listar() {
  const [[consolas], [generos], [modalidades], [comunas]] = await Promise.all([
    pool.execute('SELECT nombre FROM consolas ORDER BY id'),
    pool.execute('SELECT nombre FROM generos ORDER BY id'),
    pool.execute('SELECT nombre FROM modalidades_entrega ORDER BY id'),
    pool.execute(
      `SELECT r.nombre AS region, c.nombre AS comuna
         FROM regiones r
         LEFT JOIN comunas c ON c.region_id = r.id
        ORDER BY r.id, c.id`,
    ),
  ]);

  const regiones = [];
  for (const fila of comunas) {
    let region = regiones.find((item) => item.nombre === fila.region);
    if (!region) {
      region = { nombre: fila.region, comunas: [] };
      regiones.push(region);
    }
    if (fila.comuna) {
      region.comunas.push(fila.comuna);
    }
  }

  return {
    consolas: consolas.map((fila) => fila.nombre),
    generos: generos.map((fila) => fila.nombre),
    estadosConservacion: ESTADOS_CONSERVACION,
    modalidadesEntrega: modalidades.map((fila) => fila.nombre),
    regiones,
  };
}

async function idPorNombre(tabla, nombre) {
  // La tabla nunca proviene del usuario: solo se llama con los nombres fijos de este módulo.
  const [filas] = await pool.execute(`SELECT id FROM ${tabla} WHERE nombre = ?`, [nombre]);
  return filas[0]?.id ?? null;
}

async function idsUbicacion(region, comuna) {
  const regionId = await idPorNombre('regiones', region);
  if (!regionId) {
    return { regionId: null, comunaId: null };
  }
  if (!comuna) {
    return { regionId, comunaId: null };
  }
  const [filas] = await pool.execute('SELECT id FROM comunas WHERE region_id = ? AND nombre = ?', [
    regionId,
    comuna,
  ]);
  return { regionId, comunaId: filas[0]?.id ?? null };
}

/**
 * Ubicación opcional del registro y del perfil. Si se indica comuna también debe indicarse la
 * región, y la comuna debe pertenecer a ella.
 */
async function resolverUbicacionOpcional(region, comuna) {
  if (!region && !comuna) {
    return { regionId: null, comunaId: null };
  }
  if (!region) {
    throw new ErrorHttp(400, 'Revisa los datos enviados.', [
      { campo: 'region', mensaje: 'Selecciona la región de la comuna indicada.' },
    ]);
  }
  const { regionId, comunaId } = await idsUbicacion(region, comuna);
  const errores = [];
  if (!regionId) {
    errores.push({ campo: 'region', mensaje: 'La región indicada no existe.' });
  } else if (comuna && !comunaId) {
    errores.push({ campo: 'comuna', mensaje: 'La comuna no pertenece a la región indicada.' });
  }
  if (errores.length > 0) {
    throw new ErrorHttp(400, 'Revisa los datos enviados.', errores);
  }
  return { regionId, comunaId };
}

/** Identificadores de consola, género, comuna y modalidades de una publicación (RF-03). */
async function resolverReferenciasPublicacion({ consola, genero, region, comuna, entregas }) {
  const [consolaId, generoId, ubicacion, modalidades] = await Promise.all([
    idPorNombre('consolas', consola),
    idPorNombre('generos', genero),
    idsUbicacion(region, comuna),
    Promise.all(entregas.map((nombre) => idPorNombre('modalidades_entrega', nombre))),
  ]);

  const errores = [];
  if (!consolaId) errores.push({ campo: 'consola', mensaje: 'La consola indicada no existe.' });
  if (!generoId) errores.push({ campo: 'genero', mensaje: 'El género indicado no existe.' });
  if (!ubicacion.regionId) {
    errores.push({ campo: 'region', mensaje: 'La región indicada no existe.' });
  } else if (!ubicacion.comunaId) {
    errores.push({ campo: 'comuna', mensaje: 'La comuna no pertenece a la región indicada.' });
  }
  if (modalidades.some((id) => id === null)) {
    errores.push({ campo: 'entregas', mensaje: 'Alguna modalidad de entrega no existe.' });
  }
  if (errores.length > 0) {
    throw new ErrorHttp(400, 'Revisa los datos enviados.', errores);
  }

  return {
    consolaId,
    generoId,
    comunaId: ubicacion.comunaId,
    modalidadIds: [...new Set(modalidades)],
  };
}

module.exports = {
  ESTADOS_CONSERVACION,
  listar,
  idPorNombre,
  resolverUbicacionOpcional,
  resolverReferenciasPublicacion,
};
