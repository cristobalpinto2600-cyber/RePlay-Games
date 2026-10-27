/**
 * Compras y ventas del usuario (RF-06, RF-07, RF-08). Ruta protegida: exige sesión iniciada.
 *
 * Separa las operaciones por tipo con un IonSegment y muestra el estado de cada una con el mismo
 * color y el mismo nombre en toda la aplicación (RNF-UX-02). La calificación queda habilitada
 * únicamente en las operaciones completadas (documento, sección 4.7).
 */
import {
  IonBadge,
  IonButton,
  IonContent,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonSkeletonText,
  IonText,
  IonToast,
} from '@ionic/react';
import { swapHorizontalOutline } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import EncabezadoPagina from '../components/EncabezadoPagina';
import MensajeVacio from '../components/MensajeVacio';
import PortadaJuego from '../components/PortadaJuego';
import { useSesion } from '../context/SesionContext';
import { RUTAS, rutaDetalle } from '../routes/rutas';
import type { OperacionDetallada, OperacionesDelUsuario } from '../services/operacionesService';
import { colorEstado, descripcionEstado, listarOperaciones } from '../services/operacionesService';
import { formatearFecha, formatearPrecio } from '../utils/formato';

type Segmento = 'compras' | 'ventas';

const OperacionesPage: React.FC = () => {
  const { usuario } = useSesion();
  const [segmento, setSegmento] = useState<Segmento>('compras');
  const [datos, setDatos] = useState<OperacionesDelUsuario>({ compras: [], ventas: [] });
  const [cargando, setCargando] = useState(true);
  const [aviso, setAviso] = useState('');

  useEffect(() => {
    if (!usuario) {
      return undefined;
    }

    let vigente = true;
    setCargando(true);

    listarOperaciones(usuario.id).then((resultado) => {
      if (vigente) {
        setDatos(resultado);
        setCargando(false);
      }
    });

    return () => {
      vigente = false;
    };
  }, [usuario]);

  const lista = segmento === 'compras' ? datos.compras : datos.ventas;

  const renderOperacion = (item: OperacionDetallada) => {
    const { operacion, publicacion, contraparte, rolUsuario } = item;
    const puedeCalificar = operacion.estado === 'completada' && !operacion.calificada;

    return (
      <article className="operacion" key={operacion.id}>
        <PortadaJuego
          titulo={publicacion.titulo}
          consola={publicacion.consola}
          tamano="miniatura"
        />

        <div className="operacion__datos">
          <h3 className="operacion__titulo">{publicacion.titulo}</h3>
          <IonBadge color={colorEstado(operacion.estado)}>{operacion.estado}</IonBadge>

          <p className="operacion__meta">
            {rolUsuario === 'comprador' ? 'Vendedor' : 'Comprador'}: {contraparte.nombreUsuario} ·{' '}
            {formatearPrecio(publicacion.precio)}
          </p>
          <p className="operacion__meta">
            {operacion.modalidadEntrega} · Solicitada el {formatearFecha(operacion.fechaCreacion)}
          </p>
          <IonText color="medium">
            <p className="operacion__meta">{descripcionEstado(operacion.estado)}</p>
          </IonText>

          <div className="operacion__acciones">
            <IonButton
              size="small"
              fill="outline"
              routerLink={rutaDetalle(publicacion.id)}
              routerDirection="forward"
            >
              Ver publicación
            </IonButton>

            {puedeCalificar && (
              <IonButton
                size="small"
                onClick={() =>
                  setAviso('La calificación de operaciones se incorpora en la próxima entrega (RF-08).')
                }
              >
                Calificar
              </IonButton>
            )}

            {operacion.calificada && (
              <IonText color="medium">
                <span className="nota"> Operación ya calificada</span>
              </IonText>
            )}
          </div>
        </div>
      </article>
    );
  };

  return (
    <IonPage>
      <EncabezadoPagina titulo="Compras y ventas" />

      <IonContent>
        <div className="operaciones">
          <IonSegment
            value={segmento}
            onIonChange={(evento) => setSegmento(evento.detail.value as Segmento)}
          >
            <IonSegmentButton value="compras">
              <IonLabel>Compras ({datos.compras.length})</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="ventas">
              <IonLabel>Ventas ({datos.ventas.length})</IonLabel>
            </IonSegmentButton>
          </IonSegment>

          <div className="ion-margin-top">
            {cargando ? (
              [0, 1, 2].map((posicion) => (
                <IonSkeletonText
                  key={posicion}
                  animated
                  style={{ height: '120px', borderRadius: '16px', marginBottom: '12px' }}
                />
              ))
            ) : lista.length === 0 ? (
              <MensajeVacio
                icono={swapHorizontalOutline}
                titulo={segmento === 'compras' ? 'Aún no tienes compras' : 'Aún no tienes ventas'}
                descripcion={
                  segmento === 'compras'
                    ? 'Cuando solicites la compra de un videojuego, la operación aparecerá aquí.'
                    : 'Cuando alguien solicite uno de tus videojuegos, la operación aparecerá aquí.'
                }
              >
                <IonButton routerLink={RUTAS.catalogo} routerDirection="root">
                  Ir al catálogo
                </IonButton>
              </MensajeVacio>
            ) : (
              lista.map(renderOperacion)
            )}
          </div>
        </div>

        <IonToast
          isOpen={aviso !== ''}
          message={aviso}
          duration={2600}
          onDidDismiss={() => setAviso('')}
        />
      </IonContent>
    </IonPage>
  );
};

export default OperacionesPage;
