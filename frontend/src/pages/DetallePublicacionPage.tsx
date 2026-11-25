/**
 * Detalle de una publicación (RF-02), favoritos (RF-05), solicitud de compra (RF-06),
 * reseñas del vendedor (RF-08), reporte (RF-09) y ficha externa RAWG (EF5).
 */
import {
  IonBadge,
  IonButton,
  IonChip,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
  IonSpinner,
  IonText,
  IonToast,
} from '@ionic/react';
import {
  alertCircleOutline,
  calendarOutline,
  cloudOfflineOutline,
  cubeOutline,
  flagOutline,
  heart,
  heartOutline,
  locationOutline,
  personCircleOutline,
  sparklesOutline,
  star,
} from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import EncabezadoPagina from '../components/EncabezadoPagina';
import MensajeVacio from '../components/MensajeVacio';
import ModalReportarPublicacion from '../components/ModalReportarPublicacion';
import ModalSolicitudCompra from '../components/ModalSolicitudCompra';
import PortadaJuego from '../components/PortadaJuego';
import { useSesion } from '../context/SesionContext';
import type { Calificacion, ModalidadEntrega, Publicacion, Usuario } from '../models';
import { RUTAS, rutaLoginCon } from '../routes/rutas';
import { mensajeDeError, notificarCambioNotificaciones } from '../services/api';
import { listarCalificacionesUsuario } from '../services/calificacionesService';
import {
  agregarFavorito,
  listarIdsFavoritos,
  quitarFavorito,
} from '../services/favoritosService';
import { type JuegoExterno, obtenerFichaExterna } from '../services/juegosExternosService';
import { crearOperacion } from '../services/operacionesService';
import { estaDisponible, obtenerPublicacion } from '../services/publicacionesService';
import { obtenerUsuario } from '../services/usuariosService';
import { formatearFecha, formatearPrecio } from '../utils/formato';

const DetallePublicacionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { usuario } = useSesion();
  const historial = useHistory();
  const ubicacion = useLocation();

  const [publicacion, setPublicacion] = useState<Publicacion | null>(null);
  const [vendedor, setVendedor] = useState<Usuario | undefined>(undefined);
  const [resenas, setResenas] = useState<Calificacion[]>([]);
  const [fichaRawg, setFichaRawg] = useState<JuegoExterno | null>(null);
  const [esFavorito, setEsFavorito] = useState(false);
  const [actualizandoFavorito, setActualizandoFavorito] = useState(false);

  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState('');
  const [modalCompra, setModalCompra] = useState(false);
  const [modalReporte, setModalReporte] = useState(false);
  const [enviandoSolicitud, setEnviandoSolicitud] = useState(false);
  const [aviso, setAviso] = useState('');
  const [confirmacion, setConfirmacion] = useState('');

  useEffect(() => {
    let vigente = true;
    setCargando(true);
    setErrorCarga('');
    setFichaRawg(null);

    obtenerPublicacion(id)
      .then(async (encontrada) => {
        if (!vigente) return;
        setPublicacion(encontrada ?? null);

        if (encontrada) {
          const [datosVendedor, resenasVendedor] = await Promise.all([
            encontrada.vendedor
              ? Promise.resolve(encontrada.vendedor)
              : obtenerUsuario(encontrada.vendedorId),
            listarCalificacionesUsuario(encontrada.vendedorId).catch(() => []),
          ]);
          if (vigente) {
            setVendedor(datosVendedor);
            setResenas(resenasVendedor);
          }

          obtenerFichaExterna(encontrada.titulo)
            .then((resp) => {
              if (vigente && resp.disponible && resp.ficha) {
                setFichaRawg(resp.ficha);
              }
            })
            .catch(() => {
              // Ficha externa auxiliar: nunca bloquea el detalle principal.
            });
        }
      })
      .catch((causa) => {
        if (vigente) {
          setPublicacion(null);
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
  }, [id]);

  useEffect(() => {
    if (!publicacion || usuario?.rol !== 'usuario') {
      setEsFavorito(false);
      return;
    }
    let vigente = true;
    listarIdsFavoritos()
      .then((ids) => {
        if (vigente) {
          setEsFavorito(ids.includes(publicacion.id));
        }
      })
      .catch(() => {
        // Sin bloqueo si falla la verificación auxiliar de favoritos.
      });

    return () => {
      vigente = false;
    };
  }, [publicacion?.id, usuario?.id, usuario?.rol]);

  const exigirSesion = (): boolean => {
    if (!usuario) {
      historial.push(rutaLoginCon(`${ubicacion.pathname}${ubicacion.search}`));
      return false;
    }
    return true;
  };

  const iniciarSolicitud = () => {
    if (!exigirSesion()) return;
    setModalCompra(true);
  };

  const alternarFavorito = async () => {
    if (!publicacion || !exigirSesion()) return;
    setActualizandoFavorito(true);
    try {
      if (esFavorito) {
        await quitarFavorito(publicacion.id);
        setEsFavorito(false);
        setAviso('Quitado de tus favoritos.');
      } else {
        await agregarFavorito(publicacion.id);
        setEsFavorito(true);
        setAviso('Guardado en tus favoritos.');
      }
    } catch (error) {
      setAviso(mensajeDeError(error, 'No fue posible actualizar favoritos.'));
    } finally {
      setActualizandoFavorito(false);
    }
  };

  const abrirReporte = () => {
    if (!exigirSesion()) return;
    setModalReporte(true);
  };

  const confirmarSolicitud = async (modalidad: ModalidadEntrega) => {
    if (!publicacion) return;
    setModalCompra(false);
    setEnviandoSolicitud(true);
    try {
      await crearOperacion(publicacion.id, modalidad);
      notificarCambioNotificaciones();
      setConfirmacion(
        `Solicitud registrada con entrega "${modalidad}". Queda como operación pendiente de confirmación del vendedor.`,
      );
    } catch (error) {
      setAviso(mensajeDeError(error, 'No fue posible registrar la solicitud.'));
    } finally {
      setEnviandoSolicitud(false);
    }
  };

  if (cargando) {
    return (
      <IonPage>
        <EncabezadoPagina titulo="Publicación" conVolver />
        <IonContent>
          <div className="pantalla-transicion">
            <IonSpinner name="crescent" />
            <IonText color="medium">
              <p>Cargando publicación…</p>
            </IonText>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  if (!publicacion) {
    return (
      <IonPage>
        <EncabezadoPagina titulo="Publicación" conVolver />
        <IonContent>
          <MensajeVacio
            icono={errorCarga ? cloudOfflineOutline : alertCircleOutline}
            titulo={errorCarga ? 'No pudimos cargar la publicación' : 'Publicación no disponible'}
            descripcion={errorCarga || 'La publicación que buscas no existe o fue retirada del catálogo.'}
          >
            <IonButton routerLink={RUTAS.catalogo} routerDirection="root">
              Volver al catálogo
            </IonButton>
          </MensajeVacio>
        </IonContent>
      </IonPage>
    );
  }

  const disponible = estaDisponible(publicacion);
  const esPropia = usuario?.id === publicacion.vendedorId;
  const esAdministrador = usuario?.rol === 'administrador';

  return (
    <IonPage>
      <EncabezadoPagina titulo="Detalle" conVolver />

      <IonContent>
        <div className="detalle">
          <PortadaJuego
            titulo={publicacion.titulo}
            consola={publicacion.consola}
            imagenUrl={publicacion.imagenUrl ?? fichaRawg?.imagenUrl ?? undefined}
            tamano="detalle"
          />

          <div className="detalle__encabezado">
            <h1>{publicacion.titulo}</h1>
            <p className="detalle__precio">{formatearPrecio(publicacion.precio)}</p>

            <div className="detalle__chips">
              <IonChip color="primary">{publicacion.consola}</IonChip>
              <IonChip color="medium">{publicacion.genero}</IonChip>
              <IonChip color="secondary">{publicacion.estadoConservacion}</IonChip>
              {!disponible && (
                <IonBadge color="warning">
                  {publicacion.estadoPublicacion === 'pausada' ? 'Pausada' : 'Vendida'}
                </IonBadge>
              )}
              {publicacion.oculta && <IonBadge color="danger">Oculta por moderación</IonBadge>}
            </div>
          </div>

          <IonText>
            <p>{publicacion.descripcion}</p>
          </IonText>

          {fichaRawg && (
            <div className="rawg-ficha">
              <div className="rawg-ficha__cabecera">
                <span className="rawg-ficha__titulo">
                  <IonIcon icon={sparklesOutline} aria-hidden="true" /> Ficha técnica oficial (RAWG)
                </span>
                {fichaRawg.metacritic !== null && (
                  <IonBadge color="success">Metacritic {fichaRawg.metacritic}</IonBadge>
                )}
              </div>
              <p className="operacion__meta">
                Lanzamiento: {fichaRawg.fechaLanzamiento ?? 'No informado'}
                {fichaRawg.rating !== null ? ` · Valoración: ${fichaRawg.rating}/5` : ''}
              </p>
              {fichaRawg.plataformas.length > 0 && (
                <p className="operacion__meta">
                  Plataformas: {fichaRawg.plataformas.join(', ')}
                </p>
              )}
            </div>
          )}

          <h2 className="titulo-seccion">Información del producto</h2>
          <IonList lines="full">
            <IonItem>
              <IonIcon slot="start" icon={locationOutline} aria-hidden="true" />
              <IonLabel>
                <h3>Ubicación</h3>
                <p>
                  {publicacion.comuna}, región de {publicacion.region}
                </p>
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonIcon slot="start" icon={cubeOutline} aria-hidden="true" />
              <IonLabel>
                <h3>Modalidades de entrega</h3>
                <p>{publicacion.entregas.join(' · ')}</p>
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonIcon slot="start" icon={calendarOutline} aria-hidden="true" />
              <IonLabel>
                <h3>Publicado</h3>
                <p>{formatearFecha(publicacion.fechaPublicacion)}</p>
              </IonLabel>
            </IonItem>
            <IonItem lines="none">
              <IonLabel>
                <h3>Incluye</h3>
                <p>
                  {publicacion.incluyeCaja ? 'Caja original' : 'Sin caja'} ·{' '}
                  {publicacion.incluyeManual ? 'Manual' : 'Sin manual'}
                </p>
              </IonLabel>
            </IonItem>
          </IonList>

          <h2 className="titulo-seccion">Vendedor</h2>
          <IonList lines="none">
            <IonItem>
              <IonIcon slot="start" icon={personCircleOutline} aria-hidden="true" />
              <IonLabel>
                <h3>{vendedor ? vendedor.nombreUsuario : 'Usuario de RePlay Games'}</h3>
                <p>
                  {vendedor && vendedor.totalCalificaciones > 0
                    ? `${vendedor.reputacion.toFixed(1)} de 5 · ${vendedor.totalCalificaciones} ${
                        vendedor.totalCalificaciones === 1 ? 'calificación' : 'calificaciones'
                      }`
                    : 'Sin calificaciones todavía'}
                </p>
              </IonLabel>
              {vendedor && vendedor.totalCalificaciones > 0 && (
                <IonNote slot="end">
                  <IonIcon icon={star} color="secondary" aria-hidden="true" />
                </IonNote>
              )}
            </IonItem>
          </IonList>

          {resenas.length > 0 && (
            <>
              <h2 className="titulo-seccion">Últimas reseñas del vendedor</h2>
              {resenas.slice(0, 3).map((resena) => (
                <article className="resena" key={resena.id}>
                  <div className="resena__cabecera">
                    <strong>{resena.evaluador.nombreUsuario}</strong>
                    <IonBadge color="secondary">★ {resena.puntaje}</IonBadge>
                  </div>
                  <p className="operacion__meta">
                    {resena.publicacion.titulo} · {formatearFecha(resena.fecha)}
                  </p>
                  {resena.comentario && <p className="resena__texto">{resena.comentario}</p>}
                </article>
              ))}
            </>
          )}

          <div className="detalle__acciones">
            <IonButton
              expand="block"
              disabled={!disponible || esPropia || esAdministrador || enviandoSolicitud}
              onClick={iniciarSolicitud}
            >
              {enviandoSolicitud ? <IonSpinner name="crescent" /> : 'Comprar'}
            </IonButton>
            <IonButton
              expand="block"
              fill={esFavorito ? 'solid' : 'outline'}
              color={esFavorito ? 'danger' : 'primary'}
              disabled={esAdministrador || actualizandoFavorito}
              onClick={() => void alternarFavorito()}
            >
              <IonIcon slot="start" icon={esFavorito ? heart : heartOutline} />
              {esFavorito ? 'En favoritos' : 'Favorito'}
            </IonButton>
            <IonButton
              expand="block"
              fill="clear"
              color="medium"
              disabled={esPropia || esAdministrador}
              onClick={abrirReporte}
            >
              <IonIcon slot="start" icon={flagOutline} />
              Reportar
            </IonButton>
          </div>

          {!disponible && (
            <IonText color="warning" className="detalle__aviso">
              <p className="nota">
                Esta publicación está {publicacion.estadoPublicacion} y no admite nuevas solicitudes
                de compra.
              </p>
            </IonText>
          )}

          {esPropia && (
            <IonText color="medium" className="detalle__aviso">
              <p className="nota">Esta es una de tus publicaciones, por eso no puedes comprarla ni reportarla.</p>
            </IonText>
          )}

          {esAdministrador && (
            <IonText color="medium" className="detalle__aviso">
              <p className="nota">La cuenta de administración modera desde el panel administrativo.</p>
            </IonText>
          )}
        </div>

        <ModalSolicitudCompra
          publicacion={publicacion}
          vendedor={vendedor}
          abierto={modalCompra}
          onCerrar={() => setModalCompra(false)}
          onConfirmar={(modalidad) => void confirmarSolicitud(modalidad)}
        />

        <ModalReportarPublicacion
          publicacion={publicacion}
          abierto={modalReporte}
          onCerrar={() => setModalReporte(false)}
          onEnviado={(mensaje) => setAviso(mensaje)}
        />

        <IonToast
          isOpen={confirmacion !== ''}
          message={confirmacion}
          duration={5000}
          color="success"
          onDidDismiss={() => setConfirmacion('')}
          buttons={[
            {
              text: 'Ver operaciones',
              handler: () => historial.push(RUTAS.operaciones),
            },
          ]}
        />

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

export default DetallePublicacionPage;
