/**
 * Perfil del usuario autenticado: reputación, reseñas recibidas y edición de datos (RF-08, EF1).
 */
import {
  IonBadge,
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
  IonNote,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonSkeletonText,
  IonSpinner,
  IonText,
  IonToast,
} from '@ionic/react';
import { personCircleOutline, star } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import EncabezadoPagina from '../components/EncabezadoPagina';
import { useSesion } from '../context/SesionContext';
import { REGIONES } from '../data/catalogos';
import type { Calificacion } from '../models';
import { RUTAS } from '../routes/rutas';
import { erroresPorCampo, mensajeDeError } from '../services/api';
import { listarCalificacionesUsuario } from '../services/calificacionesService';
import { actualizarPerfil } from '../services/usuariosService';
import { formatearFecha } from '../utils/formato';

const PerfilPage: React.FC = () => {
  const { usuario, actualizarUsuario } = useSesion();

  const [nombreUsuario, setNombreUsuario] = useState(usuario?.nombreUsuario ?? '');
  const [region, setRegion] = useState(usuario?.region ?? '');
  const [comuna, setComuna] = useState(usuario?.comuna ?? '');
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [guardando, setGuardando] = useState(false);
  const [aviso, setAviso] = useState('');

  const [resenas, setResenas] = useState<Calificacion[]>([]);
  const [cargandoResenas, setCargandoResenas] = useState(true);

  useEffect(() => {
    if (!usuario) return;
    setNombreUsuario(usuario.nombreUsuario);
    setRegion(usuario.region ?? '');
    setComuna(usuario.comuna ?? '');

    let vigente = true;
    setCargandoResenas(true);
    listarCalificacionesUsuario(usuario.id)
      .then((lista) => {
        if (vigente) setResenas(lista);
      })
      .catch(() => {
        if (vigente) setResenas([]);
      })
      .finally(() => {
        if (vigente) setCargandoResenas(false);
      });

    return () => {
      vigente = false;
    };
  }, [usuario?.id]);

  if (!usuario) {
    return null;
  }

  const comunasDisponibles = REGIONES.find((item) => item.nombre === region)?.comunas ?? [];

  const guardar = async (evento: React.FormEvent) => {
    evento.preventDefault();
    const encontrados: Record<string, string> = {};
    if (nombreUsuario.trim().length < 3) {
      encontrados.nombreUsuario = 'Usa al menos 3 caracteres.';
    }
    if (region && !comuna) {
      encontrados.comuna = 'Selecciona la comuna de tu región.';
    }
    if (Object.keys(encontrados).length > 0) {
      setErrores(encontrados);
      return;
    }

    setGuardando(true);
    setErrores({});
    try {
      const actualizado = await actualizarPerfil({
        nombreUsuario: nombreUsuario.trim(),
        region: region || null,
        comuna: comuna || null,
      });
      actualizarUsuario(actualizado);
      setAviso('Tu perfil fue actualizado.');
    } catch (error) {
      setErrores(erroresPorCampo(error));
      setAviso(mensajeDeError(error, 'No fue posible actualizar el perfil.'));
    } finally {
      setGuardando(false);
    }
  };

  return (
    <IonPage>
      <EncabezadoPagina titulo="Mi perfil" />

      <IonContent>
        <div className="formulario">
          <div className="perfil__cabecera">
            <IonIcon icon={personCircleOutline} className="perfil__avatar" aria-hidden="true" />
            <div>
              <h1 className="perfil__nombre">{usuario.nombreUsuario}</h1>
              <p className="operacion__meta">{usuario.correo}</p>
              <div className="perfil__badges">
                <IonBadge color="primary">{usuario.rol}</IonBadge>
                <IonBadge color="secondary">
                  <IonIcon icon={star} aria-hidden="true" />{' '}
                  {usuario.totalCalificaciones > 0
                    ? `${usuario.reputacion.toFixed(1)} (${usuario.totalCalificaciones})`
                    : 'Sin calificaciones'}
                </IonBadge>
                <IonText color="medium">
                  <span className="nota">Miembro desde {formatearFecha(usuario.fechaRegistro)}</span>
                </IonText>
              </div>
            </div>
          </div>

          <div className="perfil__accesos">
            <IonButton size="small" fill="outline" routerLink={RUTAS.misPublicaciones}>
              Mis publicaciones
            </IonButton>
            <IonButton size="small" fill="outline" routerLink={RUTAS.favoritos}>
              Favoritos
            </IonButton>
            <IonButton size="small" fill="outline" routerLink={RUTAS.operaciones}>
              Compras y ventas
            </IonButton>
          </div>

          <h2 className="titulo-seccion">Editar datos de la cuenta</h2>
          <form onSubmit={guardar} noValidate>
            <IonInput
              className={`ion-margin-bottom ${errores.nombreUsuario ? 'ion-invalid ion-touched' : ''}`}
              label="Nombre de usuario"
              labelPlacement="floating"
              fill="outline"
              value={nombreUsuario}
              errorText={errores.nombreUsuario}
              onIonInput={(evento) => setNombreUsuario(evento.detail.value ?? '')}
            />

            <IonSelect
              className={`ion-margin-bottom ${errores.region ? 'ion-invalid ion-touched' : ''}`}
              label="Región"
              labelPlacement="floating"
              fill="outline"
              placeholder="Opcional"
              value={region}
              onIonChange={(evento) => {
                setRegion(evento.detail.value);
                setComuna('');
              }}
            >
              <IonSelectOption value="">Sin especificar</IonSelectOption>
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

            {errores.comuna && (
              <IonNote color="danger">
                <p className="nota ion-margin-bottom">{errores.comuna}</p>
              </IonNote>
            )}

            <IonButton type="submit" expand="block" disabled={guardando}>
              {guardando ? <IonSpinner name="crescent" /> : 'Guardar perfil'}
            </IonButton>
          </form>

          <h2 className="titulo-seccion">Reseñas recibidas</h2>
          {cargandoResenas ? (
            <IonSkeletonText animated style={{ height: '84px', borderRadius: '14px' }} />
          ) : resenas.length === 0 ? (
            <IonText color="medium">
              <p className="nota">
                Aún no tienes reseñas registradas. Aparecerán aquí cuando tus compradores o
                vendedores califiquen operaciones completadas.
              </p>
            </IonText>
          ) : (
            resenas.map((resena) => (
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
            ))
          )}
        </div>

        <IonToast
          isOpen={aviso !== ''}
          message={aviso}
          duration={2800}
          onDidDismiss={() => setAviso('')}
        />
      </IonContent>
    </IonPage>
  );
};

export default PerfilPage;
