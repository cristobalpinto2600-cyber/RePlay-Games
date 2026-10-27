/** Listas fijas para formularios y filtros (consolas, géneros, estados, regiones y comunas). */
const catalogoModel = require('../models/catalogoModel');

async function listar(req, res) {
  res.json(await catalogoModel.listar());
}

module.exports = { listar };
