/** Arranque del servidor: verifica la conexión a la base de datos y abre el puerto. */
const app = require('./app');
const { pool } = require('./config/db');
const { puerto } = require('./config/env');

async function iniciar() {
  try {
    await pool.execute('SELECT 1');
  } catch (error) {
    console.error(`No fue posible conectar con la base de datos: ${error.message}`);
    console.error('Revisa que MySQL esté iniciado, que exista la base replay_games y los datos de backend/.env.');
    process.exit(1);
  }

  app.listen(puerto, () => {
    console.log(`API de RePlay Games escuchando en http://localhost:${puerto}/api`);
  });
}

iniciar();
