/**
 * Calificación de una operación completada (RF-08). Ruta protegida del rol Usuario.
 */
import {
  IonAlert,
  IonButton,
  IonContent,
  IonIcon,
  IonNote,
  IonPage,
  IonSpinner,
  IonText,
  IonTextarea,
  useIonRouter,
} from '@ionic/react';
import { alertCircleOutline, star, starOutline } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import EncabezadoPagina from '../components/EncabezadoPagina';
import MensajeVacio from '../components/MensajeVacio';
import PortadaJuego from '../components/PortadaJuego';
import { RUTAS } from '../routes/rutas';
import { mensajeDeError, notificarCambioNotificaciones } from '../services/api';
import { crearCalificacion } from '../services/calificacionesService';
import { type OperacionDetallada, listarOperaciones } from '../services/operacionesService';
import { formatearPrecio } from '../utils/formato';

const ETIQUETAS_PUNTAJE = [
  'Muy mala experiencia',
  'Mala experiencia',
  'Aceptable',
  'Buena experiencia',
  'Excelente experiencia',
];

const CalificarOperacionPage: React.FC = () => {
  const { operacionId } = useParams<{ operacionId: string }>();
  const router = useIonRouter();

  const [detalle, setDetalle] = useState<OperacionDetallada | null>(null);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState('');

  const [puntaje, setPuntaje] = useState(5);
  const [comentario, setComentario] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState('');
  const [guardada, setGuardada] = useState(false);

  useEffect(() => {
    let vigente = true;
    const idBuscado = Number(operacionId);
    if (!Number.isInteger(idBuscado) || idBuscado < 1) {
      setErrorCarga('La operación indicada no es válida.');
      setCargando(false);
      return undefined;
    }

    setCargando(true);
    setErrorCarga('');
    listarOperaciones()
      .then(({ compras, ventas }) => {
        if (!vigente) return;
        const encontrada = [...compras, ...ventas].find(
          (item) => item.operacion.id === idBuscado,
        );
        if (!encontrada) {
          setErrorCarga('No encontramos esta operación en tu cuenta.');
          return;
        }
        if (encontrada.operacion.estado !== 'completada') {
          setErrorCarga('Solo puedes calificar operaciones que ya estén completadas.');
          return;
        }
        if (encontrada.operacion.calificada) {
          setErrorCarga('Esta operación ya fue calificada anteriormente.');
          return;
        }
        setDetalle(encontrada);
      })
      .catch((causa) => {
        if (vigente) {
          setErrorCarga(mensajeDeError(causa));
        }
      })
      .finally(() => {
        if (vigente) {
          setCargando(false);
        }
      });

    return () => {
      vigente = false;
    };
  }, [operacionId]);

  const enviar = async (evento: React.FormEvent) => {
    evento.preventDefault();
    if (!detalle) return;
    setEnviando(true);
    setErrorEnvio('');
    try {
      await crearCalificacion({
        operacionId: detalle.operacion.id,
        puntaje,
        comentario: comentario.trim() || undefined,
      });
      notificarCambioNotificaciones();
      setGuardada(true);
    } catch (causa) {
      setErrorEnvio(mensajeDeError(causa, 'No fue posible registrar tu calificación.'));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <IonPage>
      <EncabezadoPagina titulo="Calificar operación" conVolver rutaVolver={RUTAS.operaciones} />

      <IonContent>
        {cargando ? (
          <div className="pantalla-transicion">
            <IonSpinner name="crescent" />
            <IonText color="medium">
              <p>Cargando operación…</p>
            </IonText>
          </div>
        ) : !detalle ? (
          <MensajeVacio
            icono={alertCircleOutline}
            titulo="No es posible calificar"
            descripcion={errorCarga || 'La operación no está disponible para calificación.'}
          >
            <IonButton routerLink={RUTAS.operaciones} routerDirection="root">
              Volver a operaciones
            </IonButton>
          </MensajeVacio>
        ) : (
          <form className="formulario" onSubmit={enviar} noValidate>
            <div className="resumen-compra">
              <PortadaJuego
                titulo={detalle.publicacion.titulo}
                consola={detalle.publicacion.consola}
                tamano="miniatura"
              />
              <div>
                <h3>{detalle.publicacion.titulo}</h3>
                <p className="precio">{formatearPrecio(detalle.publicacion.precio)}</p>
                <IonText color="medium">
                  <p className="nota">
                    {detalle.rolUsuario === 'comprador' ? 'Vendedor' : 'Comprador'}:{' '}
                    <strong>{detalle.contraparte.nombreUsuario}</strong>
                  </p>
                </IonText>
              </div>
            </div>

            <h2 className="titulo-seccion">¿Cómo fue tu experiencia?</h2>
            <div className="estrellas" role="radiogroup" aria-label="Puntaje de 1 a 5 estrellas">
              {[1, 2, 3, 4, 5].map((valor) => (
                <IonButton
                  key={valor}
                  type="button"
                  fill="clear"
                  aria-label={`${valor} ${valor === 1 ? 'estrella' : 'estrellas'}`}
                  aria-checked={puntaje === valor}
                  onClick={() => setPuntaje(valor)}
                >
                  <IonIcon
                    slot="icon-only"
                    icon={valor <= puntaje ? star : starOutline}
                    color={valor <= puntaje ? 'secondary' : 'medium'}
                  />
                </IonButton>
              ))}
            </div>
            <IonText color="medium">
              <p className="nota ion-margin-bottom">{ETIQUETAS_PUNTAJE[puntaje - 1]}</p>
            </IonText>

            <IonTextarea
              label="Comentario o reseña (opcional)"
              labelPlacement="floating"
              fill="outline"
              rows={4}
              counter
              maxlength={300}
              value={comentario}
              helperText="Cuenta brevemente si el juego y la entrega cumplieron con lo acordado."
              onIonInput={(evento) => setComentario(evento.detail.value ?? '')}
            />

            <div className="formulario__acciones">
              {errorEnvio && (
                <IonNote color="danger">
                  <p className="nota" role="alert">
                    {errorEnvio}
                  </p>
                </IonNote>
              )}

              <IonButton type="submit" expand="block" disabled={enviando}>
                {enviando ? <IonSpinner name="crescent" /> : 'Enviar calificación'}
              </IonButton>
              <IonButton
                expand="block"
                fill="clear"
                routerLink={RUTAS.operaciones}
                routerDirection="root"
              >
                Cancelar
              </IonButton>
            </div>
          </form>
        )}

        <IonAlert
          isOpen={guardada}
          header="Calificación registrada"
          message="¡Gracias! Tu valoración ya aporta a la reputación dentro de RePlay Games."
          buttons={[
            {
              text: 'Volver a operaciones',
              handler: () => {
                setGuardada(false);
                router.push(RUTAS.operaciones, 'root', 'replace');
              },
            },
          ]}
          onDidDismiss={() => setGuardada(false)}
        />
      </IonContent>
    </IonPage>
  );
};

export default CalificarOperacionPage;
