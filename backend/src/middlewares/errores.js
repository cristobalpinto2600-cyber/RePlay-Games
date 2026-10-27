/**
 * Respuestas de error comunes a toda la API: { mensaje, errores? }.
 * Los errores inesperados se registran en la consola del servidor y se responden con 500
 * sin exponer detalles internos.
 */
const ErrorHttp = require('../utils/ErrorHttp');

function rutaNoEncontrada(req, res) {
  res.status(404).json({ mensaje: `No existe la ruta ${req.method} ${req.originalUrl}.` });
}

// eslint-disable-next-line no-unused-vars
function manejarErrores(error, req, res, next) {
  if (error instanceof ErrorHttp) {
    const cuerpo = { mensaje: error.message };
    if (error.errores) {
      cuerpo.errores = error.errores;
    }
    return res.status(error.estado).json(cuerpo);
  }

  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ mensaje: 'El cuerpo de la solicitud no es un JSON válido.' });
  }
  if (error.type === 'entity.too.large') {
    return res.status(413).json({ mensaje: 'El cuerpo de la solicitud es demasiado grande.' });
  }

  console.error(error);
  return res.status(500).json({ mensaje: 'Ocurrió un error inesperado en el servidor.' });
}

module.exports = { rutaNoEncontrada, manejarErrores };
