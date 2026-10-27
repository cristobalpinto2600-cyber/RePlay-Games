import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuracion de Vite para el frontend Ionic + React de RePlay Games.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
});
