/**
 * Pool de conexiones a MySQL / MariaDB.
 * Todas las consultas de la API usan pool.execute(sql, parametros): los valores viajan como
 * parámetros y nunca se concatenan en el SQL (RNF-SEG, prevención de inyección SQL).
 */
const mysql = require('mysql2/promise');
const { db } = require('./env');

const pool = mysql.createPool({
  ...db,
  charset: 'UTF8MB4_UNICODE_CI',
  waitForConnections: true,
  connectionLimit: 10,
  // Las fechas llegan como texto 'AAAA-MM-DD HH:MM:SS' y los DECIMAL como número.
  dateStrings: true,
  decimalNumbers: true,
});

/**
 * Ejecuta varias consultas dentro de una transacción: si alguna falla se revierten todas.
 * @param {(conexion: import('mysql2/promise').PoolConnection) => Promise<T>} trabajo
 * @returns {Promise<T>}
 * @template T
 */
async function conTransaccion(trabajo) {
  const conexion = await pool.getConnection();
  try {
    await conexion.beginTransaction();
    const resultado = await trabajo(conexion);
    await conexion.commit();
    return resultado;
  } catch (error) {
    await conexion.rollback();
    throw error;
  } finally {
    conexion.release();
  }
}

module.exports = { pool, conTransaccion };
