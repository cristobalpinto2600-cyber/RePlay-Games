/**
 * Consulta de fichas externas de videojuegos vía RAWG API (EF5).
 */
const { matchedData } = require('express-validator');
const rawgService = require('../services/rawgService');

async function buscar(req, res) {
  const { q } = matchedData(req, { locations: ['query'] });
  res.json(await rawgService.buscarJuegos(q));
}

async function ficha(req, res) {
  const { titulo } = matchedData(req, { locations: ['query'] });
  res.json(await rawgService.obtenerFichaPorTitulo(titulo));
}

module.exports = { buscar, ficha };
