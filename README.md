# Afrodita — CRM Frontend

Interfaz web del sistema **StarrowCRM**, construida como Single Page Application con React 19, TypeScript y Vite. Sigue el patrón **Atomic Design** para la organización de componentes.

## Stack

| Componente | Tecnología | Versión |
|---|---|---|
| Framework | React | 19.2 |
| Lenguaje | TypeScript | 5.9 |
| Bundler | Vite | 7.3 |
| Estado global | Zustand | 5.0 |
| Estado servidor | TanStack React Query | 5.90 |
| Cliente HTTP | Axios | 1.13 |
| Routing | React Router DOM | 7.13 |
| Formularios | React Hook Form + Zod | 7.71 + 4.3 |
| Testing | Vitest + React Testing Library | 4.0 + 16.3 |

## Estructura

```
Afrodita/
├── src/
│   ├── components/          # Atomic Design
│   │   ├── atoms/           # 9 componentes base (Button, Input, Spinner, Avatar, Modal, Label, Logo, Icon, Text)
│   │   ├── molecules/       # 4 combinaciones (FormField, AlertMessage, NavItem, UserMenu)
│   │   ├── organisms/       # 7 secciones complejas (Header, Footer, LoginForm, InteractionTimeline, NewInteractionForm, EditInteractionForm, FilterPanel)
│   │   └── templates/       # 2 layouts (AuthTemplate, DashboardTemplate)
│   ├── pages/               # Vistas
│   │   ├── LoginPage/       # Login público
│   │   ├── ClientesPage/    # Listado de clientes con métricas (served at /dashboard)
│   │   ├── ClienteDetailPage/ # Detalle de cliente con historial de interacciones
│   │   └── InteractionDetailPage/ # Detalle de interacción con auditoría y edición
│   ├── hooks/               # Custom hooks (queries + mutations)
│   ├── services/            # Capa HTTP (Axios)
│   ├── store/               # Zustand (auth + UI)
│   ├── router/              # Rutas con lazy loading
│   ├── types/               # TypeScript types
│   ├── constants/           # Rutas, roles, API URL
│   ├── utils/               # Formato, tokens
│   └── styles/              # CSS Modules + variables
├── package.json
├── vite.config.ts
├── vitest.config.ts
└── Dockerfile               # Multi-stage: Node build + Nginx runtime
```

## Rutas

| Ruta | Componente | Protección |
|---|---|---|
| `/login` | LoginPage | Pública |
| `/dashboard` | ClientesPage | Requiere token |
| `/dashboard/clientes/:id` | ClienteDetailPage | Requiere token |
| `/dashboard/clientes/:clientId/interacciones/:interactionId` | InteractionDetailPage | Requiere token |

## Comunicación con Backend

Todo el tráfico HTTP pasa por un cliente Axios centralizado que inyecta automáticamente el JWT y maneja sesiones expiradas (401 → redirect a login).

```
Afrodita → Atenea (API Gateway :8000) → Artemisa (Users/Clients :8001)
                                   → Venus (Interactions :8002)
```

## Comandos

```bash
npm run dev           # Dev server en http://localhost:5173
npm run build         # Build de producción
npm run test          # Vitest en modo watch
npm run test:run      # Vitest una sola vez
npm run test:coverage # Tests con cobertura (umbral: 80%)
```

## Variables de entorno

| Variable | Ejemplo |
|---|---|
| `VITE_API_URL` | `http://localhost:8000/api/v1` |
| `VITE_APP_NAME` | `StarrowCRM` |
| `VITE_APP_ENV` | `development` |

## Tests

14 archivos de test con Vitest + React Testing Library. Ver `TECHNICAL_DOCS.md` para documentación técnica completa.
