/**
 * Convierte el reporte JSON de newman (resultados/newman.json) en resultados/resultados.md:
 * una tabla legible con cada solicitud, su código HTTP y sus pruebas, más la respuesta recibida.
 * Los tokens JWT se reemplazan por un marcador para no publicarlos en el repositorio.
 *
 * Uso (desde backend/): npm run test:api
 */
const fs = require('node:fs');
const path = require('node:path');

const carpeta = path.join(__dirname, 'resultados');
const reporte = JSON.parse(fs.readFileSync(path.join(carpeta, 'newman.json'), 'utf8'));
const { run, collection } = reporte;

const carpetaDeItem = new Map();
for (const grupo of collection.item) {
  for (const item of grupo.item ?? []) {
    carpetaDeItem.set(item.id, grupo.name);
  }
}

const ocultarTokens = (texto) => texto.replace(/eyJ[\w-]+\.[\w-]+\.[\w-]+/g, '<token JWT>');

function ruta(url) {
  const consulta = (url.query ?? []).map((par) => `${par.key}=${par.value}`).join('&');
  return `/${url.path.join('/')}${consulta ? `?${consulta}` : ''}`;
}

function cuerpo(respuesta) {
  if (!respuesta?.stream?.data?.length) {
    return '(sin cuerpo)';
  }
  const texto = Buffer.from(respuesta.stream.data).toString('utf8');
  let formateado = texto;
  try {
    formateado = JSON.stringify(JSON.parse(texto), null, 2);
  } catch {
    // No es JSON: se muestra tal cual.
  }
  formateado = ocultarTokens(formateado);
  return formateado.length > 1500 ? `${formateado.slice(0, 1500)}\n… (respuesta recortada)` : formateado;
}

const filas = [];
const detalles = [];
let carpetaActual = '';

run.executions.forEach((ejecucion, indice) => {
  const nombreCarpeta = carpetaDeItem.get(ejecucion.item.id) ?? '';
  if (nombreCarpeta !== carpetaActual) {
    carpetaActual = nombreCarpeta;
    filas.push(`| **${nombreCarpeta}** | | | | |`);
  }
  const asserts = ejecucion.assertions ?? [];
  const fallidas = asserts.filter((a) => a.error);
  const respuesta = ejecucion.response;
  const metodoRuta = `\`${ejecucion.request.method} ${ruta(ejecucion.request.url)}\``;
  filas.push(
    `| ${indice + 1} | ${ejecucion.item.name} | ${metodoRuta} | ${respuesta?.code ?? '—'} | ${
      fallidas.length === 0 ? '✅' : '❌'
    } ${asserts.length - fallidas.length}/${asserts.length} |`,
  );

  detalles.push(
    [
      `<details><summary>${indice + 1}. ${ejecucion.item.name} — ${ejecucion.request.method} ${ruta(
        ejecucion.request.url,
      )} → ${respuesta?.code} ${respuesta?.status ?? ''}</summary>`,
      '',
      ...asserts.map((a) => `- ${a.error ? '❌' : '✅'} ${a.assertion}${a.error ? ` — ${a.error.message}` : ''}`),
      '',
      '```json',
      cuerpo(respuesta),
      '```',
      '</details>',
    ].join('\n'),
  );
});

const stats = run.stats;
const tiempos = run.timings;
const contenido = [
  '# Resultados de las pruebas de la API (newman)',
  '',
  `Ejecución: ${new Date(tiempos.started).toISOString().replace('T', ' ').slice(0, 19)} UTC · ` +
    `colección \`${collection.info.name}\`.`,
  '',
  '| Solicitudes | Pruebas (assertions) | Fallidas | Tiempo promedio de respuesta |',
  '| :---: | :---: | :---: | :---: |',
  `| ${stats.requests.total} | ${stats.assertions.total} | ${stats.assertions.failed} | ${Math.round(
    tiempos.responseAverage,
  )} ms |`,
  '',
  '## Resumen por solicitud',
  '',
  '| # | Caso | Solicitud | Código | Pruebas |',
  '| :-- | :-- | :-- | :-: | :-: |',
  ...filas,
  '',
  '## Respuestas recibidas',
  '',
  'Los tokens JWT se reemplazan por `<token JWT>`.',
  '',
  ...detalles,
  '',
].join('\n');

fs.writeFileSync(path.join(carpeta, 'resultados.md'), contenido);
console.log(`Reporte generado en ${path.join('postman', 'resultados', 'resultados.md')}`);
