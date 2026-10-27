const { Router } = require('express');
const operaciones = require('../controllers/operacionesController');
const { requiereAutenticacion } = require('../middlewares/autenticacion');
const { permitirRoles } = require('../middlewares/autorizacion');
const validar = require('../middlewares/validar');
const reglas = require('../validators/operacionValidator');

const router = Router();

// Comprar y vender es exclusivo del rol usuario (matriz de acceso del README).
router.use(requiereAutenticacion, permitirRoles('usuario'));

router.get('/', operaciones.listar);
router.post('/', reglas.crear, validar, operaciones.crear);
router.patch('/:id/estado', reglas.cambiarEstado, validar, operaciones.cambiarEstado);

module.exports = router;
