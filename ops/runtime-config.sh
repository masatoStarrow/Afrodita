#!/bin/sh
# Genera runtime-config.js a partir de variables de entorno.
# Se ejecuta como entrypoint de Nginx antes de arrancar el servidor.

CONFIG_FILE="/usr/share/nginx/html/runtime-config.js"

cat > "$CONFIG_FILE" <<EOF
window.__RUNTIME_CONFIG__ = {
  VITE_API_URL: "${VITE_API_URL:-http://localhost:8000/api/v1}",
  VITE_APP_NAME: "${VITE_APP_NAME:-CRM}",
  VITE_APP_ENV: "${VITE_APP_ENV:-development}"
};
EOF

echo "runtime-config.sh: generated $CONFIG_FILE"
