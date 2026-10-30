/**
 * Aplicación Express de RePlay Games. Se separa de server.js para poder levantarla en pruebas
 * sin abrir un puerto.
 */
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const { origenesPermitidos } = require('./config/env');
const { manejarErrores, rutaNoEncontrada } = require('./middlewares/errores');
const rutas = require('./routes');

const app = express();

// Encabezados de seguridad HTTP (oculta X-Powered-By, evita sniffing de contenido, etc.).
app.use(helmet());

// Solo el frontend configurado en CORS_ORIGIN puede consumir la API desde el navegador.
app.use(
  cors({
    origin: origenesPermitidos,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.use(express.json({ limit: '100kb' }));
app.use(morgan('dev'));

app.use('/api', rutas);

app.use(rutaNoEncontrada);
app.use(manejarErrores);

module.exports = app;
