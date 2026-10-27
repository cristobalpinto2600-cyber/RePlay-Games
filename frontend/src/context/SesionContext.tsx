/**
 * Estado de sesión compartido por toda la aplicación (FT-02, FT-03, RNF-SEG-01).
 * Las páginas y el menú consultan aquí quién está autenticado; las rutas protegidas lo usan
 * para decidir si redirigen a /login.
 */
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Credenciales, DatosRegistro, Usuario } from '../models';
import {
  cerrarSesion as cerrarSesionServicio,
  iniciarSesion as iniciarSesionServicio,
  leerSesion,
  registrar as registrarServicio,
} from '../services/autenticacionService';

interface ValorSesion {
  usuario: Usuario | null;
  /** Verdadero mientras se recupera la sesión guardada, para no redirigir antes de tiempo. */
  cargando: boolean;
  iniciarSesion: (credenciales: Credenciales) => Promise<Usuario>;
  registrar: (datos: DatosRegistro) => Promise<Usuario>;
  cerrarSesion: () => void;
}

const SesionContext = createContext<ValorSesion | undefined>(undefined);

export const SesionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    setUsuario(leerSesion());
    setCargando(false);
  }, []);

  const iniciarSesion = useCallback(async (credenciales: Credenciales) => {
    const autenticado = await iniciarSesionServicio(credenciales);
    setUsuario(autenticado);
    return autenticado;
  }, []);

  const registrar = useCallback(async (datos: DatosRegistro) => {
    const creado = await registrarServicio(datos);
    setUsuario(creado);
    return creado;
  }, []);

  const cerrarSesion = useCallback(() => {
    cerrarSesionServicio();
    setUsuario(null);
  }, []);

  const valor = useMemo<ValorSesion>(
    () => ({ usuario, cargando, iniciarSesion, registrar, cerrarSesion }),
    [usuario, cargando, iniciarSesion, registrar, cerrarSesion],
  );

  return <SesionContext.Provider value={valor}>{children}</SesionContext.Provider>;
};

export function useSesion(): ValorSesion {
  const contexto = useContext(SesionContext);
  if (!contexto) {
    throw new Error('useSesion debe utilizarse dentro de SesionProvider.');
  }
  return contexto;
}
