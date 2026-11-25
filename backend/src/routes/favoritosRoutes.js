const { Router } = require('express');
const favoritos = require('../controllers/favoritosController');
const { requiereAutenticacion } = require('../middlewares/autenticacion');
const { permitirRoles } = require('../middlewares/autorizacion');
const validar = require('../middlewares/validar');
const { idEnRuta } = require('../validators/comunes');

const router = Router();

router.use(requiereAutenticacion, permitirRoles('usuario'));

router.get('/', favoritos.listar);
router.get('/ids', favoritos.listarIds);
router.post('/:id', idEnRuta, validar, favoritos.agregar);
router.delete('/:id', idEnRuta, validar, favoritos.quitar);

module.exports = router;
