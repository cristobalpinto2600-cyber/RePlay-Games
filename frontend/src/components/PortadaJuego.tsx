/**
 * Portada del videojuego generada a partir del título.
 *
 * EP1 no incluye carga de imágenes reales: se dibuja un degradado estable (siempre el mismo
 * color para el mismo título) con las iniciales del juego, de modo que el catálogo se vea
 * completo sin depender de archivos ni servicios externos. En EP2 este componente se reemplaza
 * por las fotografías subidas por la persona vendedora (RF-02, RF-03).
 */
import React from 'react';
import { iniciales, tonoDesdeTexto } from '../utils/formato';

interface Props {
  titulo: string;
  consola: string;
  tamano?: 'miniatura' | 'tarjeta' | 'detalle';
}

const PortadaJuego: React.FC<Props> = ({ titulo, consola, tamano = 'tarjeta' }) => {
  const tono = tonoDesdeTexto(titulo);
  const estilo: React.CSSProperties = {
    backgroundImage: `linear-gradient(140deg, hsl(${tono} 62% 48%), hsl(${(tono + 45) % 360} 68% 26%))`,
  };

  return (
    <div
      className={`portada portada--${tamano}`}
      style={estilo}
      role="img"
      aria-label={`Portada de ${titulo} para ${consola}`}
    >
      <span className="portada__iniciales">{iniciales(titulo)}</span>
      {tamano !== 'miniatura' && <span className="portada__consola">{consola}</span>}
    </div>
  );
};

export default PortadaJuego;
