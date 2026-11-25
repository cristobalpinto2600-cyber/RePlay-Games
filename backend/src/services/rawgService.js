/**
 * Integración con el servicio externo RAWG Video Games Database API (EF5).
 *
 * Permite autocompletar títulos e imágenes al publicar un juego y enriquecer el detalle
 * con ficha técnica oficial (lanzamiento, Metacritic, valoración y plataformas).
 * Incluye caché en memoria (TTL 10 minutos, máximo 100 entradas), timeout acotado y
 * fallback controlado si RAWG_API_KEY no está configurada o el servicio externo falla.
 */
const { rawg } = require('../config/env');

const TTL_CACHE_MS = 10 * 60 * 1000;
const MAX_CACHE = 100;
const cache = new Map();

function leerCache(clave) {
  const entrada = cache.get(clave);
  if (!entrada) {
    return null;
  }
  if (Date.now() > entrada.expiraEn) {
    cache.delete(clave);
    return null;
  }
  return entrada.valor;
}

function guardarCache(clave, valor) {
  if (cache.size >= MAX_CACHE) {
    const primeraClave = cache.keys().next().value;
    if (primeraClave !== undefined) {
      cache.delete(primeraClave);
    }
  }
  cache.set(clave, { valor, expiraEn: Date.now() + TTL_CACHE_MS });
}

function mapearJuego(juego) {
  return {
    idExterno: juego.id,
    titulo: juego.name,
    fechaLanzamiento: juego.released ?? null,
    metacritic: juego.metacritic ?? null,
    rating: typeof juego.rating === 'number' ? Number(juego.rating.toFixed(1)) : null,
    imagenUrl: juego.background_image ?? null,
    plataformas: Array.isArray(juego.platforms)
      ? juego.platforms.map((item) => item.platform?.name).filter(Boolean).slice(0, 6)
      : [],
    generos: Array.isArray(juego.genres)
      ? juego.genres.map((item) => item.name).filter(Boolean)
      : [],
  };
}

/**
 * Busca videojuegos en RAWG por texto libre. Nunca lanza excepción ante fallos externos.
 */
async function buscarJuegos(consulta) {
  const limpia = (consulta || '').trim();
  if (!limpia) {
    return {
      disponible: true,
      fuente: 'RAWG',
      resultados: [],
    };
  }

  if (!rawg.apiKey) {
    return {
      disponible: false,
      fuente: 'RAWG',
      mensaje: 'Integración RAWG no configurada (define RAWG_API_KEY en backend/.env).',
      resultados: [],
    };
  }

  const claveCache = `buscar:${limpia.toLowerCase()}`;
  const enCache = leerCache(claveCache);
  if (enCache) {
    return enCache;
  }

  try {
    const url = new URL(`${rawg.apiUrl}/games`);
    url.searchParams.set('key', rawg.apiKey);
    url.searchParams.set('search', limpia);
    url.searchParams.set('page_size', '5');

    const respuesta = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(rawg.timeoutMs),
    });

    if (!respuesta.ok) {
      throw new Error(`HTTP ${respuesta.status}`);
    }

    const datos = await respuesta.json();
    const resultados = Array.isArray(datos.results) ? datos.results.map(mapearJuego) : [];
    const salida = { disponible: true, fuente: 'RAWG', resultados };
    guardarCache(claveCache, salida);
    return salida;
  } catch (error) {
    console.warn('Error consultando RAWG API:', error.message);
    return {
      disponible: false,
      fuente: 'RAWG',
      mensaje: 'El servicio externo RAWG no está disponible en este momento.',
      resultados: [],
    };
  }
}

/**
 * Obtiene la ficha técnica más cercana para un título publicado.
 */
async function obtenerFichaPorTitulo(titulo) {
  const respuesta = await buscarJuegos(titulo);
  if (!respuesta.disponible) {
    return {
      disponible: false,
      fuente: 'RAWG',
      mensaje: respuesta.mensaje,
      ficha: null,
    };
  }

  const buscado = (titulo || '').trim().toLowerCase();
  const exacta = respuesta.resultados.find((item) => item.titulo.toLowerCase() === buscado);
  return {
    disponible: true,
    fuente: 'RAWG',
    ficha: exacta ?? respuesta.resultados[0] ?? null,
  };
}

module.exports = { buscarJuegos, obtenerFichaPorTitulo };
