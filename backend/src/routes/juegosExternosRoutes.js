const { Router } = require('express');
const { query } = require('express-validator');
const juegosExternos = require('../controllers/juegosExternosController');
const { requiereAutenticacion } = require('../middlewares/autenticacion');
const validar = require('../middlewares/validar');
const { textoObligatorio } = require('../validators/comunes');

const router = Router();

router.get(
  '/buscar',
  requiereAutenticacion,
  [
    textoObligatorio(query('q'), 'Ingresa el nombre del videojuego a buscar.')
      .isLength({ min: 2, max: 80 })
      .withMessage('La búsqueda debe tener entre 2 y 80 caracteres.'),
  ],
  validar,
  juegosExternos.buscar,
);

router.get(
  '/ficha',
  [
    textoObligatorio(query('titulo'), 'Indica el título del videojuego.')
      .isLength({ min: 2, max: 120 })
      .withMessage('El título debe tener entre 2 y 120 caracteres.'),
  ],
  validar,
  juegosExternos.ficha,
);

module.exports = router;
