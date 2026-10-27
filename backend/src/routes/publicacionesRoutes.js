const { Router } = require('express');
const publicaciones = require('../controllers/publicacionesController');
const { autenticacionOpcional, requiereAutenticacion } = require('../middlewares/autenticacion');
const { permitirRoles } = require('../middlewares/autorizacion');
const validar = require('../middlewares/validar');
const reglas = require('../validators/publicacionValidator');

const router = Router();
const soloUsuario = [requiereAutenticacion, permitirRoles('usuario')];

// Rutas públicas.
router.get('/', reglas.filtrosCatalogo, validar, publicaciones.listar);

// "/mias" se declara antes de "/:id" para que no se interprete como identificador.
router.get('/mias', soloUsuario, publicaciones.listarMias);
router.get('/:id', reglas.porId, validar, autenticacionOpcional, publicaciones.obtener);

// Gestión de publicaciones propias (rol usuario).
router.post('/', soloUsuario, reglas.crear, validar, publicaciones.crear);
router.put('/:id', soloUsuario, reglas.actualizar, validar, publicaciones.actualizar);
router.patch('/:id/estado', soloUsuario, reglas.cambiarEstado, validar, publicaciones.cambiarEstado);
router.delete(
  '/:id',
  requiereAutenticacion,
  permitirRoles('usuario', 'administrador'),
  reglas.porId,
  validar,
  publicaciones.eliminar,
);

// Moderación (rol administrador).
router.patch(
  '/:id/moderacion',
  requiereAutenticacion,
  permitirRoles('administrador'),
  reglas.moderar,
  validar,
  publicaciones.moderar,
);

module.exports = router;
