const { Router } = require('express');
const rateLimit = require('express-rate-limit');
const { maxIntentosAutenticacion } = require('../config/env');
const auth = require('../controllers/authController');
const { requiereAutenticacion } = require('../middlewares/autenticacion');
const validar = require('../middlewares/validar');
const reglas = require('../validators/authValidator');

// Limita los intentos fallidos por IP para dificultar ataques de fuerza bruta (responde 429).
const limiteIntentos = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: maxIntentosAutenticacion,
  skipSuccessfulRequests: true,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { mensaje: 'Demasiados intentos fallidos. Espera unos minutos antes de volver a intentarlo.' },
});

const router = Router();

router.post('/registro', limiteIntentos, reglas.registro, validar, auth.registrar);
router.post('/login', limiteIntentos, reglas.login, validar, auth.iniciarSesion);
router.get('/perfil', requiereAutenticacion, auth.perfil);

module.exports = router;
