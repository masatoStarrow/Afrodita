/**
 * Configuracion runtime inyectada por el contenedor Docker.
 *
 * En desarrollo, los valores vienen del archivo public/runtime-config.js
 * (cargado por index.html) con fallback a import.meta.env.
 *
 * En produccion, ops/runtime-config.sh genera runtime-config.js
 * con las variables de entorno del contenedor.
 */

interface RuntimeConfig {
  VITE_API_URL: string
  VITE_APP_NAME: string
  VITE_APP_ENV: string
}

declare global {
  interface Window {
    __RUNTIME_CONFIG__?: RuntimeConfig
  }
}

function getRuntimeConfig(): RuntimeConfig {
  const rc = window.__RUNTIME_CONFIG__

  return {
    VITE_API_URL:  rc?.VITE_API_URL  ?? import.meta.env.VITE_API_URL  ?? 'http://localhost:8000/api/v1',
    VITE_APP_NAME: rc?.VITE_APP_NAME ?? import.meta.env.VITE_APP_NAME ?? 'CRM',
    VITE_APP_ENV:  rc?.VITE_APP_ENV  ?? import.meta.env.VITE_APP_ENV  ?? 'development',
  }
}

export const runtimeConfig = getRuntimeConfig()
