/**
 * Usuarios simulados. En EP1 no hay backend: estas cuentas permiten demostrar
 * el inicio de sesión, las rutas protegidas y la reputación del vendedor (FT-02, RF-02).
 */
import type { Usuario } from '../models';

export const USUARIOS: Usuario[] = [
  {
    id: 'u-01',
    nombreUsuario: 'sebastian_r',
    correo: 'usuario@replay.cl',
    rol: 'usuario',
    region: 'Valparaíso',
    comuna: 'Valparaíso',
    reputacion: 4.8,
    totalCalificaciones: 12,
    fechaRegistro: '2026-03-14',
  },
  {
    id: 'u-02',
    nombreUsuario: 'camila_v',
    correo: 'camila@replay.cl',
    rol: 'usuario',
    region: 'Valparaíso',
    comuna: 'Viña del Mar',
    reputacion: 4.6,
    totalCalificaciones: 27,
    fechaRegistro: '2025-11-02',
  },
  {
    id: 'u-03',
    nombreUsuario: 'diego_games',
    correo: 'diego@replay.cl',
    rol: 'usuario',
    region: 'Metropolitana',
    comuna: 'Ñuñoa',
    reputacion: 4.2,
    totalCalificaciones: 8,
    fechaRegistro: '2026-01-20',
  },
  {
    id: 'u-04',
    nombreUsuario: 'fernanda_m',
    correo: 'fernanda@replay.cl',
    rol: 'usuario',
    region: 'Biobío',
    comuna: 'Concepción',
    reputacion: 5,
    totalCalificaciones: 5,
    fechaRegistro: '2026-05-08',
  },
  {
    id: 'u-05',
    nombreUsuario: 'daniel_admin',
    correo: 'admin@replay.cl',
    rol: 'administrador',
    region: 'Metropolitana',
    comuna: 'Santiago',
    reputacion: 0,
    totalCalificaciones: 0,
    fechaRegistro: '2025-09-01',
  },
];

/** Cuenta que se ofrece en la pantalla de inicio de sesión para probar la aplicación. */
export const CUENTA_DEMO = {
  correo: 'usuario@replay.cl',
  clave: '123456',
};

/** Contraseña aceptada por el servicio simulado para cualquier cuenta de ejemplo. */
export const CLAVE_DEMO = '123456';
