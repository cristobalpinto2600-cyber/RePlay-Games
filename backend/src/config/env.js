/**
 * Configuración de la API leída desde variables de entorno (RNF-SEG-04).
 * Los secretos viven en backend/.env, que no se versiona; .env.example documenta cada variable.
 */
const path = require('node:path');

try {
  process.loadEnvFile(path.join(__dirname, '..', '..', '.env'));
} catch {
  // Sin archivo .env se usan las variables ya definidas en el entorno (por ejemplo, en Docker).
}

function requerida(nombre) {
  const valor = process.env[nombre];
  if (valor === undefined || valor.trim() === '') {
    throw new Error(`Falta la variable de entorno ${nombre}. Revisa backend/.env (ver .env.example).`);
  }
  return valor;
}

const secretoJwt = requerida('JWT_SECRET');
if (secretoJwt.length < 32) {
  throw new Error('JWT_SECRET debe tener al menos 32 caracteres.');
}

module.exports = {
  puerto: Number(process.env.PORT) || 3000,
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: requerida('DB_USER'),
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_NAME || 'replay_games',
  },
  jwt: {
    secreto: secretoJwt,
    expiracion: process.env.JWT_EXPIRES_IN || '2h',
  },
  origenesPermitidos: (process.env.CORS_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((origen) => origen.trim())
    .filter(Boolean),
  maxIntentosAutenticacion: Number(process.env.AUTH_MAX_INTENTOS) || 20,
};
