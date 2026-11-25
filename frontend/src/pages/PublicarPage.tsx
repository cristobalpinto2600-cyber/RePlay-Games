/**
 * Publicar videojuego (RF-03) y editar una publicación propia (RF-04). Ruta protegida.
 *
 * Integra:
 *  - Carga dinámica de catálogos desde GET /api/catalogos (EF2).
 *  - Autocompletado de título, género e imagen mediante la API externa RAWG (EF5).
 *  - Fotografía real mediante URL HTTPS con vista previa inmediata y fallback visual.
 *  - Guardado automático de borrador en almacenamiento local (EF1).
 */
import {
  IonAlert,
  IonBadge,
  IonButton,
  IonCheckbox,
  IonContent,
  IonIcon,
  IonInput,
  IonNote,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonText,
  IonTextarea,
  IonToggle,
  useIonRouter,
} from '@ionic/react';
import { alertCircleOutline, searchOutline, sparklesOutline } from 'ionicons/icons';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import EncabezadoPagina from '../components/EncabezadoPagina';
import MensajeVacio from '../components/MensajeVacio';
import PortadaJuego from '../components/PortadaJuego';
import { useSesion } from '../context/SesionContext';
import type { DatosPublicacion, EstadoConservacion, ModalidadEntrega } from '../models';
import { RUTAS } from '../routes/rutas';
import {
  borrarBorradorPublicacion,
  guardarBorradorPublicacion,
  leerBorradorPublicacion,
} from '../services/almacenamiento';
import { erroresPorCampo, mensajeDeError } from '../services/api';
import { CATALOGOS_RESPALDO, type CatalogosSistema, obtenerCatalogos } from '../services/catalogosService';
import { type JuegoExterno, buscarJuegosExternos } from '../services/juegosExternosService';
import {
  actualizarPublicacion,
  crearPublicacion,
  obtenerPublicacion,
} from '../services/publicacionesService';

interface ErroresPublicacion {
  titulo?: string;
  consola?: string;
  genero?: string;
  estadoConservacion?: string;
  precio?: string;
  descripcion?: string;
  imagenUrl?: string;
  region?: string;
  comuna?: string;
  entregas?: string;
}

/** Traduce géneros comunes de RAWG a los géneros estandarizados del marketplace. */
function mapearGeneroRawg(generosRawg: string[], disponibles: string[]): string {
  const normalizados = generosRawg.map((g) => g.toLowerCase());
  const reglas: Array<[RegExp, string]> = [
    [/action|adventure|shooter|fighting/, 'Acción / Aventura'],
    [/rpg|role/, 'RPG'],
    [/sport/, 'Deportes'],
    [/racing/, 'Carreras'],
    [/platform/, 'Plataformas'],
    [/strategy|simulation/, 'Estrategia'],
    [/horror|terror/, 'Terror'],
  ];
  for (const [patron, destino] of reglas) {
    if (normalizados.some((g) => patron.test(g)) && disponibles.includes(destino)) {
      return destino;
    }
  }
  return '';
}

const PublicarPage: React.FC = () => {
  const router = useIonRouter();
  const { usuario } = useSesion();
  const { id } = useParams<{ id?: string }>();
  const editando = Boolean(id);

  const [catalogos, setCatalogos] = useState<CatalogosSistema>(CATALOGOS_RESPALDO);

  const [titulo, setTitulo] = useState('');
  const [consola, setConsola] = useState('');
  const [genero, setGenero] = useState('');
  const [estadoConservacion, setEstadoConservacion] = useState('');
  const [precio, setPrecio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagenUrl, setImagenUrl] = useState('');
  const [region, setRegion] = useState('');
  const [comuna, setComuna] = useState('');
  const [entregas, setEntregas] = useState<ModalidadEntrega[]>([]);
  const [incluyeCaja, setIncluyeCaja] = useState(true);
  const [incluyeManual, setIncluyeManual] = useState(false);

  const [buscandoRawg, setBuscandoRawg] = useState(false);
  const [sugerenciasRawg, setSugerenciasRawg] = useState<JuegoExterno[]>([]);
  const [avisoRawg, setAvisoRawg] = useState('');

  const [errores, setErrores] = useState<ErroresPublicacion>({});
  const [confirmando, setConfirmando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [publicado, setPublicado] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState('');
  const [cargandoEdicion, setCargandoEdicion] = useState(editando);
  const [errorEdicion, setErrorEdicion] = useState('');
  const [borradorRestaurado, setBorradorRestaurado] = useState(false);
  const borradorCargado = useRef(false);

  useEffect(() => {
    let vigente = true;
    obtenerCatalogos().then((datos) => {
      if (vigente) setCatalogos(datos);
    });
    return () => {
      vigente = false;
    };
  }, []);

  /** Deja el formulario vacío, listo para una nueva publicación. */
  const limpiar = () => {
    setTitulo('');
    setConsola('');
    setGenero('');
    setEstadoConservacion('');
    setPrecio('');
    setDescripcion('');
    setImagenUrl('');
    setRegion('');
    setComuna('');
    setEntregas([]);
    setIncluyeCaja(true);
    setIncluyeManual(false);
    setSugerenciasRawg([]);
    setAvisoRawg('');
    setErrores({});
    setErrorGeneral('');
    setBorradorRestaurado(false);
    borrarBorradorPublicacion();
  };

  // En modo creación recupera un borrador guardado localmente (EF1).
  useEffect(() => {
    if (editando) return;
    const borrador = leerBorradorPublicacion();
    borradorCargado.current = true;
    if (!borrador) return;
    const tieneContenido =
      borrador.titulo ||
      borrador.consola ||
      borrador.genero ||
      borrador.precio ||
      borrador.descripcion ||
      borrador.imagenUrl;
    if (!tieneContenido) return;
    setTitulo(borrador.titulo ?? '');
    setConsola(borrador.consola ?? '');
    setGenero(borrador.genero ?? '');
    setEstadoConservacion(borrador.estadoConservacion ?? '');
    setPrecio(borrador.precio ?? '');
    setDescripcion(borrador.descripcion ?? '');
    setImagenUrl(borrador.imagenUrl ?? '');
    setRegion(borrador.region ?? '');
    setComuna(borrador.comuna ?? '');
    setEntregas(Array.isArray(borrador.entregas) ? borrador.entregas : []);
    setIncluyeCaja(borrador.incluyeCaja ?? true);
    setIncluyeManual(borrador.incluyeManual ?? false);
    setBorradorRestaurado(true);
  }, [editando]);

  // Guarda automáticamente el borrador mientras se escribe en modo creación.
  useEffect(() => {
    if (editando || !borradorCargado.current) return;
    const hayDatos =
      titulo.trim() ||
      consola ||
      genero ||
      precio.trim() ||
      descripcion.trim() ||
      imagenUrl.trim() ||
      entregas.length > 0;
    if (!hayDatos) {
      borrarBorradorPublicacion();
      return;
    }
    guardarBorradorPublicacion({
      titulo,
      consola,
      genero,
      estadoConservacion: estadoConservacion as EstadoConservacion | '',
      precio,
      descripcion,
      imagenUrl,
      region,
      comuna,
      entregas,
      incluyeCaja,
      incluyeManual,
    });
  }, [
    editando,
    titulo,
    consola,
    genero,
    estadoConservacion,
    precio,
    descripcion,
    imagenUrl,
    region,
    comuna,
    entregas,
    incluyeCaja,
    incluyeManual,
  ]);

  // En modo edición se precargan los datos de la publicación propia.
  useEffect(() => {
    if (!id) {
      return undefined;
    }
    let vigente = true;
    setCargandoEdicion(true);
    setErrorEdicion('');

    obtenerPublicacion(id)
      .then((publicacion) => {
        if (!vigente) return;
        if (!publicacion || publicacion.vendedorId !== usuario?.id) {
          setErrorEdicion('La publicación no existe o no te pertenece.');
          return;
        }
        if (publicacion.estadoPublicacion === 'vendida') {
          setErrorEdicion('Esta publicación ya fue vendida y no se puede editar.');
          return;
        }
        setTitulo(publicacion.titulo);
        setConsola(publicacion.consola);
        setGenero(publicacion.genero);
        setEstadoConservacion(publicacion.estadoConservacion);
        setPrecio(String(publicacion.precio));
        setDescripcion(publicacion.descripcion);
        setImagenUrl(publicacion.imagenUrl ?? '');
        setRegion(publicacion.region);
        setComuna(publicacion.comuna);
        setEntregas(publicacion.entregas);
        setIncluyeCaja(publicacion.incluyeCaja);
        setIncluyeManual(publicacion.incluyeManual);
        setErrores({});
      })
      .catch((causa) => {
        if (vigente) {
          setErrorEdicion(mensajeDeError(causa));
        }
      })
      .finally(() => {
        if (vigente) {
          setCargandoEdicion(false);
        }
      });

    return () => {
      vigente = false;
    };
  }, [id, usuario?.id]);

  const comunasDisponibles =
    catalogos.regiones.find((item) => item.nombre === region)?.comunas ?? [];

  const alternarEntrega = (modalidad: ModalidadEntrega, seleccionada: boolean) => {
    setEntregas((actuales) =>
      seleccionada
        ? [...actuales, modalidad]
        : actuales.filter((existente) => existente !== modalidad),
    );
  };

  const buscarEnRawg = async () => {
    const consulta = titulo.trim();
    if (consulta.length < 2) {
      setAvisoRawg('Escribe al menos 2 caracteres en el título para buscar en RAWG.');
      return;
    }
    setBuscandoRawg(true);
    setAvisoRawg('');
    setSugerenciasRawg([]);
    try {
      const resp = await buscarJuegosExternos(consulta);
      if (!resp.disponible) {
        setAvisoRawg(resp.mensaje || 'RAWG no está disponible en este momento.');
        return;
      }
      if (resp.resultados.length === 0) {
        setAvisoRawg('No se encontraron coincidencias en RAWG. Puedes completar los campos manualmente.');
        return;
      }
      setSugerenciasRawg(resp.resultados);
    } catch (error) {
      setAvisoRawg(mensajeDeError(error, 'No fue posible consultar RAWG.'));
    } finally {
      setBuscandoRawg(false);
    }
  };

  const aplicarSugerenciaRawg = (juego: JuegoExterno) => {
    setTitulo(juego.titulo.slice(0, 120));
    if (juego.imagenUrl) {
      setImagenUrl(juego.imagenUrl);
    }
    const generoSugerido = mapearGeneroRawg(juego.generos, catalogos.generos);
    if (generoSugerido) {
      setGenero(generoSugerido);
    }
    setSugerenciasRawg([]);
    setAvisoRawg(`Datos completados desde RAWG para "${juego.titulo}".`);
  };

  const validar = (): boolean => {
    const encontrados: ErroresPublicacion = {};
    const valorPrecio = Number(precio);
    const urlLimpia = imagenUrl.trim();

    if (titulo.trim().length < 3) {
      encontrados.titulo = 'Indica el título del videojuego.';
    }
    if (!consola) {
      encontrados.consola = 'Selecciona la consola compatible.';
    }
    if (!genero) {
      encontrados.genero = 'Selecciona el género.';
    }
    if (!estadoConservacion) {
      encontrados.estadoConservacion = 'Indica el estado de conservación.';
    }
    if (!precio.trim() || Number.isNaN(valorPrecio) || valorPrecio <= 0) {
      encontrados.precio = 'Ingresa un precio válido en pesos.';
    } else if (valorPrecio > 500000) {
      encontrados.precio = 'El precio máximo permitido es $500.000.';
    }
    if (descripcion.trim().length < 20) {
      encontrados.descripcion = 'Describe el estado del juego con al menos 20 caracteres.';
    }
    if (urlLimpia && !/^https?:\/\/.+/i.test(urlLimpia)) {
      encontrados.imagenUrl = 'La URL debe comenzar con http:// o https://.';
    } else if (urlLimpia.length > 500) {
      encontrados.imagenUrl = 'La URL no puede superar los 500 caracteres.';
    }
    if (!region) {
      encontrados.region = 'Selecciona tu región.';
    }
    if (!comuna) {
      encontrados.comuna = 'Selecciona tu comuna.';
    }
    if (entregas.length === 0) {
      encontrados.entregas = 'Elige al menos una modalidad de entrega.';
    }

    setErrores(encontrados);
    return Object.keys(encontrados).length === 0;
  };

  const revisar = (evento: React.FormEvent) => {
    evento.preventDefault();
    setErrorGeneral('');
    if (validar()) {
      setConfirmando(true);
    }
  };

  const publicar = async () => {
    const datos: DatosPublicacion = {
      titulo: titulo.trim(),
      consola,
      genero,
      estadoConservacion: estadoConservacion as EstadoConservacion,
      precio: Number(precio),
      descripcion: descripcion.trim(),
      imagenUrl: imagenUrl.trim() || undefined,
      region,
      comuna,
      entregas,
      incluyeCaja,
      incluyeManual,
    };

    setEnviando(true);
    setErrorGeneral('');
    try {
      if (id) {
        await actualizarPublicacion(Number(id), datos);
      } else {
        await crearPublicacion(datos);
        limpiar();
      }
      setPublicado(true);
    } catch (error) {
      setErrores(erroresPorCampo(error));
      setErrorGeneral(mensajeDeError(error, 'No fue posible guardar la publicación.'));
    } finally {
      setEnviando(false);
    }
  };

  const tituloPagina = editando ? 'Editar publicación' : 'Publicar videojuego';

  const irAMisPublicaciones = () => {
    if (editando && router.canGoBack()) {
      router.goBack();
    } else {
      router.push(RUTAS.misPublicaciones, 'root', 'replace');
    }
  };

  if (editando && (cargandoEdicion || errorEdicion)) {
    return (
      <IonPage>
        <EncabezadoPagina titulo={tituloPagina} conVolver rutaVolver={RUTAS.misPublicaciones} />
        <IonContent>
          {cargandoEdicion ? (
            <div className="pantalla-transicion">
              <IonSpinner name="crescent" />
              <IonText color="medium">
                <p>Cargando publicación…</p>
              </IonText>
            </div>
          ) : (
            <MensajeVacio icono={alertCircleOutline} titulo="No es posible editar" descripcion={errorEdicion}>
              <IonButton routerLink={RUTAS.misPublicaciones} routerDirection="root">
                Ir a mis publicaciones
              </IonButton>
            </MensajeVacio>
          )}
        </IonContent>
      </IonPage>
    );
  }

  const hayErrores = Object.keys(errores).length > 0;

  return (
    <IonPage>
      {editando ? (
        <EncabezadoPagina titulo={tituloPagina} conVolver rutaVolver={RUTAS.misPublicaciones} />
      ) : (
        <EncabezadoPagina titulo={tituloPagina} />
      )}

      <IonContent>
        <form className="formulario" onSubmit={revisar} noValidate>
          {borradorRestaurado && !editando && (
            <div className="borrador-aviso">
              <span>Borrador recuperado desde tu navegador.</span>
              <IonButton size="small" fill="clear" onClick={limpiar}>
                Descartar
              </IonButton>
            </div>
          )}

          <IonText color="medium">
            <p className="formulario__ayuda">
              Los campos marcados son obligatorios. Puedes buscar el título en RAWG para completar
              su portada oficial y género automáticamente.
            </p>
          </IonText>

          <IonInput
            className={`ion-margin-bottom ${errores.titulo ? 'ion-invalid ion-touched' : ''}`}
            label="Título del videojuego"
            labelPlacement="floating"
            fill="outline"
            value={titulo}
            errorText={errores.titulo}
            onIonInput={(evento) => setTitulo(evento.detail.value ?? '')}
          />

          <div className="rawg-buscador">
            <IonButton
              type="button"
              size="small"
              fill="outline"
              disabled={buscandoRawg}
              onClick={() => void buscarEnRawg()}
            >
              <IonIcon slot="start" icon={buscandoRawg ? searchOutline : sparklesOutline} />
              {buscandoRawg ? 'Buscando en RAWG…' : 'Autocompletar desde RAWG'}
            </IonButton>
            {avisoRawg && (
              <IonText color="medium">
                <p className="nota">{avisoRawg}</p>
              </IonText>
            )}
            {sugerenciasRawg.length > 0 && (
              <div className="rawg-sugerencias">
                {sugerenciasRawg.map((juego) => (
                  <button
                    key={juego.idExterno}
                    type="button"
                    className="rawg-sugerencia"
                    onClick={() => aplicarSugerenciaRawg(juego)}
                  >
                    <div>
                      <strong>{juego.titulo}</strong>
                      <p className="operacion__meta">
                        {juego.fechaLanzamiento || 'Sin fecha'}
                        {juego.plataformas.length > 0
                          ? ` · ${juego.plataformas.slice(0, 3).join(', ')}`
                          : ''}
                      </p>
                    </div>
                    {juego.metacritic !== null && (
                      <IonBadge color="success">Metacritic {juego.metacritic}</IonBadge>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <IonSelect
            className={`ion-margin-bottom ${errores.consola ? 'ion-invalid ion-touched' : ''}`}
            label="Consola"
            labelPlacement="floating"
            fill="outline"
            placeholder="Selecciona una consola"
            value={consola}
            onIonChange={(evento) => setConsola(evento.detail.value)}
          >
            {catalogos.consolas.map((item) => (
              <IonSelectOption key={item} value={item}>
                {item}
              </IonSelectOption>
            ))}
          </IonSelect>

          <IonSelect
            className={`ion-margin-bottom ${errores.genero ? 'ion-invalid ion-touched' : ''}`}
            label="Género"
            labelPlacement="floating"
            fill="outline"
            placeholder="Selecciona un género"
            value={genero}
            onIonChange={(evento) => setGenero(evento.detail.value)}
          >
            {catalogos.generos.map((item) => (
              <IonSelectOption key={item} value={item}>
                {item}
              </IonSelectOption>
            ))}
          </IonSelect>

          <IonSelect
            className={`ion-margin-bottom ${
              errores.estadoConservacion ? 'ion-invalid ion-touched' : ''
            }`}
            label="Estado de conservación"
            labelPlacement="floating"
            fill="outline"
            placeholder="Selecciona el estado"
            value={estadoConservacion}
            onIonChange={(evento) => setEstadoConservacion(evento.detail.value)}
          >
            {catalogos.estadosConservacion.map((item) => (
              <IonSelectOption key={item} value={item}>
                {item}
              </IonSelectOption>
            ))}
          </IonSelect>

          <IonInput
            className={`ion-margin-bottom ${errores.precio ? 'ion-invalid ion-touched' : ''}`}
            label="Precio en pesos"
            labelPlacement="floating"
            fill="outline"
            type="number"
            inputmode="numeric"
            min={1000}
            value={precio}
            helperText="Solo números, sin puntos ni símbolos."
            errorText={errores.precio}
            onIonInput={(evento) => setPrecio(evento.detail.value ?? '')}
          />

          <IonTextarea
            className={`ion-margin-bottom ${errores.descripcion ? 'ion-invalid ion-touched' : ''}`}
            label="Descripción"
            labelPlacement="floating"
            fill="outline"
            autoGrow
            counter
            maxlength={400}
            value={descripcion}
            helperText="Cuenta el estado del disco o cartucho, la caja y si incluye extras."
            errorText={errores.descripcion}
            onIonInput={(evento) => setDescripcion(evento.detail.value ?? '')}
          />

          <IonSelect
            className={`ion-margin-bottom ${errores.region ? 'ion-invalid ion-touched' : ''}`}
            label="Región"
            labelPlacement="floating"
            fill="outline"
            placeholder="Selecciona tu región"
            value={region}
            onIonChange={(evento) => {
              setRegion(evento.detail.value);
              setComuna('');
            }}
          >
            {catalogos.regiones.map((item) => (
              <IonSelectOption key={item.nombre} value={item.nombre}>
                {item.nombre}
              </IonSelectOption>
            ))}
          </IonSelect>

          <IonSelect
            className={`ion-margin-bottom ${errores.comuna ? 'ion-invalid ion-touched' : ''}`}
            label="Comuna"
            labelPlacement="floating"
            fill="outline"
            placeholder={region ? 'Selecciona tu comuna' : 'Primero elige una región'}
            disabled={comunasDisponibles.length === 0}
            value={comuna}
            onIonChange={(evento) => setComuna(evento.detail.value)}
          >
            {comunasDisponibles.map((item) => (
              <IonSelectOption key={item} value={item}>
                {item}
              </IonSelectOption>
            ))}
          </IonSelect>

          <h2 className="titulo-seccion">Modalidades de entrega</h2>
          {catalogos.modalidadesEntrega.map((modalidad) => (
            <IonCheckbox
              key={modalidad}
              className="ion-margin-bottom"
              labelPlacement="end"
              justify="start"
              checked={entregas.includes(modalidad)}
              onIonChange={(evento) => alternarEntrega(modalidad, evento.detail.checked)}
            >
              {modalidad}
            </IonCheckbox>
          ))}
          {errores.entregas && (
            <IonText color="danger">
              <p className="nota">{errores.entregas}</p>
            </IonText>
          )}

          <h2 className="titulo-seccion">Fotografía de portada (opcional)</h2>
          <IonInput
            className={`ion-margin-bottom ${errores.imagenUrl ? 'ion-invalid ion-touched' : ''}`}
            label="URL de imagen (https://...)"
            labelPlacement="floating"
            fill="outline"
            type="url"
            value={imagenUrl}
            helperText="Se completa automáticamente con RAWG o puedes pegar un enlace directo. Si se omite, se genera una portada."
            errorText={errores.imagenUrl}
            onIonInput={(evento) => setImagenUrl(evento.detail.value ?? '')}
          />
          <div className="vista-previa-portada">
            <PortadaJuego
              titulo={titulo || 'Vista previa'}
              consola={consola || 'Consola'}
              imagenUrl={imagenUrl.trim() || undefined}
              tamano="tarjeta"
            />
            {imagenUrl.trim() && (
              <IonButton
                type="button"
                size="small"
                fill="clear"
                color="medium"
                onClick={() => setImagenUrl('')}
              >
                Quitar imagen
              </IonButton>
            )}
          </div>

          <h2 className="titulo-seccion">Contenido incluido</h2>
          <IonToggle
            className="ion-margin-bottom"
            checked={incluyeCaja}
            labelPlacement="end"
            justify="start"
            onIonChange={(evento) => setIncluyeCaja(evento.detail.checked)}
          >
            Incluye caja original
          </IonToggle>
          <IonToggle
            checked={incluyeManual}
            labelPlacement="end"
            justify="start"
            onIonChange={(evento) => setIncluyeManual(evento.detail.checked)}
          >
            Incluye manual
          </IonToggle>

          <div className="formulario__acciones">
            {(hayErrores || errorGeneral) && (
              <IonNote color="danger">
                <p className="nota" role="alert">
                  {errorGeneral || 'Revisa los campos marcados en rojo antes de continuar.'}
                </p>
              </IonNote>
            )}

            <IonButton type="submit" expand="block" disabled={enviando}>
              {enviando ? <IonSpinner name="crescent" /> : editando ? 'Guardar cambios' : 'Publicar videojuego'}
            </IonButton>
            <IonButton
              expand="block"
              fill="clear"
              {...(editando
                ? { onClick: irAMisPublicaciones }
                : { routerLink: RUTAS.catalogo, routerDirection: 'root' as const })}
            >
              Cancelar
            </IonButton>
          </div>
        </form>

        <IonAlert
          isOpen={confirmando}
          header={editando ? 'Confirmar cambios' : 'Confirmar publicación'}
          message={
            editando
              ? `Se actualizará "${titulo}" con los datos ingresados. ¿Deseas continuar?`
              : `Se publicará "${titulo}" para ${consola} en ${comuna}. ¿Deseas continuar?`
          }
          buttons={[
            { text: 'Revisar', role: 'cancel' },
            {
              text: editando ? 'Guardar' : 'Publicar',
              handler: () => {
                void publicar();
              },
            },
          ]}
          onDidDismiss={() => setConfirmando(false)}
        />

        <IonAlert
          isOpen={publicado}
          header={editando ? 'Cambios guardados' : 'Publicación creada'}
          message={
            editando
              ? 'Los cambios ya se ven en el catálogo y en el detalle de la publicación.'
              : 'Tu videojuego ya está visible en el catálogo.'
          }
          buttons={[
            {
              text: 'Ver mis publicaciones',
              handler: () => {
                setPublicado(false);
                irAMisPublicaciones();
              },
            },
          ]}
          onDidDismiss={() => setPublicado(false)}
        />
      </IonContent>
    </IonPage>
  );
};

export default PublicarPage;
