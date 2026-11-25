/**
 * Panel principal del rol Administrador (RF-10).
 * Muestra métricas de moderación y accesos directos a Reportes, Publicaciones y Usuarios.
 */
import {
  IonButton,
  IonContent,
  IonIcon,
  IonPage,
  IonSkeletonText,
  IonText,
  useIonViewWillEnter,
} from '@ionic/react';
import {
  cloudOfflineOutline,
  flagOutline,
  peopleOutline,
  shieldCheckmarkOutline,
} from 'ionicons/icons';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import EncabezadoPagina from '../components/EncabezadoPagina';
import MensajeVacio from '../components/MensajeVacio';
import type { ResumenAdmin } from '../models';
import { RUTAS } from '../routes/rutas';
import { mensajeDeError } from '../services/api';
import { obtenerResumenAdmin } from '../services/reportesService';

const AdminPanelPage: React.FC = () => {
  const [resumen, setResumen] = useState<ResumenAdmin | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const primeraVisita = useRef(true);

  const cargar = useCallback(async () => {
    setError('');
    try {
      setResumen(await obtenerResumenAdmin());
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

  return (
    <IonPage>
      <EncabezadoPagina titulo="Panel administrador" />

      <IonContent>
        <div className="contenedor">
          {cargando ? (
            <div className="panel-admin__grid">
              {[0, 1, 2, 3].map((posicion) => (
                <IonSkeletonText key={posicion} animated style={{ height: '110px', borderRadius: '16px' }} />
              ))}
            </div>
          ) : error ? (
            <MensajeVacio
              icono={cloudOfflineOutline}
              titulo="No pudimos cargar el resumen"
              descripcion={error}
            >
              <IonButton fill="outline" onClick={() => void cargar()}>
                Reintentar
              </IonButton>
            </MensajeVacio>
          ) : (
            resumen && (
              <>
                <h2 className="titulo-seccion">Estado de la plataforma</h2>
                <div className="panel-admin__grid">
                  <div className="stat-card">
                    <span className="stat-card__valor">{resumen.reportesPendientes}</span>
                    <span className="stat-card__etiqueta">Reportes pendientes</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-card__valor">{resumen.publicacionesActivas}</span>
                    <span className="stat-card__etiqueta">Publicaciones activas</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-card__valor">{resumen.publicacionesOcultas}</span>
                    <span className="stat-card__etiqueta">Publicaciones ocultas</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-card__valor">
                      {resumen.usuariosActivos} / {resumen.usuariosTotales}
                    </span>
                    <span className="stat-card__etiqueta">Cuentas activas</span>
                  </div>
                </div>

                <h2 className="titulo-seccion">Herramientas de moderación</h2>
                <div className="panel-admin__accesos">
                  <div className="operacion">
                    <div className="operacion__datos">
                      <h3 className="operacion__titulo">
                        <IonIcon icon={flagOutline} aria-hidden="true" /> Revisión de reportes
                      </h3>
                      <IonText color="medium">
                        <p className="operacion__meta">
                          Consulta los reportes enviados por la comunidad y decide ocultar, mantener o
                          descartar cada publicación.
                        </p>
                      </IonText>
                      <div className="operacion__acciones">
                        <IonButton size="small" routerLink={RUTAS.adminReportes} routerDirection="forward">
                          Ir a reportes ({resumen.reportesPendientes})
                        </IonButton>
                      </div>
                    </div>
                  </div>

                  <div className="operacion">
                    <div className="operacion__datos">
                      <h3 className="operacion__titulo">
                        <IonIcon icon={shieldCheckmarkOutline} aria-hidden="true" /> Moderación de
                        publicaciones
                      </h3>
                      <IonText color="medium">
                        <p className="operacion__meta">
                          Revisa el catálogo completo y oculta o restaura publicaciones de forma
                          confirmada.
                        </p>
                      </IonText>
                      <div className="operacion__acciones">
                        <IonButton
                          size="small"
                          fill="outline"
                          routerLink={RUTAS.adminPublicaciones}
                          routerDirection="forward"
                        >
                          Ver publicaciones
                        </IonButton>
                      </div>
                    </div>
                  </div>

                  <div className="operacion">
                    <div className="operacion__datos">
                      <h3 className="operacion__titulo">
                        <IonIcon icon={peopleOutline} aria-hidden="true" /> Gestión de usuarios
                      </h3>
                      <IonText color="medium">
                        <p className="operacion__meta">
                          Administra las cuentas registradas y desactiva o reactiva accesos cuando sea
                          necesario.
                        </p>
                      </IonText>
                      <div className="operacion__acciones">
                        <IonButton
                          size="small"
                          fill="outline"
                          routerLink={RUTAS.adminUsuarios}
                          routerDirection="forward"
                        >
                          Ir a usuarios
                        </IonButton>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AdminPanelPage;
