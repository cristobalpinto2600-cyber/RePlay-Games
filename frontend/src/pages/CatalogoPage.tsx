/**
 * Catálogo / inicio (RF-01, EF1, EF2, EF4).
 *
 * Incluye:
 *  - Persistencia de filtros y búsquedas recientes en almacenamiento local (EF1).
 *  - Ordenamiento (recientes, menor precio, mayor precio), paginación progresiva y
 *    pull-to-refresh con IonRefresher (EF2, EF4).
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
  IonRefresher,
  IonRefresherContent,
  IonRow,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonSkeletonText,
  type RefresherEventDetail,
  useIonViewWillEnter,
} from '@ionic/react';
import {
  closeCircle,
  cloudOfflineOutline,
  filterOutline,
  searchOutline,
  timeOutline,
} from 'ionicons/icons';
import React, { useEffect, useRef, useState } from 'react';
import EncabezadoPagina from '../components/EncabezadoPagina';
import MensajeVacio from '../components/MensajeVacio';
import PanelFiltros from '../components/PanelFiltros';
import TarjetaPublicacion from '../components/TarjetaPublicacion';
import { PRECIO_MAXIMO } from '../data/catalogos';
import type { FiltrosCatalogo, Publicacion } from '../models';
import {
  agregarBusquedaReciente,
  borrarFiltros,
  guardarFiltros,
  leerBusquedasRecientes,
  leerFiltros,
  limpiarBusquedasRecientes,
} from '../services/almacenamiento';
import { mensajeDeError } from '../services/api';
import {
  FILTROS_INICIALES,
  type OrdenCatalogo,
  contarFiltrosActivos,
  listarPublicacionesPaginadas,
} from '../services/publicacionesService';
import { formatearPrecio } from '../utils/formato';

const TAMANO_PAGINA = 8;

function cargarFiltrosGuardados(): FiltrosCatalogo {
  const guardados = leerFiltros();
  if (!guardados) return FILTROS_INICIALES;
  return {
    texto: typeof guardados.texto === 'string' ? guardados.texto : '',
    consola: typeof guardados.consola === 'string' ? guardados.consola : '',
    genero: typeof guardados.genero === 'string' ? guardados.genero : '',
    estadoConservacion:
      typeof guardados.estadoConservacion === 'string' ? guardados.estadoConservacion : '',
    comuna: typeof guardados.comuna === 'string' ? guardados.comuna : '',
    precioMaximo:
      typeof guardados.precioMaximo === 'number' && guardados.precioMaximo >= 5000
        ? Math.min(guardados.precioMaximo, PRECIO_MAXIMO)
        : PRECIO_MAXIMO,
  };
}

const CatalogoPage: React.FC = () => {
  const [filtros, setFiltros] = useState<FiltrosCatalogo>(cargarFiltrosGuardados);
  const [orden, setOrden] = useState<OrdenCatalogo>('recientes');
  const [pagina, setPagina] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [busquedasRecientes, setBusquedasRecientes] = useState<string[]>(leerBusquedasRecientes);
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [cargandoMas, setCargandoMas] = useState(false);
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);
  const [error, setError] = useState('');
  const [recarga, setRecarga] = useState(0);
  const primeraVisita = useRef(true);

  useIonViewWillEnter(() => {
    if (primeraVisita.current) {
      primeraVisita.current = false;
      return;
    }
    setPagina(1);
    setRecarga((valor) => valor + 1);
  });

  useEffect(() => {
    guardarFiltros(filtros);
  }, [filtros]);

  const actualizarFiltros = (nuevos: FiltrosCatalogo) => {
    setPagina(1);
    setFiltros(nuevos);
  };

  useEffect(() => {
    let vigente = true;
    const esPrimeraPagina = pagina === 1;
    if (esPrimeraPagina) {
      setCargando(true);
    } else {
      setCargandoMas(true);
    }
    setError('');

    listarPublicacionesPaginadas(filtros, { page: pagina, limit: TAMANO_PAGINA, orden })
      .then((resultado) => {
        if (!vigente) return;
        setTotal(resultado.total);
        setTotalPages(resultado.totalPages);
        setPublicaciones((actuales) =>
          esPrimeraPagina ? resultado.items : [...actuales, ...resultado.items],
        );
      })
      .catch((causa) => {
        if (vigente) {
          if (esPrimeraPagina) {
            setPublicaciones([]);
          }
          setError(mensajeDeError(causa));
        }
      })
      .finally(() => {
        if (vigente) {
          setCargando(false);
          setCargandoMas(false);
        }
      });

    return () => {
      vigente = false;
    };
  }, [filtros, orden, pagina, recarga]);

  const limpiarFiltros = () => {
    borrarFiltros();
    setPagina(1);
    setFiltros(FILTROS_INICIALES);
  };

  const registrarBusqueda = (valor: string) => {
    if (valor.trim().length >= 3) {
      setBusquedasRecientes(agregarBusquedaReciente(valor));
    }
  };

  const refrescar = async (evento: CustomEvent<RefresherEventDetail>) => {
    try {
      const resultado = await listarPublicacionesPaginadas(filtros, {
        page: 1,
        limit: TAMANO_PAGINA,
        orden,
      });
      setPagina(1);
      setTotal(resultado.total);
      setTotalPages(resultado.totalPages);
      setPublicaciones(resultado.items);
      setError('');
    } catch (causa) {
      setError(mensajeDeError(causa));
    } finally {
      evento.detail.complete();
    }
  };

  const filtrosActivos = contarFiltrosActivos(filtros);
  const restantes = Math.max(0, total - publicaciones.length);

  const buscador = (
    <IonSearchbar
      value={filtros.texto}
      placeholder="Buscar por título, consola o género"
      debounce={250}
      onIonInput={(evento) => actualizarFiltros({ ...filtros, texto: evento.detail.value ?? '' })}
      onIonChange={(evento) => registrarBusqueda(evento.detail.value ?? '')}
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
        <IonRefresher slot="fixed" onIonRefresh={(evento) => void refrescar(evento)}>
          <IonRefresherContent pullingText="Desliza para actualizar" refreshingText="Actualizando catálogo…" />
        </IonRefresher>

        <div className="catalogo">
          <aside className="catalogo__filtros ion-hide-md-down">
            <PanelFiltros filtros={filtros} onCambiar={actualizarFiltros} onLimpiar={limpiarFiltros} />
          </aside>

          <section className="catalogo__resultados">
            {busquedasRecientes.length > 0 && (
              <div className="busquedas-recientes">
                <span className="busquedas-recientes__etiqueta">
                  <IonIcon icon={timeOutline} aria-hidden="true" /> Recientes:
                </span>
                {busquedasRecientes.map((termino) => (
                  <IonChip
                    key={termino}
                    outline
                    onClick={() => actualizarFiltros({ ...filtros, texto: termino })}
                  >
                    {termino}
                  </IonChip>
                ))}
                <IonButton
                  size="small"
                  fill="clear"
                  color="medium"
                  onClick={() => {
                    limpiarBusquedasRecientes();
                    setBusquedasRecientes([]);
                  }}
                >
                  Limpiar
                </IonButton>
              </div>
            )}

            <div className="catalogo__barra">
              <span className="catalogo__resumen">
                {cargando
                  ? 'Buscando publicaciones…'
                  : error
                  ? 'Sin conexión con el servidor'
                  : `${total} ${total === 1 ? 'publicación encontrada' : 'publicaciones encontradas'}`}
              </span>

              <div className="catalogo__controles">
                <IonSelect
                  aria-label="Ordenar publicaciones"
                  interface="popover"
                  value={orden}
                  onIonChange={(evento) => {
                    setPagina(1);
                    setOrden(evento.detail.value as OrdenCatalogo);
                  }}
                >
                  <IonSelectOption value="recientes">Más recientes</IonSelectOption>
                  <IonSelectOption value="precio_asc">Menor precio</IonSelectOption>
                  <IonSelectOption value="precio_desc">Mayor precio</IonSelectOption>
                </IonSelect>

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
            </div>

            {filtrosActivos > 0 && (
              <div className="catalogo__chips">
                {filtros.consola && (
                  <IonChip onClick={() => actualizarFiltros({ ...filtros, consola: '' })}>
                    {filtros.consola}
                    <IonIcon icon={closeCircle} aria-hidden="true" />
                  </IonChip>
                )}
                {filtros.genero && (
                  <IonChip onClick={() => actualizarFiltros({ ...filtros, genero: '' })}>
                    {filtros.genero}
                    <IonIcon icon={closeCircle} aria-hidden="true" />
                  </IonChip>
                )}
                {filtros.estadoConservacion && (
                  <IonChip
                    onClick={() => actualizarFiltros({ ...filtros, estadoConservacion: '' })}
                  >
                    {filtros.estadoConservacion}
                    <IonIcon icon={closeCircle} aria-hidden="true" />
                  </IonChip>
                )}
                {filtros.comuna && (
                  <IonChip onClick={() => actualizarFiltros({ ...filtros, comuna: '' })}>
                    {filtros.comuna}
                    <IonIcon icon={closeCircle} aria-hidden="true" />
                  </IonChip>
                )}
                {filtros.precioMaximo < PRECIO_MAXIMO && (
                  <IonChip
                    onClick={() => actualizarFiltros({ ...filtros, precioMaximo: PRECIO_MAXIMO })}
                  >
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
            ) : error ? (
              <MensajeVacio icono={cloudOfflineOutline} titulo="No pudimos cargar el catálogo" descripcion={error}>
                <IonButton fill="outline" onClick={() => setRecarga((valor) => valor + 1)}>
                  Reintentar
                </IonButton>
              </MensajeVacio>
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
              <>
                <IonGrid className="ion-no-padding">
                  <IonRow>
                    {publicaciones.map((publicacion) => (
                      <IonCol key={publicacion.id} size="12" sizeSm="6" sizeLg="4" sizeXl="3">
                        <TarjetaPublicacion publicacion={publicacion} />
                      </IonCol>
                    ))}
                  </IonRow>
                </IonGrid>

                {pagina < totalPages && (
                  <div className="catalogo__paginacion">
                    <IonButton
                      fill="outline"
                      disabled={cargandoMas}
                      onClick={() => setPagina((actual) => actual + 1)}
                    >
                      {cargandoMas
                        ? 'Cargando…'
                        : `Cargar más publicaciones (${restantes} restantes)`}
                    </IonButton>
                  </div>
                )}
              </>
            )}
          </section>
        </div>

        <IonModal
          isOpen={filtrosAbiertos}
          onDidDismiss={() => setFiltrosAbiertos(false)}
          initialBreakpoint={0.9}
          breakpoints={[0, 0.9]}
        >
          <PanelFiltros
            filtros={filtros}
            onCambiar={actualizarFiltros}
            onLimpiar={limpiarFiltros}
            onCerrar={() => setFiltrosAbiertos(false)}
          />
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default CatalogoPage;
