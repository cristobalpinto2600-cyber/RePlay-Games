const { Router } = require('express');
const usuarios = require('../controllers/usuariosController');
const { requiereAutenticacion } = require('../middlewares/autenticacion');
const { permitirRoles } = require('../middlewares/autorizacion');
const validar = require('../middlewares/validar');
const reglasAuth = require('../validators/authValidator');
const reglas = require('../validators/usuarioValidator');

const router = Router();

router.get('/', requiereAutenticacion, permitirRoles('administrador'), usuarios.listar);
router.patch('/perfil', requiereAutenticacion, reglasAuth.perfil, validar, usuarios.actualizarPerfil);
router.get('/:id', reglas.porId, validar, usuarios.obtenerPublico);
router.patch(
  '/:id/estado',
  requiereAutenticacion,
  permitirRoles('administrador'),
  reglas.cambiarEstado,
  validar,
  usuarios.cambiarEstado,
);

module.exports = router;
