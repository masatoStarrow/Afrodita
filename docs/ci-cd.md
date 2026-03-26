# CI/CD – Afrodita

## Resumen

Afrodita tiene tres pipelines de GitHub Actions:

| Pipeline | Trigger | Que hace |
|---|---|---|
| CI | PR o push a `develop`/`main` | lint, test, build, Docker build |
| CD Develop | push a `develop` | build + push imagen GHCR, deploy remoto |
| CD Production | push a `main` | build + push imagen GHCR, deploy remoto |

## Imagen Docker

Multi-stage con Node 20 (build) y Nginx (runtime).

La misma imagen sirve para develop y production gracias a `runtime-config.js`, que se genera al arrancar el contenedor a partir de variables de entorno.

## Despliegue

El script `ops/deploy.sh` se encarga de:

1. Validar variables requeridas
2. Login al registry
3. Pull de la nueva imagen
4. `docker compose up -d`
5. Health check (30 intentos, 2s entre cada uno)
6. Rollback a imagen anterior si falla

## Variables requeridas en GitHub Environments

| Variable | Descripcion |
|---|---|
| `SSH_HOST` | Host del servidor |
| `SSH_PORT` | Puerto SSH |
| `SSH_USER` | Usuario SSH |
| `SSH_PRIVATE_KEY` | Clave privada SSH |
| `REGISTRY_USERNAME` | Usuario GHCR |
| `REGISTRY_TOKEN` | Token GHCR |
| `DEPLOY_ENV_FILE` | Contenido del archivo .env del ambiente |

## Health check

Nginx responde `200` en `/healthz`.
