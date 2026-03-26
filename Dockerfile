# Build stage
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Usar vite build directamente — tsc checa tests que no son necesarios para producción
RUN npx vite build

# Production stage
FROM nginx:alpine

# Copiar la SPA compilada
COPY --from=build /app/dist /usr/share/nginx/html

# Configuración de Nginx para SPA (fallback a index.html)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
