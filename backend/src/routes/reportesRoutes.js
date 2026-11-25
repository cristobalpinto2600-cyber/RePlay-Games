const { Router } = require('express');
const reportes = require('../controllers/reportesController');
const { requiereAutenticacion } = require('../middlewares/autenticacion');
const { permitirRoles } = require('../middlewares/autorizacion');
const validar = require('../middlewares/validar');
const reglas = require('../validators/reporteValidator');

const router = Router();
const soloAdmin = [requiereAutenticacion, permitirRoles('administrador')];

router.post(
  '/',
  requiereAutenticacion,
  permitirRoles('usuario'),
  reglas.crear,
  validar,
  reportes.crear,
);

// "/resumen" se declara antes de "/:id" para evitar colisión de ruta.
router.get('/resumen', soloAdmin, reportes.resumen);
router.get('/', soloAdmin, reglas.listar, validar, reportes.listar);
router.patch('/:id/resolver', soloAdmin, reglas.resolver, validar, reportes.resolver);

module.exports = router;
