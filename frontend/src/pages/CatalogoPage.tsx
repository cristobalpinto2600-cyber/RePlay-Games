/**
 * Catálogo / inicio (RF-01).
 *
 * Permite explorar las publicaciones disponibles, buscar por texto y filtrar por consola,
 * género, estado de conservación, comuna y precio. La misma información se muestra en una
 * grilla que cambia de columnas según el ancho disponible (RNF-UX-01):
 *  - escritorio: panel de filtros fijo a la izquierda;
 *  - móvil: los mismos filtros dentro de un modal.
 */
import {
  IonButton,
  IonChip,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonModal,
  IonPage,
  IonRow,
  IonSearchbar,
  IonSkeletonText,
} from '@ionic/react';
import { closeCircle, filterOutline, searchOutline } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import EncabezadoPagina from '../components/EncabezadoPagina';
import MensajeVacio from '../components/MensajeVacio';
import PanelFiltros from '../components/PanelFiltros';
import TarjetaPublicacion from '../components/TarjetaPublicacion';
import { PRECIO_MAXIMO } from '../data/catalogos';
import type { FiltrosCatalogo, Publicacion } from '../models';
import {
  FILTROS_INICIALES,
  contarFiltrosActivos,
  listarPublicaciones,
} from '../services/publicacionesService';
import { formatearPrecio } from '../utils/formato';

const CatalogoPage: React.FC = () => {
  const [filtros, setFiltros] = useState<FiltrosCatalogo>(FILTROS_INICIALES);
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);

  // Cada cambio de filtro vuelve a consultar el servicio, igual que ocurrirá con la API en EP2.
  useEffect(() => {
    let vigente = true;
    setCargando(true);

    listarPublicaciones(filtros).then((resultado) => {
      if (vigente) {
        setPublicaciones(resultado);
        setCargando(false);
      }
    });

    return () => {
      vigente = false;
    };
  }, [filtros]);

  const limpiarFiltros = () => setFiltros(FILTROS_INICIALES);
  const filtrosActivos = contarFiltrosActivos(filtros);

  const buscador = (
    <IonSearchbar
      value={filtros.texto}
      placeholder="Buscar por título, consola o género"
      debounce={250}
      onIonInput={(evento) => setFiltros({ ...filtros, texto: evento.detail.value ?? '' })}
    />
  );

  return (
    <IonPage>
      <EncabezadoPagina titulo="Catálogo" barraInferior={buscador}>
        <IonButton
          className="ion-hide-lg-up"
          onClick={() => setFiltrosAbiertos(true)}
          aria-label="Abrir filtros"
        >
          <IonIcon slot="icon-only" icon={filterOutline} />
        </IonButton>
      </EncabezadoPagina>

      <IonContent>
        <div className="catalogo">
          <aside className="catalogo__filtros ion-hide-md-down">
            <PanelFiltros filtros={filtros} onCambiar={setFiltros} onLimpiar={limpiarFiltros} />
          </aside>

          <section className="catalogo__resultados">
            <div className="catalogo__barra">
              <span className="catalogo__resumen">
                {cargando
                  ? 'Buscando publicaciones…'
                  : `${publicaciones.length} ${
                      publicaciones.length === 1 ? 'publicación encontrada' : 'publicaciones encontradas'
                    }`}
              </span>

              <IonButton
                size="small"
                fill="outline"
                className="ion-hide-lg-up"
                onClick={() => setFiltrosAbiertos(true)}
              >
                <IonIcon slot="start" icon={filterOutline} />
                Filtros{filtrosActivos > 0 ? ` (${filtrosActivos})` : ''}
              </IonButton>
            </div>

            {filtrosActivos > 0 && (
              <div className="catalogo__chips">
                {filtros.consola && (
                  <IonChip onClick={() => setFiltros({ ...filtros, consola: '' })}>
                    {filtros.consola}
                    <IonIcon icon={closeCircle} aria-hidden="true" />
                  </IonChip>
                )}
                {filtros.genero && (
                  <IonChip onClick={() => setFiltros({ ...filtros, genero: '' })}>
                    {filtros.genero}
                    <IonIcon icon={closeCircle} aria-hidden="true" />
                  </IonChip>
                )}
                {filtros.estadoConservacion && (
                  <IonChip onClick={() => setFiltros({ ...filtros, estadoConservacion: '' })}>
                    {filtros.estadoConservacion}
                    <IonIcon icon={closeCircle} aria-hidden="true" />
                  </IonChip>
                )}
                {filtros.comuna && (
                  <IonChip onClick={() => setFiltros({ ...filtros, comuna: '' })}>
                    {filtros.comuna}
                    <IonIcon icon={closeCircle} aria-hidden="true" />
                  </IonChip>
                )}
                {filtros.precioMaximo < PRECIO_MAXIMO && (
                  <IonChip onClick={() => setFiltros({ ...filtros, precioMaximo: PRECIO_MAXIMO })}>
                    {`Hasta ${formatearPrecio(filtros.precioMaximo)}`}
                    <IonIcon icon={closeCircle} aria-hidden="true" />
                  </IonChip>
                )}
              </div>
            )}

            {cargando ? (
              <IonGrid className="ion-no-padding">
                <IonRow>
                  {[0, 1, 2, 3].map((posicion) => (
                    <IonCol key={posicion} size="12" sizeSm="6" sizeLg="4" sizeXl="3">
                      <IonSkeletonText animated style={{ height: '210px', borderRadius: '16px' }} />
                    </IonCol>
                  ))}
                </IonRow>
              </IonGrid>
            ) : publicaciones.length === 0 ? (
              <MensajeVacio
                icono={searchOutline}
                titulo="Sin resultados"
                descripcion="No encontramos publicaciones con esos criterios. Prueba ampliando el precio o quitando filtros."
              >
                <IonButton fill="outline" onClick={limpiarFiltros}>
                  Limpiar filtros
                </IonButton>
              </MensajeVacio>
            ) : (
              <IonGrid className="ion-no-padding">
                <IonRow>
                  {publicaciones.map((publicacion) => (
                    <IonCol key={publicacion.id} size="12" sizeSm="6" sizeLg="4" sizeXl="3">
                      <TarjetaPublicacion publicacion={publicacion} />
                    </IonCol>
                  ))}
                </IonRow>
              </IonGrid>
            )}
          </section>
        </div>

        {/* En móvil los filtros se abren como hoja inferior, manteniendo los mismos controles. */}
        <IonModal
          isOpen={filtrosAbiertos}
          onDidDismiss={() => setFiltrosAbiertos(false)}
          initialBreakpoint={0.9}
          breakpoints={[0, 0.9]}
        >
          <PanelFiltros
            filtros={filtros}
            onCambiar={setFiltros}
            onLimpiar={limpiarFiltros}
            onCerrar={() => setFiltrosAbiertos(false)}
          />
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default CatalogoPage;
