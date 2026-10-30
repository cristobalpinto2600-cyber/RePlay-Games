/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL base de la API REST, por ejemplo http://localhost:3000/api (ver .env.example). */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
