const { Router } = require('express');
const calificaciones = require('../controllers/calificacionesController');
const { requiereAutenticacion } = require('../middlewares/autenticacion');
const { permitirRoles } = require('../middlewares/autorizacion');
const validar = require('../middlewares/validar');
const reglas = require('../validators/calificacionValidator');

const router = Router();

router.get('/usuario/:id', reglas.porUsuario, validar, calificaciones.listarPorUsuario);
router.post(
  '/',
  requiereAutenticacion,
  permitirRoles('usuario'),
  reglas.crear,
  validar,
  calificaciones.crear,
);

module.exports = router;
