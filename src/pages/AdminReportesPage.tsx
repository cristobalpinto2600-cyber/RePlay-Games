/**
 * Revisión y resolución de reportes de publicaciones (RF-10). Ruta protegida de Administrador.
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
import { cloudOfflineOutline, flagOutline } from 'ionicons/icons';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import EncabezadoPagina from '../components/EncabezadoPagina';
import MensajeVacio from '../components/MensajeVacio';
import type { AccionModeracion, EstadoReporte, Reporte } from '../models';
import { rutaDetalle } from '../routes/rutas';
import { mensajeDeError } from '../services/api';
import { listarReportes, resolverReporte } from '../services/reportesService';
import { formatearPrecio } from '../utils/formato';

function colorEstadoReporte(estado: EstadoReporte): string {
  switch (estado) {
    case 'pendiente':
      return 'warning';
    case 'revisado':
      return 'success';
    default:
      return 'medium';
  }
}

const AdminReportesPage: React.FC = () => {
  const [estadoFiltro, setEstadoFiltro] = useState<EstadoReporte>('pendiente');
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [aviso, setAviso] = useState('');
  const [procesando, setProcesando] = useState<number | null>(null);
  const primeraVisita = useRef(true);
  const [presentarAlerta] = useIonAlert();

  const cargar = useCallback(async () => {
    setError('');
    setCargando(true);
    try {
      setReportes(await listarReportes(estadoFiltro));
    } catch (causa) {
      setError(mensajeDeError(causa));
    } finally {
      setCargando(false);
    }
  }, [estadoFiltro]);

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

  const ejecutarResolucion = async (
    reporte: Reporte,
    accion: AccionModeracion,
    nota?: string,
  ) => {
    setProcesando(reporte.id);
    try {
      await resolverReporte(reporte.id, accion, nota);
      setAviso(
        accion === 'ocultar'
          ? `La publicación "${reporte.publicacion.titulo}" fue ocultada.`
          : accion === 'mantener'
          ? `La publicación "${reporte.publicacion.titulo}" se mantiene visible.`
          : 'El reporte fue descartado.',
      );
      await cargar();
    } catch (causa) {
      setAviso(mensajeDeError(causa, 'No fue posible resolver el reporte.'));
    } finally {
      setProcesando(null);
    }
  };

  const confirmar = (reporte: Reporte, accion: AccionModeracion) => {
    const titulos: Record<AccionModeracion, string> = {
      ocultar: 'Ocultar publicación',
      mantener: 'Mantener publicación visible',
      descartar: 'Descartar reporte',
    };
    const mensajes: Record<AccionModeracion, string> = {
      ocultar: `"${reporte.publicacion.titulo}" dejará de mostrarse en el catálogo y se notificará al vendedor.`,
      mantener: `"${reporte.publicacion.titulo}" seguirá visible en el catálogo.`,
      descartar: 'El reporte se marcará como descartado sin modificar la publicación.',
    };

    presentarAlerta({
      header: titulos[accion],
      message: mensajes[accion],
      inputs: [
        {
          name: 'nota',
          type: 'text',
          placeholder: 'Nota de moderación (opcional)',
        },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Confirmar',
          handler: (valores: { nota?: string }) =>
            void ejecutarResolucion(reporte, accion, valores?.nota),
        },
      ],
    });
  };

  return (
    <IonPage>
      <EncabezadoPagina titulo="Reportes de publicaciones" />

      <IonContent>
        <div className="operaciones">
          <IonSegment
            value={estadoFiltro}
            onIonChange={(evento) => setEstadoFiltro(evento.detail.value as EstadoReporte)}
          >
            <IonSegmentButton value="pendiente">
              <IonLabel>Pendientes</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="revisado">
              <IonLabel>Revisados</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="descartado">
              <IonLabel>Descartados</IonLabel>
            </IonSegmentButton>
          </IonSegment>

          <div className="ion-margin-top">
            {cargando ? (
              [0, 1, 2].map((posicion) => (
                <IonSkeletonText
                  key={posicion}
                  animated
                  style={{ height: '130px', borderRadius: '16px', marginBottom: '12px' }}
                />
              ))
            ) : error ? (
              <MensajeVacio
                icono={cloudOfflineOutline}
                titulo="No pudimos cargar los reportes"
                descripcion={error}
              >
                <IonButton fill="outline" onClick={() => void cargar()}>
                  Reintentar
                </IonButton>
              </MensajeVacio>
            ) : reportes.length === 0 ? (
              <MensajeVacio
                icono={flagOutline}
                titulo={`Sin reportes ${estadoFiltro}s`}
                descripcion="No hay reportes registrados en esta categoría."
              />
            ) : (
              reportes.map((reporte) => (
                <article className="operacion" key={reporte.id}>
                  <div className="operacion__datos">
                    <h3 className="operacion__titulo">{reporte.publicacion.titulo}</h3>
                    <IonBadge color={colorEstadoReporte(reporte.estado)}>{reporte.estado}</IonBadge>{' '}
                    {reporte.publicacion.oculta && <IonBadge color="danger">Oculta</IonBadge>}{' '}
                    <IonBadge color="medium">{reporte.motivo}</IonBadge>

                    <p className="operacion__meta">
                      {reporte.publicacion.consola} · {formatearPrecio(reporte.publicacion.precio)} ·
                      Vendedor: {reporte.publicacion.vendedorNombre}
                    </p>
                    <p className="operacion__meta">
                      Reportado por {reporte.reportante.nombreUsuario} · {reporte.fechaCreacion}
                    </p>
                    {reporte.comentario && (
                      <p className="resena__texto">“{reporte.comentario}”</p>
                    )}
                    {reporte.notaModeracion && (
                      <p className="operacion__meta">
                        Resolución ({reporte.accionTomada}): {reporte.notaModeracion}
                      </p>
                    )}

                    <div className="operacion__acciones">
                      <IonButton
                        size="small"
                        fill="outline"
                        routerLink={rutaDetalle(reporte.publicacionId)}
                        routerDirection="forward"
                      >
                        Ver publicación
                      </IonButton>
                      {reporte.estado === 'pendiente' && (
                        <>
                          <IonButton
                            size="small"
                            color="danger"
                            disabled={procesando === reporte.id}
                            onClick={() => confirmar(reporte, 'ocultar')}
                          >
                            Ocultar
                          </IonButton>
                          <IonButton
                            size="small"
                            color="success"
                            fill="outline"
                            disabled={procesando === reporte.id}
                            onClick={() => confirmar(reporte, 'mantener')}
                          >
                            Mantener visible
                          </IonButton>
                          <IonButton
                            size="small"
                            color="medium"
                            fill="clear"
                            disabled={procesando === reporte.id}
                            onClick={() => confirmar(reporte, 'descartar')}
                          >
                            Descartar
                          </IonButton>
                        </>
                      )}
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

export default AdminReportesPage;
