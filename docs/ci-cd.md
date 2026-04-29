# CI/CD – Afrodita

## Resumen

Afrodita tiene tres pipelines de GitHub Actions:

| Pipeline       | Trigger                  | Que hace                                              |
| -------------- | ------------------------ | ----------------------------------------------------- |
| CI             | PR o push a `develop`/`main` | lint, test, build, Docker build                       |
| CD Develop     | push a `develop`         | build + push a ECR + redeploy del servicio ECS develop |
| CD Production  | push a `main`            | build + push a ECR + redeploy del servicio ECS production |

## Imagen Docker

Multi-stage con Node 20 (build) y Nginx (runtime).

La misma imagen sirve para develop y production gracias a `runtime-config.js`, que se genera al arrancar el contenedor a partir de variables de entorno inyectadas por la task definition de ECS.

## Despliegue (AWS ECS Fargate)

El pipeline de CD se encarga de:

1. Validar el CI (lint, test, build, Docker build).
2. Configurar credenciales AWS.
3. Login a Amazon ECR.
4. Build y push de la imagen al repositorio ECR (`crm-tic2/afrodita`) con tags:
   - `develop-<sha>` o `production-<sha>` (trazabilidad)
   - `develop-latest` o `production-latest`
   - `latest` (consumido por la task definition de ECS)
5. `aws ecs update-service --force-new-deployment` para que ECS levante una nueva task con la imagen recién subida.
6. Espera con `aws ecs wait services-stable` para garantizar que el rollout completó.

## Secretos requeridos en GitHub Environments

Configurar en `Settings → Environments → develop` y `production`.

### Secrets

| Secret                  | Descripción                                                  |
| ----------------------- | ------------------------------------------------------------ |
| `AWS_ACCESS_KEY_ID`     | Access Key del usuario IAM o de la sesión de AWS Academy     |
| `AWS_SECRET_ACCESS_KEY` | Secret Key correspondiente                                   |
| `AWS_SESSION_TOKEN`     | Session Token (sólo en AWS Academy / credenciales temporales) |

### Variables (no sensibles)

| Variable          | Valor sugerido                                              |
| ----------------- | ----------------------------------------------------------- |
| `AWS_REGION`      | `us-east-1`                                                 |
| `ECR_REGISTRY`    | `<account-id>.dkr.ecr.us-east-1.amazonaws.com`              |
| `ECR_REPOSITORY`  | `crm-tic2/afrodita`                                         |
| `ECS_CLUSTER`     | `crm-tic2-cluster-develop` (o `crm-tic2-cluster-production`) |
| `ECS_SERVICE`     | `afrodita`                                                  |

> Tip: `ECR_REGISTRY` se obtiene con `terraform output ecr_repository_urls` (es la parte antes del nombre del repositorio).

## Health check

Nginx responde `200` en `/healthz`. ECS usa el target group del ALB para health checks.
