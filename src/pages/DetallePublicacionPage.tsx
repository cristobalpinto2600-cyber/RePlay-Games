/**
 * Detalle de una publicación (RF-02) e inicio de la solicitud de compra (RF-06).
 *
 * Reúne la información estandarizada del documento: fotografía, título, consola, género, precio,
 * estado de conservación, descripción, ubicación, modalidades de entrega y datos públicos del
 * vendedor con su reputación.
 *
 * Comprar sin sesión iniciada lleva a /login recordando esta página, de modo que al autenticarse
 * la persona vuelve exactamente aquí (Task Flow 1 del documento).
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
  cubeOutline,
  flagOutline,
  heartOutline,
  locationOutline,
  personCircleOutline,
  star,
} from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import EncabezadoPagina from '../components/EncabezadoPagina';
import MensajeVacio from '../components/MensajeVacio';
import ModalSolicitudCompra from '../components/ModalSolicitudCompra';
import PortadaJuego from '../components/PortadaJuego';
import { useSesion } from '../context/SesionContext';
import type { ModalidadEntrega, Publicacion, Usuario } from '../models';
import { RUTAS, rutaLoginCon } from '../routes/rutas';
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
  const [cargando, setCargando] = useState(true);
  const [modalCompra, setModalCompra] = useState(false);
  const [aviso, setAviso] = useState<string>('');
  const [confirmacion, setConfirmacion] = useState<string>('');

  useEffect(() => {
    let vigente = true;
    setCargando(true);

    obtenerPublicacion(id).then(async (encontrada) => {
      if (!vigente) {
        return;
      }
      setPublicacion(encontrada ?? null);

      if (encontrada) {
        const datosVendedor = await obtenerUsuario(encontrada.vendedorId);
        if (vigente) {
          setVendedor(datosVendedor);
        }
      }
      setCargando(false);
    });

    return () => {
      vigente = false;
    };
  }, [id]);

  const iniciarSolicitud = () => {
    if (!usuario) {
      // Se guarda la ruta actual para volver al detalle después de iniciar sesión.
      historial.push(rutaLoginCon(`${ubicacion.pathname}${ubicacion.search}`));
      return;
    }
    setModalCompra(true);
  };

  const confirmarSolicitud = (modalidad: ModalidadEntrega) => {
    setModalCompra(false);
    setConfirmacion(
      `Solicitud registrada con entrega "${modalidad}". Queda como operación pendiente de confirmación del vendedor.`,
    );
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
            icono={alertCircleOutline}
            titulo="Publicación no disponible"
            descripcion="La publicación que buscas no existe o fue retirada del catálogo."
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

  return (
    <IonPage>
      <EncabezadoPagina titulo="Detalle" conVolver />

      <IonContent>
        <div className="detalle">
          <PortadaJuego
            titulo={publicacion.titulo}
            consola={publicacion.consola}
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
            </div>
          </div>

          <IonText>
            <p>{publicacion.descripcion}</p>
          </IonText>

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
                    ? `${vendedor.reputacion.toFixed(1)} de 5 · ${vendedor.totalCalificaciones} calificaciones`
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

          <div className="detalle__acciones">
            <IonButton
              expand="block"
              disabled={!disponible || esPropia}
              onClick={iniciarSolicitud}
            >
              Comprar
            </IonButton>
            <IonButton
              expand="block"
              fill="outline"
              onClick={() => setAviso('Los favoritos se incorporan en la próxima entrega (RF-05).')}
            >
              <IonIcon slot="start" icon={heartOutline} />
              Favorito
            </IonButton>
            <IonButton
              expand="block"
              fill="clear"
              color="medium"
              onClick={() => setAviso('El reporte de publicaciones se incorpora en la próxima entrega (RF-09).')}
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
              <p className="nota">Esta es una de tus publicaciones, por eso no puedes comprarla.</p>
            </IonText>
          )}
        </div>

        <ModalSolicitudCompra
          publicacion={publicacion}
          vendedor={vendedor}
          abierto={modalCompra}
          onCerrar={() => setModalCompra(false)}
          onConfirmar={confirmarSolicitud}
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
