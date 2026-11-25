/**
 * Moderación administrativa de publicaciones (RF-10). Ruta protegida de Administrador.
 */
import {
  IonBadge,
  IonButton,
  IonContent,
  IonLabel,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonSkeletonText,
  IonToast,
  useIonAlert,
  useIonViewWillEnter,
} from '@ionic/react';
import { cloudOfflineOutline, shieldCheckmarkOutline } from 'ionicons/icons';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import EncabezadoPagina from '../components/EncabezadoPagina';
import MensajeVacio from '../components/MensajeVacio';
import PortadaJuego from '../components/PortadaJuego';
import type { PublicacionAdmin } from '../models';
import { rutaDetalle } from '../routes/rutas';
import { mensajeDeError } from '../services/api';
import {
  colorEstadoPublicacion,
  listarPublicacionesAdmin,
  moderarPublicacion,
} from '../services/publicacionesService';
import { formatearPrecio } from '../utils/formato';

type FiltroAdmin = 'todas' | 'reportadas' | 'ocultas';

const AdminPublicacionesPage: React.FC = () => {
  const [filtro, setFiltro] = useState<FiltroAdmin>('todas');
  const [publicaciones, setPublicaciones] = useState<PublicacionAdmin[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [aviso, setAviso] = useState('');
  const [actualizando, setActualizando] = useState<number | null>(null);
  const primeraVisita = useRef(true);
  const [presentarAlerta] = useIonAlert();

  const cargar = useCallback(async () => {
    setError('');
    try {
      setPublicaciones(await listarPublicacionesAdmin());
    } catch (causa) {
      setError(mensajeDeError(causa));
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  useIonViewWillEnter(() => {
    if (primeraVisita.current) {
      primeraVisita.current = false;
      return;
    }
    void cargar();
  });

  const cambiarVisibilidad = async (publicacion: PublicacionAdmin, oculta: boolean) => {
    setActualizando(publicacion.id);
    try {
      await moderarPublicacion(publicacion.id, oculta);
      setPublicaciones((actuales) =>
        actuales.map((item) => (item.id === publicacion.id ? { ...item, oculta } : item)),
      );
      setAviso(
        oculta
          ? `"${publicacion.titulo}" quedó oculta del catálogo.`
          : `"${publicacion.titulo}" volvió a estar visible.`,
      );
    } catch (causa) {
      setAviso(mensajeDeError(causa, 'No fue posible moderar la publicación.'));
    } finally {
      setActualizando(null);
    }
  };

  const confirmar = (publicacion: PublicacionAdmin) => {
    const ocultar = !publicacion.oculta;
    presentarAlerta({
      header: ocultar ? 'Ocultar publicación' : 'Restaurar publicación',
      message: ocultar
        ? `¿Deseas ocultar "${publicacion.titulo}" del catálogo público? Se notificará a ${publicacion.vendedorNombre}.`
        : `¿Deseas restaurar la visibilidad de "${publicacion.titulo}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: ocultar ? 'Ocultar' : 'Restaurar',
          handler: () => void cambiarVisibilidad(publicacion, ocultar),
        },
      ],
    });
  };

  const visibles = publicaciones.filter((item) => {
    if (filtro === 'reportadas') return item.reportesPendientes > 0;
    if (filtro === 'ocultas') return Boolean(item.oculta);
    return true;
  });

  return (
    <IonPage>
      <EncabezadoPagina titulo="Moderación de publicaciones" />

      <IonContent>
        <div className="operaciones">
          <IonSegment
            value={filtro}
            onIonChange={(evento) => setFiltro(evento.detail.value as FiltroAdmin)}
          >
            <IonSegmentButton value="todas">
              <IonLabel>Todas ({publicaciones.length})</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="reportadas">
              <IonLabel>
                Reportadas ({publicaciones.filter((p) => p.reportesPendientes > 0).length})
              </IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="ocultas">
              <IonLabel>Ocultas ({publicaciones.filter((p) => p.oculta).length})</IonLabel>
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
            ) : error ? (
              <MensajeVacio
                icono={cloudOfflineOutline}
                titulo="No pudimos cargar las publicaciones"
                descripcion={error}
              >
                <IonButton fill="outline" onClick={() => void cargar()}>
                  Reintentar
                </IonButton>
              </MensajeVacio>
            ) : visibles.length === 0 ? (
              <MensajeVacio
                icono={shieldCheckmarkOutline}
                titulo="Sin publicaciones en esta vista"
                descripcion="No hay publicaciones que coincidan con el filtro seleccionado."
              />
            ) : (
              visibles.map((publicacion) => (
                <article className="operacion" key={publicacion.id}>
                  <PortadaJuego
                    titulo={publicacion.titulo}
                    consola={publicacion.consola}
                    tamano="miniatura"
                  />

                  <div className="operacion__datos">
                    <h3 className="operacion__titulo">{publicacion.titulo}</h3>
                    <IonBadge color={colorEstadoPublicacion(publicacion.estadoPublicacion)}>
                      {publicacion.estadoPublicacion}
                    </IonBadge>{' '}
                    {publicacion.oculta && <IonBadge color="danger">Oculta</IonBadge>}{' '}
                    {publicacion.reportesPendientes > 0 && (
                      <IonBadge color="warning">
                        {publicacion.reportesPendientes}{' '}
                        {publicacion.reportesPendientes === 1 ? 'reporte' : 'reportes'}
                      </IonBadge>
                    )}

                    <p className="operacion__meta">
                      {publicacion.consola} · {formatearPrecio(publicacion.precio)} · Vendedor:{' '}
                      {publicacion.vendedorNombre}
                    </p>

                    <div className="operacion__acciones">
                      <IonButton
                        size="small"
                        fill="outline"
                        routerLink={rutaDetalle(publicacion.id)}
                        routerDirection="forward"
                      >
                        Ver detalle
                      </IonButton>
                      <IonButton
                        size="small"
                        color={publicacion.oculta ? 'success' : 'danger'}
                        fill={publicacion.oculta ? 'solid' : 'outline'}
                        disabled={actualizando === publicacion.id}
                        onClick={() => confirmar(publicacion)}
                      >
                        {publicacion.oculta ? 'Restaurar' : 'Ocultar'}
                      </IonButton>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>

        <IonToast
          isOpen={aviso !== ''}
          message={aviso}
          duration={3000}
          onDidDismiss={() => setAviso('')}
        />
      </IonContent>
    </IonPage>
  );
};

export default AdminPublicacionesPage;
