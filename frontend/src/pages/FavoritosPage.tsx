/**
 * Lista personal de publicaciones favoritas (RF-05). Ruta protegida del rol Usuario.
 */
import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonPage,
  IonRow,
  IonSkeletonText,
  IonToast,
  useIonViewWillEnter,
} from '@ionic/react';
import { cloudOfflineOutline, heartOutline, trashOutline } from 'ionicons/icons';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import EncabezadoPagina from '../components/EncabezadoPagina';
import MensajeVacio from '../components/MensajeVacio';
import TarjetaPublicacion from '../components/TarjetaPublicacion';
import type { Publicacion } from '../models';
import { RUTAS } from '../routes/rutas';
import { mensajeDeError } from '../services/api';
import { listarFavoritos, quitarFavorito } from '../services/favoritosService';

const FavoritosPage: React.FC = () => {
  const [favoritos, setFavoritos] = useState<Publicacion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [aviso, setAviso] = useState('');
  const [quitando, setQuitando] = useState<number | null>(null);
  const primeraVisita = useRef(true);

  const cargar = useCallback(async () => {
    setError('');
    try {
      setFavoritos(await listarFavoritos());
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

  const quitar = async (publicacion: Publicacion) => {
    setQuitando(publicacion.id);
    try {
      await quitarFavorito(publicacion.id);
      setFavoritos((actuales) => actuales.filter((item) => item.id !== publicacion.id));
      setAviso(`"${publicacion.titulo}" se quitó de tus favoritos.`);
    } catch (causa) {
      setAviso(mensajeDeError(causa, 'No fue posible quitar la publicación de favoritos.'));
    } finally {
      setQuitando(null);
    }
  };

  return (
    <IonPage>
      <EncabezadoPagina titulo="Favoritos" />

      <IonContent>
        <div className="contenedor">
          {cargando ? (
            <IonGrid className="ion-no-padding">
              <IonRow>
                {[0, 1, 2].map((posicion) => (
                  <IonCol key={posicion} size="12" sizeSm="6" sizeLg="4">
                    <IonSkeletonText animated style={{ height: '220px', borderRadius: '16px' }} />
                  </IonCol>
                ))}
              </IonRow>
            </IonGrid>
          ) : error ? (
            <MensajeVacio
              icono={cloudOfflineOutline}
              titulo="No pudimos cargar tus favoritos"
              descripcion={error}
            >
              <IonButton fill="outline" onClick={() => void cargar()}>
                Reintentar
              </IonButton>
            </MensajeVacio>
          ) : favoritos.length === 0 ? (
            <MensajeVacio
              icono={heartOutline}
              titulo="Sin favoritos guardados"
              descripcion="Guarda videojuegos desde el detalle de cualquier publicación para compararlos más tarde."
            >
              <IonButton routerLink={RUTAS.catalogo} routerDirection="root">
                Explorar catálogo
              </IonButton>
            </MensajeVacio>
          ) : (
            <IonGrid className="ion-no-padding">
              <IonRow>
                {favoritos.map((publicacion) => (
                  <IonCol key={publicacion.id} size="12" sizeSm="6" sizeLg="4" className="favorito-col">
                    <TarjetaPublicacion publicacion={publicacion} />
                    <IonButton
                      size="small"
                      fill="clear"
                      color="danger"
                      disabled={quitando === publicacion.id}
                      onClick={() => void quitar(publicacion)}
                    >
                      <IonIcon slot="start" icon={trashOutline} aria-hidden="true" />
                      Quitar de favoritos
                    </IonButton>
                  </IonCol>
                ))}
              </IonRow>
            </IonGrid>
          )}
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

export default FavoritosPage;
