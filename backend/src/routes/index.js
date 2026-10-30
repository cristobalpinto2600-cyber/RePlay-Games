/** Punto de entrada de la API REST: todas las rutas cuelgan de /api. */
const { Router } = require('express');
const { pool } = require('../config/db');
const catalogos = require('../controllers/catalogosController');
const authRoutes = require('./authRoutes');
const operacionesRoutes = require('./operacionesRoutes');
const publicacionesRoutes = require('./publicacionesRoutes');
const usuariosRoutes = require('./usuariosRoutes');

const router = Router();

/** Estado del servidor y de la conexión a la base de datos. */
router.get('/salud', async (req, res) => {
  await pool.execute('SELECT 1');
  res.json({ estado: 'ok', baseDatos: 'conectada' });
});

router.get('/catalogos', catalogos.listar);
router.use('/auth', authRoutes);
router.use('/usuarios', usuariosRoutes);
router.use('/publicaciones', publicacionesRoutes);
router.use('/operaciones', operacionesRoutes);

module.exports = router;
