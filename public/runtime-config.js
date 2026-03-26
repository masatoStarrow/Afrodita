// Configuracion runtime – valores por defecto para desarrollo local.
// En produccion, este archivo es reemplazado por ops/runtime-config.sh
// al arrancar el contenedor Docker.
window.__RUNTIME_CONFIG__ = {
  VITE_API_URL: "http://localhost:8000/api/v1",
  VITE_APP_NAME: "CRM",
  VITE_APP_ENV: "development"
};
