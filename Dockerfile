# ── Stage 1: build ──────────────────────────────────────────────
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ── Stage 2: runtime ────────────────────────────────────────────
FROM nginx:1.27-alpine

# Copiar configuracion Nginx personalizada
COPY ops/nginx.conf /etc/nginx/conf.d/default.conf

# Copiar script de config runtime
COPY ops/runtime-config.sh /docker-entrypoint.d/40-runtime-config.sh
RUN chmod +x /docker-entrypoint.d/40-runtime-config.sh

# Copiar build compilado
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost/healthz || exit 1
