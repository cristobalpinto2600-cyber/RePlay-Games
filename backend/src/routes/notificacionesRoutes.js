const { Router } = require('express');
const notificaciones = require('../controllers/notificacionesController');
const { requiereAutenticacion } = require('../middlewares/autenticacion');
const validar = require('../middlewares/validar');
const { idEnRuta } = require('../validators/comunes');

const router = Router();

router.use(requiereAutenticacion);

router.get('/', notificaciones.listar);
router.patch('/leer-todas', notificaciones.marcarTodasLeidas);
router.patch('/:id/leer', idEnRuta, validar, notificaciones.marcarLeida);

module.exports = router;
