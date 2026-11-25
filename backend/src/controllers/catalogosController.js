/** Listas fijas para formularios y filtros (consolas, géneros, estados, regiones y comunas). */
const catalogoModel = require('../models/catalogoModel');

async function listar(req, res) {
  res.set('Cache-Control', 'public, max-age=300');
  res.json(await catalogoModel.listar());
}

module.exports = { listar };
