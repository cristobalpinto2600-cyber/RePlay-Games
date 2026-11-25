/**
 * Mis publicaciones (RF-04). Ruta protegida del rol Usuario.
 *
 * Lista las publicaciones propias en cualquier estado y permite editarlas, pausarlas,
 * reactivarlas o eliminarlas. Las reglas las valida el backend: una publicación vendida no se
 * modifica y una con operaciones asociadas no se elimina (se sugiere pausarla).
 */
import {
  IonBadge,
  IonButton,
  IonContent,
  IonIcon,
  IonPage,
  IonSkeletonText,
  IonText,
  IonToast,
  useIonAlert,
  useIonViewWillEnter,
} from '@ionic/react';
import { addOutline, albumsOutline, cloudOfflineOutline } from 'ionicons/icons';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import EncabezadoPagina from '../components/EncabezadoPagina';
import MensajeVacio from '../components/MensajeVacio';
import PortadaJuego from '../components/PortadaJuego';
import type { Publicacion } from '../models';
import { RUTAS, rutaDetalle, rutaEditar } from '../routes/rutas';
import { mensajeDeError } from '../services/api';
import {
  cambiarEstadoPublicacion,
  colorEstadoPublicacion,
  eliminarPublicacion,
  listarMisPublicaciones,
} from '../services/publicacionesService';
import { formatearFecha, formatearPrecio } from '../utils/formato';

const MisPublicacionesPage: React.FC = () => {
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [aviso, setAviso] = useState('');
  const [actualizando, setActualizando] = useState<number | null>(null);
  const primeraVisita = useRef(true);
  const [presentarAlerta] = useIonAlert();

  const cargar = useCallback(async () => {
    setError('');
    try {
      setPublicaciones(await listarMisPublicaciones());
    } catch (causa) {
      setError(mensajeDeError(causa));
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  // Al volver desde "Publicar" o "Editar" la lista se actualiza.
  useIonViewWillEnter(() => {
    if (primeraVisita.current) {
      primeraVisita.current = false;
      return;
    }
    void cargar();
  });

  const ejecutar = async (publicacion: Publicacion, accion: () => Promise<unknown>, exito: string) => {
    setActualizando(publicacion.id);
    try {
      await accion();
      setAviso(exito);
      await cargar();
    } catch (causa) {
      setAviso(mensajeDeError(causa, 'No fue posible actualizar la publicación.'));
    } finally {
      setActualizando(null);
    }
  };

  const alternarPausa = (publicacion: Publicacion) => {
    const pausar = publicacion.estadoPublicacion === 'activa';
    void ejecutar(
      publicacion,
      () => cambiarEstadoPublicacion(publicacion.id, pausar ? 'pausada' : 'activa'),
      pausar ? `"${publicacion.titulo}" quedó pausada.` : `"${publicacion.titulo}" está activa nuevamente.`,
    );
  };

  /** Eliminar no se puede deshacer, por eso se pide confirmación. */
  const confirmarEliminacion = (publicacion: Publicacion) => {
    presentarAlerta({
      header: 'Eliminar publicación',
      message: `¿Seguro que deseas eliminar "${publicacion.titulo}"? Esta acción no se puede deshacer.`,
      buttons: [
        { text: 'Volver', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () =>
            void ejecutar(
              publicacion,
              () => eliminarPublicacion(publicacion.id),
              `"${publicacion.titulo}" fue eliminada.`,
            ),
        },
      ],
    });
  };

  const renderPublicacion = (publicacion: Publicacion) => {
    const vendida = publicacion.estadoPublicacion === 'vendida';
    const ocupada = actualizando === publicacion.id;

    return (
      <article className="operacion" key={publicacion.id}>
        <PortadaJuego titulo={publicacion.titulo} consola={publicacion.consola} tamano="miniatura" />

        <div className="operacion__datos">
          <h3 className="operacion__titulo">{publicacion.titulo}</h3>
          <IonBadge color={colorEstadoPublicacion(publicacion.estadoPublicacion)}>
            {publicacion.estadoPublicacion}
          </IonBadge>{' '}
          {publicacion.oculta && <IonBadge color="danger">oculta por moderación</IonBadge>}

          <p className="operacion__meta">
            {publicacion.consola} · {formatearPrecio(publicacion.precio)} · {publicacion.estadoConservacion}
          </p>
          <p className="operacion__meta">
            {publicacion.comuna} · Publicada el {formatearFecha(publicacion.fechaPublicacion)}
          </p>

          <div className="operacion__acciones">
            <IonButton size="small" fill="outline" routerLink={rutaDetalle(publicacion.id)} routerDirection="forward">
              Ver
            </IonButton>
            {!vendida && (
              <>
                <IonButton
                  size="small"
                  fill="outline"
                  routerLink={rutaEditar(publicacion.id)}
                  routerDirection="forward"
                  disabled={ocupada}
                >
                  Editar
                </IonButton>
                <IonButton size="small" color="warning" disabled={ocupada} onClick={() => alternarPausa(publicacion)}>
                  {publicacion.estadoPublicacion === 'activa' ? 'Pausar' : 'Reactivar'}
                </IonButton>
                <IonButton
                  size="small"
                  fill="clear"
                  color="danger"
                  disabled={ocupada}
                  onClick={() => confirmarEliminacion(publicacion)}
                >
                  Eliminar
                </IonButton>
              </>
            )}
            {vendida && (
              <IonText color="medium">
                <span className="nota"> Vendida: se conserva en el historial.</span>
              </IonText>
            )}
          </div>
        </div>
      </article>
    );
  };

  return (
    <IonPage>
      <EncabezadoPagina titulo="Mis publicaciones">
        <IonButton routerLink={RUTAS.publicar} routerDirection="root" aria-label="Publicar videojuego">
          <IonIcon slot="icon-only" icon={addOutline} />
        </IonButton>
      </EncabezadoPagina>

      <IonContent>
        <div className="operaciones">
          {cargando ? (
            [0, 1, 2].map((posicion) => (
              <IonSkeletonText
                key={posicion}
                animated
                style={{ height: '120px', borderRadius: '16px', marginBottom: '12px' }}
              />
            ))
          ) : error ? (
            <MensajeVacio icono={cloudOfflineOutline} titulo="No pudimos cargar tus publicaciones" descripcion={error}>
              <IonButton fill="outline" onClick={() => void cargar()}>
                Reintentar
              </IonButton>
            </MensajeVacio>
          ) : publicaciones.length === 0 ? (
            <MensajeVacio
              icono={albumsOutline}
              titulo="Aún no publicas videojuegos"
              descripcion="Cuando publiques un videojuego podrás editarlo, pausarlo o eliminarlo desde aquí."
            >
              <IonButton routerLink={RUTAS.publicar} routerDirection="root">
                Publicar videojuego
              </IonButton>
            </MensajeVacio>
          ) : (
            publicaciones.map(renderPublicacion)
          )}
        </div>

        <IonToast isOpen={aviso !== ''} message={aviso} duration={3000} onDidDismiss={() => setAviso('')} />
      </IonContent>
    </IonPage>
  );
};

export default MisPublicacionesPage;
