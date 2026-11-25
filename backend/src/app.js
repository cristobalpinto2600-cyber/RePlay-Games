/**
 * Aplicación Express de RePlay Games. Se separa de server.js para poder levantarla en pruebas
 * sin abrir un puerto.
 *
 * Incluye protección contra XSS, CORS estricto por orígenes permitidos, Helmet con CSP y
 * rate limiting global sobre /api (EF3).
 */
const cors = require('cors');
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const morgan = require('morgan');
const { maxPeticionesApi, origenesPermitidos } = require('./config/env');
const { manejarErrores, rutaNoEncontrada } = require('./middlewares/errores');
const { sanitizarEntrada } = require('./middlewares/sanitizar');
const rutas = require('./routes');
const ErrorHttp = require('./utils/ErrorHttp');

const app = express();

// Encabezados de seguridad HTTP con Content-Security-Policy explícita (EF3).
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", 'https:', 'data:'],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
      },
    },
    referrerPolicy: { policy: 'no-referrer' },
  }),
);

// Solo los orígenes autorizados en CORS_ORIGIN pueden consumir la API desde navegador (EF3).
app.use(
  cors({
    origin(origen, callback) {
      if (!origen || origenesPermitidos.includes(origen)) {
        return callback(null, true);
      }
      return callback(new ErrorHttp(403, 'Origen no autorizado por CORS.'));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['X-Total-Count', 'X-Page', 'X-Limit', 'X-Total-Pages'],
  }),
);

// Límite global de solicitudes por IP para mitigar abuso o denegación de servicio (EF3).
const limiteApi = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: maxPeticionesApi,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  skip: (req) => req.path === '/salud',
  message: { mensaje: 'Has realizado demasiadas solicitudes. Intenta nuevamente en unos minutos.' },
});

app.use(express.json({ limit: '100kb' }));
app.use(sanitizarEntrada);
app.use(morgan('dev'));

app.use('/api', limiteApi, rutas);

app.use(rutaNoEncontrada);
app.use(manejarErrores);

module.exports = app;
