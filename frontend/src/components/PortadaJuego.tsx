/**
 * Portada del videojuego (EF2, EF5).
 *
 * Si la publicación cuenta con imagenUrl válida, muestra la fotografía con carga diferida
 * (loading="lazy"). Si no hay imagen o falla su descarga, muestra el degradado estable con
 * iniciales del título como respaldo visual.
 */
import React, { useEffect, useState } from 'react';
import { iniciales, tonoDesdeTexto } from '../utils/formato';

interface Props {
  titulo: string;
  consola: string;
  imagenUrl?: string;
  tamano?: 'miniatura' | 'tarjeta' | 'detalle';
}

const PortadaJuego: React.FC<Props> = ({ titulo, consola, imagenUrl, tamano = 'tarjeta' }) => {
  const [errorImagen, setErrorImagen] = useState(false);

  useEffect(() => {
    setErrorImagen(false);
  }, [imagenUrl]);

  if (imagenUrl && !errorImagen) {
    return (
      <div className={`portada portada--${tamano} portada--con-imagen`}>
        <img
          src={imagenUrl}
          alt={`Portada de ${titulo} para ${consola}`}
          loading="lazy"
          className="portada__imagen"
          onError={() => setErrorImagen(true)}
        />
      </div>
    );
  }

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
