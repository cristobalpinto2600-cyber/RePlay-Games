/**
 * Menú lateral de la aplicación (documento, sección 4.8).
 * En escritorio queda fijo gracias al IonSplitPane; en móvil se abre desde el botón de menú.
 * Los enlaces son los mismos que la barra inferior, para mantener nombres y ubicaciones
 * coherentes entre ambas versiones (RNF-UX-02).
 */
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuToggle,
  IonNote,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from '@ionic/react';
import {
  addCircleOutline,
  gameControllerOutline,
  logInOutline,
  logOutOutline,
  personAddOutline,
  personCircleOutline,
  swapHorizontalOutline,
} from 'ionicons/icons';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useSesion } from '../context/SesionContext';
import { RUTAS } from '../routes/rutas';

interface ItemMenu {
  titulo: string;
  ruta: string;
  icono: string;
  /** Indica al usuario que la sección exige sesión iniciada. */
  protegida: boolean;
}

const ITEMS: ItemMenu[] = [
  { titulo: 'Catálogo', ruta: RUTAS.catalogo, icono: gameControllerOutline, protegida: false },
  { titulo: 'Publicar juego', ruta: RUTAS.publicar, icono: addCircleOutline, protegida: true },
  { titulo: 'Compras y ventas', ruta: RUTAS.operaciones, icono: swapHorizontalOutline, protegida: true },
];

interface Props {
  /** Se desactiva en las pantallas de acceso para no mostrar navegación sin sesión. */
  deshabilitado?: boolean;
}

const MenuLateral: React.FC<Props> = ({ deshabilitado = false }) => {
  const { usuario, cerrarSesion } = useSesion();
  const { pathname } = useLocation();
  const router = useIonRouter();

  const salir = () => {
    cerrarSesion();
    router.push(RUTAS.catalogo, 'root', 'replace');
  };

  return (
    <IonMenu contentId="main" menuId="principal" type="overlay" disabled={deshabilitado}>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>RePlay Games</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="menu__sesion">
          <IonIcon icon={personCircleOutline} className="menu__avatar" aria-hidden="true" />
          <div>
            <strong>{usuario ? usuario.nombreUsuario : 'Visitante'}</strong>
            <IonNote>{usuario ? usuario.correo : 'Sin sesión iniciada'}</IonNote>
          </div>
        </div>

        <IonList lines="none">
          {ITEMS.map((item) => (
            <IonMenuToggle key={item.ruta} autoHide={false}>
              <IonItem
                routerLink={item.ruta}
                routerDirection="root"
                detail={false}
                className={pathname === item.ruta ? 'item-activo' : ''}
              >
                <IonIcon slot="start" icon={item.icono} aria-hidden="true" />
                <IonLabel>{item.titulo}</IonLabel>
                {item.protegida && !usuario && <IonNote slot="end">Requiere sesión</IonNote>}
              </IonItem>
            </IonMenuToggle>
          ))}
        </IonList>

        <IonList lines="none" className="menu__cuenta">
          {usuario ? (
            <IonMenuToggle autoHide={false}>
              <IonItem button detail={false} onClick={salir}>
                <IonIcon slot="start" icon={logOutOutline} aria-hidden="true" />
                <IonLabel>Cerrar sesión</IonLabel>
              </IonItem>
            </IonMenuToggle>
          ) : (
            <>
              <IonMenuToggle autoHide={false}>
                <IonItem routerLink={RUTAS.login} routerDirection="root" detail={false}>
                  <IonIcon slot="start" icon={logInOutline} aria-hidden="true" />
                  <IonLabel>Iniciar sesión</IonLabel>
                </IonItem>
              </IonMenuToggle>
              <IonMenuToggle autoHide={false}>
                <IonItem routerLink={RUTAS.registro} routerDirection="root" detail={false}>
                  <IonIcon slot="start" icon={personAddOutline} aria-hidden="true" />
                  <IonLabel>Crear cuenta</IonLabel>
                </IonItem>
              </IonMenuToggle>
            </>
          )}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default MenuLateral;
