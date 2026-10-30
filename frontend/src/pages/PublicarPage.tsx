/**
 * Publicar videojuego (RF-03) y editar una publicación propia (RF-04). Ruta protegida.
 *
 * Reúne los datos obligatorios definidos por la plataforma, valida cada campo antes de enviar,
 * conserva lo escrito cuando hay errores y pide confirmación antes de publicar
 * (documento, sección 4.7: formulario de publicación).
 *
 * La misma página atiende /publicar (crear) y /publicaciones/:id/editar (editar): en modo edición
 * precarga los datos desde la API. El backend vuelve a validar todo y, si rechaza algún campo,
 * su mensaje se muestra junto al control correspondiente.
 */
import {
  IonAlert,
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
import { addOutline, alertCircleOutline, closeCircle, imageOutline } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import EncabezadoPagina from '../components/EncabezadoPagina';
import MensajeVacio from '../components/MensajeVacio';
import { useSesion } from '../context/SesionContext';
import {
  CONSOLAS,
  ESTADOS_CONSERVACION,
  GENEROS,
  MODALIDADES_ENTREGA,
  REGIONES,
} from '../data/catalogos';
import type { DatosPublicacion, EstadoConservacion, ModalidadEntrega } from '../models';
import { RUTAS } from '../routes/rutas';
import { erroresPorCampo, mensajeDeError } from '../services/api';
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
  region?: string;
  comuna?: string;
  entregas?: string;
  fotos?: string;
}

const MAXIMO_FOTOS = 4;

const PublicarPage: React.FC = () => {
  const router = useIonRouter();
  const { usuario } = useSesion();
  const { id } = useParams<{ id?: string }>();
  const editando = Boolean(id);

  const [titulo, setTitulo] = useState('');
  const [consola, setConsola] = useState('');
  const [genero, setGenero] = useState('');
  const [estadoConservacion, setEstadoConservacion] = useState('');
  const [precio, setPrecio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [region, setRegion] = useState('');
  const [comuna, setComuna] = useState('');
  const [entregas, setEntregas] = useState<ModalidadEntrega[]>([]);
  const [fotos, setFotos] = useState<number[]>([]);
  const [incluyeCaja, setIncluyeCaja] = useState(true);
  const [incluyeManual, setIncluyeManual] = useState(false);

  const [errores, setErrores] = useState<ErroresPublicacion>({});
  const [confirmando, setConfirmando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [publicado, setPublicado] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState('');
  const [cargandoEdicion, setCargandoEdicion] = useState(editando);
  const [errorEdicion, setErrorEdicion] = useState('');

  /** Deja el formulario vacío, listo para una nueva publicación. */
  const limpiar = () => {
    setTitulo('');
    setConsola('');
    setGenero('');
    setEstadoConservacion('');
    setPrecio('');
    setDescripcion('');
    setRegion('');
    setComuna('');
    setEntregas([]);
    setFotos([]);
    setIncluyeCaja(true);
    setIncluyeManual(false);
    setErrores({});
    setErrorGeneral('');
  };

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
        if (!vigente) {
          return;
        }
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
        setRegion(publicacion.region);
        setComuna(publicacion.comuna);
        setEntregas(publicacion.entregas);
        setIncluyeCaja(publicacion.incluyeCaja);
        setIncluyeManual(publicacion.incluyeManual);
        // Las fotografías aún son simuladas: se muestra una para no exigir agregarla de nuevo.
        setFotos([Date.now()]);
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

  const comunasDisponibles = REGIONES.find((item) => item.nombre === region)?.comunas ?? [];

  const alternarEntrega = (modalidad: ModalidadEntrega, seleccionada: boolean) => {
    setEntregas((actuales) =>
      seleccionada
        ? [...actuales, modalidad]
        : actuales.filter((existente) => existente !== modalidad),
    );
  };

  const validar = (): boolean => {
    const encontrados: ErroresPublicacion = {};
    const valorPrecio = Number(precio);

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
    if (!region) {
      encontrados.region = 'Selecciona tu región.';
    }
    if (!comuna) {
      encontrados.comuna = 'Selecciona tu comuna.';
    }
    if (entregas.length === 0) {
      encontrados.entregas = 'Elige al menos una modalidad de entrega.';
    }
    if (fotos.length === 0) {
      encontrados.fotos = 'Agrega al menos una fotografía del producto.';
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

  /**
   * Tras guardar o cancelar se vuelve a "Mis publicaciones". En modo edición se retrocede, porque
   * la página se abrió desde esa lista; si se entró directo por URL no hay historial y se navega.
   */
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
          <IonText color="medium">
            <p className="formulario__ayuda">
              Los campos marcados son obligatorios. Mientras más completa sea la información, menos
              preguntas recibirás.
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

          <IonSelect
            className={`ion-margin-bottom ${errores.consola ? 'ion-invalid ion-touched' : ''}`}
            label="Consola"
            labelPlacement="floating"
            fill="outline"
            placeholder="Selecciona una consola"
            value={consola}
            onIonChange={(evento) => setConsola(evento.detail.value)}
          >
            {CONSOLAS.map((item) => (
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
            {GENEROS.map((item) => (
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
            {ESTADOS_CONSERVACION.map((item) => (
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
            {REGIONES.map((item) => (
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
          {MODALIDADES_ENTREGA.map((modalidad) => (
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

          <h2 className="titulo-seccion">Fotografías</h2>
          <IonText color="medium">
            <p className="formulario__ayuda">
              En esta entrega las fotografías siguen siendo simuladas: la carga real de archivos
              queda planificada para la siguiente etapa.
            </p>
          </IonText>

          <div className="formulario__fotos">
            {fotos.map((foto) => (
              <button
                key={foto}
                type="button"
                className="foto-simulada"
                aria-label="Quitar fotografía"
                onClick={() => setFotos((actuales) => actuales.filter((item) => item !== foto))}
              >
                <IonIcon icon={closeCircle} aria-hidden="true" />
              </button>
            ))}

            {fotos.length < MAXIMO_FOTOS && (
              <button
                type="button"
                className="foto-simulada"
                aria-label="Agregar fotografía"
                onClick={() => setFotos((actuales) => [...actuales, Date.now()])}
              >
                <IonIcon icon={fotos.length === 0 ? imageOutline : addOutline} aria-hidden="true" />
              </button>
            )}
          </div>
          {errores.fotos && (
            <IonText color="danger">
              <p className="nota">{errores.fotos}</p>
            </IonText>
          )}

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
