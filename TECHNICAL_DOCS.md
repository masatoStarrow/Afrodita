# Documentación Técnica — Afrodita (Frontend)

## 1. Descripción General

**Afrodita** es el módulo frontend del sistema **StarrowCRM**, una aplicación web de gestión de relaciones con clientes (CRM). Está construido como una Single Page Application (SPA) con React 19, TypeScript y Vite, siguiendo una arquitectura basada en Atomic Design para la organización de componentes.

| Campo | Valor |
|-------|-------|
| Nombre del paquete | `crm-frontend` |
| Framework | React 19.2 |
| Lenguaje | TypeScript 5.9 |
| Bundler | Vite 7.3 |
| Gestor de estado global | Zustand 5.0 |
| Fetching de datos | TanStack React Query 5.90 |
| Cliente HTTP | Axios 1.13 |
| Routing | React Router DOM 7.13 |
| Formularios | React Hook Form 7.71 + Zod 4.3 |
| Testing | Vitest 4.0 + Testing Library |
| Entorno de tests | jsdom 28.1 |

---

## 2. Arquitectura del Proyecto

### 2.1 Estructura de Carpetas

```
Afrodita/
├── public/                          # Archivos estáticos
├── src/
│   ├── assets/                      # Recursos estáticos (SVGs, imágenes)
│   │   └── star-logo.svg
│   ├── components/                  # Componentes UI (Atomic Design)
│   │   ├── atoms/                   # Componentes base indivisibles
│   │   │   ├── Avatar/
│   │   │   ├── Button/
│   │   │   ├── Icon/
│   │   │   ├── Input/
│   │   │   ├── Label/
│   │   │   ├── Logo/
│   │   │   ├── Modal/
│   │   │   ├── Spinner/
│   │   │   └── Text/
│   │   ├── molecules/               # Combinaciones de átomos
│   │   │   ├── AlertMessage/
│   │   │   ├── FormField/
│   │   │   ├── NavItem/
│   │   │   └── UserMenu/
│   │   ├── organisms/               # Secciones complejas de UI
│   │   │   ├── EditInteractionForm/
│   │   │   ├── FilterPanel/
│   │   │   ├── Footer/
│   │   │   ├── Header/
│   │   │   ├── InteractionTimeline/
│   │   │   ├── LoginForm/
│   │   │   └── NewInteractionForm/
│   │   └── templates/               # Layouts de página
│   │       ├── AuthTemplate/
│   │       └── DashboardTemplate/
│   ├── constants/                   # Constantes de la aplicación
│   │   ├── api.constants.ts
│   │   ├── roles.constants.ts
│   │   └── routes.constants.ts
│   ├── hooks/                       # Custom hooks
│   │   ├── mutations/               # Hooks de mutación (POST, PUT, DELETE)
│   │   │   ├── useAuth.mutation.ts
│   │   │   └── useInteraction.mutation.ts
│   │   ├── queries/                 # Hooks de consulta (GET)
│   │   │   ├── useAuth.query.ts
│   │   │   ├── useClients.query.ts
│   │   │   ├── useInteractions.query.ts
│   │   │   ├── useMetrics.query.ts
│   │   │   └── useUsers.query.ts
│   │   └── useRole.ts
│   ├── pages/                       # Vistas/páginas
│   │   ├── ClienteDetailPage/
│   │   ├── ClientesPage/
│   │   ├── DashboardPage/
│   │   ├── InteractionDetailPage/
│   │   └── LoginPage/
│   ├── router/                      # Configuración de rutas
│   │   ├── index.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── PublicRoute.tsx
│   ├── services/                    # Capa de servicios (llamadas HTTP)
│   │   ├── api.client.ts
│   │   ├── auth.service.ts
│   │   ├── clients.service.ts
│   │   ├── interactions.service.ts
│   │   ├── metrics.service.ts
│   │   ├── users.service.ts
│   │   └── index.ts
│   ├── store/                       # Estado global (Zustand)
│   │   ├── auth.store.ts
│   │   └── ui.store.ts
│   ├── styles/                      # Estilos globales
│   │   ├── breakpoints.css
│   │   ├── global.css
│   │   └── variables.css
│   ├── tests/                       # Configuración de tests
│   │   └── setup.ts
│   ├── types/                       # Tipos e interfaces TypeScript
│   │   ├── api.types.ts
│   │   ├── auth.types.ts
│   │   ├── client.types.ts
│   │   ├── interaction.types.ts
│   │   ├── metrics.types.ts
│   │   └── index.ts
│   ├── utils/                       # Funciones utilitarias
│   │   ├── format.utils.ts
│   │   └── token.utils.ts
│   ├── App.tsx                      # Componente raíz
│   ├── main.tsx                     # Punto de entrada
│   └── vite-env.d.ts               # Tipos de Vite
├── package.json
├── tsconfig.json
├── vite.config.ts
└── vitest.config.ts
```

### 2.2 Patrón Atomic Design

La aplicación sigue el patrón **Atomic Design** para organizar los componentes de UI:

| Nivel | Descripción | Ejemplos |
|-------|-------------|----------|
| **Atoms** | Componentes base indivisibles que no dependen de otros componentes del proyecto | `Button`, `Input`, `Spinner`, `Avatar`, `Modal`, `Label`, `Logo`, `Icon`, `Text` |
| **Molecules** | Combinaciones de átomos que forman una unidad funcional | `FormField` (Label + Input), `AlertMessage`, `NavItem`, `UserMenu` |
| **Organisms** | Secciones complejas compuestas de múltiples moléculas y átomos | `Header`, `Footer`, `LoginForm`, `InteractionTimeline`, `NewInteractionForm`, `EditInteractionForm`, `FilterPanel` |
| **Templates** | Layouts de página que definen la estructura general | `AuthTemplate` (para login), `DashboardTemplate` (para vistas protegidas) |
| **Pages** | Instancias de templates con datos reales | `LoginPage`, `ClientesPage`, `ClienteDetailPage`, `InteractionDetailPage`, `DashboardPage` (placeholder, no enrutada) |

### 2.3 Diagrama de Capas

```
┌─────────────────────────────────────────────────────┐
│                      Pages                          │
│  (LoginPage, ClientesPage, ClienteDetailPage, ...)  │
├─────────────────────────────────────────────────────┤
│                   Components                        │
│  (Templates → Organisms → Molecules → Atoms)        │
├──────────────────────┬──────────────────────────────┤
│    Hooks (queries/   │      Store (Zustand)         │
│    mutations)        │  (auth.store, ui.store)      │
├──────────────────────┼──────────────────────────────┤
│                   Services                          │
│  (auth, clients, interactions, metrics, users)      │
├─────────────────────────────────────────────────────┤
│                  API Client (Axios)                  │
│  (interceptores de auth, manejo de 401, timeout)    │
├─────────────────────────────────────────────────────┤
│                  Backend (Atenea Gateway)            │
│           ↓                    ↓                    │
│     Artemisa (Clientes)   Venus (Interacciones)     │
└─────────────────────────────────────────────────────┘
```

---

## 3. Configuración del Entorno

### 3.1 Variables de Entorno

La aplicación requiere las siguientes variables de entorno definidas en un archivo `.env`:

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `VITE_API_URL` | URL base del gateway (Atenea) | `http://localhost:8000/api/v1` |
| `VITE_APP_NAME` | Nombre de la aplicación | `StarrowCRM` |
| `VITE_APP_ENV` | Entorno actual | `development` |

### 3.2 Path Aliases

Se configuraron path aliases en `tsconfig.json` y `vite.config.ts` para simplificar los imports:

| Alias | Ruta real |
|-------|-----------|
| `@components/*` | `src/components/*` |
| `@pages/*` | `src/pages/*` |
| `@store/*` | `src/store/*` |
| `@services/*` | `src/services/*` |
| `@hooks/*` | `src/hooks/*` |
| `@app-types/*` | `src/types/*` |
| `@constants/*` | `src/constants/*` |
| `@utils/*` | `src/utils/*` |
| `@styles/*` | `src/styles/*` |
| `@assets/*` | `src/assets/*` |

### 3.3 Scripts Disponibles

| Script | Comando | Descripción |
|--------|---------|-------------|
| `dev` | `npm run dev` | Inicia el servidor de desarrollo en `http://localhost:5173` |
| `build` | `npm run build` | Compila TypeScript y genera el build de producción |
| `lint` | `npm run lint` | Ejecuta ESLint sobre el proyecto |
| `preview` | `npm run preview` | Sirve el build de producción localmente |
| `test` | `npm run test` | Ejecuta Vitest en modo watch |
| `test:run` | `npm run test:run` | Ejecuta los tests una sola vez |
| `test:coverage` | `npm run test:coverage` | Ejecuta tests con reporte de cobertura (umbral: 80% líneas y funciones) |

---

## 4. Routing y Navegación

### 4.1 Rutas Definidas

| Ruta | Componente | Protección | Descripción |
|------|------------|------------|-------------|
| `/login` | `LoginPage` | Pública (redirige a dashboard si ya está autenticado) | Formulario de inicio de sesión |
| `/dashboard` | `ClientesPage` | Protegida (requiere token) | Lista de clientes con métricas. `DashboardPage` es un placeholder no enrutado |
| `/dashboard/clientes/:id` | `ClienteDetailPage` | Protegida (requiere token) | Detalle de un cliente con historial de interacciones |
| `/dashboard/clientes/:clientId/interacciones/:interactionId` | `InteractionDetailPage` | Protegida (requiere token) | Detalle de una interacción con auditoría |
| `*` | — | — | Redirige a `/login` |

### 4.2 Guardias de Ruta

- **`PublicRoute`**: Permite acceso solo a usuarios no autenticados. Si el usuario ya tiene un token válido, redirige automáticamente a `/dashboard`.
- **`ProtectedRoute`**: Permite acceso solo a usuarios autenticados. Si no hay token, redirige a `/login`.

### 4.3 Lazy Loading

Todas las páginas se cargan de forma lazy con `React.lazy()` y `Suspense`, lo que reduce el bundle inicial y mejora el tiempo de carga:

```typescript
const LoginPage              = lazy(() => import('@pages/LoginPage/LoginPage'))
const ClientesPage           = lazy(() => import('@pages/ClientesPage/ClientesPage'))
const ClienteDetailPage      = lazy(() => import('@pages/ClienteDetailPage/ClienteDetailPage'))
const InteractionDetailPage  = lazy(() => import('@pages/InteractionDetailPage/InteractionDetailPage'))
```

---

## 5. Gestión de Estado

### 5.1 Estado Global — Zustand

#### `auth.store.ts` — Estado de Autenticación

| Propiedad / Método | Tipo | Descripción |
|--------------------|------|-------------|
| `token` | `string \| null` | JWT de autenticación |
| `user` | `User \| null` | Datos del usuario autenticado |
| `setAuth(token, user)` | Método | Almacena token y usuario tras login exitoso |
| `clearAuth()` | Método | Limpia token y usuario (logout o sesión expirada) |
| `isAuthenticated()` | Método | Retorna `true` si existe un token |

Se persiste automáticamente en `localStorage` bajo la clave `crm-auth` usando el middleware `persist` de Zustand.

#### `ui.store.ts` — Estado de UI

| Propiedad / Método | Tipo | Descripción |
|--------------------|------|-------------|
| `sidebarOpen` | `boolean` | Controla la visibilidad del sidebar |
| `activeModal` | `string \| null` | ID del modal actualmente abierto |
| `toggleSidebar()` | Método | Alterna el estado del sidebar |
| `openModal(id)` | Método | Abre un modal por su ID |
| `closeModal()` | Método | Cierra el modal activo |

### 5.2 Estado del Servidor — React Query

La aplicación usa **TanStack React Query** para manejar todo el estado proveniente del servidor (datos del backend). Se configura un `QueryClient` global en `main.tsx` con:

- **`retry: 1`** — Reintenta una vez las queries fallidas.
- **`staleTime: 60s`** — Los datos se consideran frescos durante 1 minuto por defecto.

Cada hook de query define su propio `staleTime` según la frecuencia de actualización esperada de los datos.

---

## 6. Capa de Servicios

### 6.1 Cliente HTTP (`api.client.ts`)

Se usa una instancia centralizada de Axios con:

- **Base URL** tomada de la variable de entorno `VITE_API_URL`.
- **Timeout** de 10 segundos.
- **Interceptor de request**: Inyecta automáticamente el header `Authorization: Bearer <token>` en cada petición.
- **Interceptor de response**: Si el backend retorna `401 Unauthorized` (y no es un endpoint de auth), limpia la sesión y redirige a `/login`.

### 6.2 Servicios Disponibles

#### `auth.service.ts` — Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `login(credentials)` | `POST /auth/login` | Autentica al usuario y retorna el token JWT |
| `logout()` | `POST /auth/logout` | Invalida la sesión actual |
| `getMe(token?)` | `GET /auth/me` | Obtiene los datos del usuario autenticado |

#### `clients.service.ts` — Clientes

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `list(params?)` | `GET /clients/` | Lista paginada de clientes con filtros opcionales |
| `getById(id)` | `GET /clients/:id` | Detalle de un cliente específico |

#### `interactions.service.ts` — Interacciones

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `create(payload)` | `POST /interactions/` | Crea una nueva interacción |
| `listByClient(clientId, params?)` | `GET /interactions/client/:clientId/` | Lista paginada de interacciones de un cliente |
| `getById(interactionId)` | `GET /interactions/:id/` | Detalle de una interacción |
| `update(interactionId, payload)` | `PUT /interactions/:id/` | Actualiza una interacción existente |
| `delete(interactionId)` | `DELETE /interactions/:id/` | Elimina (soft-delete) una interacción |
| `getClientSummary(clientId)` | `GET /interactions/client/:clientId/summary/` | Resumen de interacciones de un cliente |
| `getAuditLog(interactionId)` | `GET /interactions/:id/audit/` | Historial de auditoría de una interacción |

#### `metrics.service.ts` — Métricas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `getMetrics()` | `GET /interactions/metrics/` | Métricas globales (totales, promedios, por cliente) |

#### `users.service.ts` — Usuarios/Agentes

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `getAgentMap()` | `GET /users/` | Obtiene un mapa `{id: nombre}` de todos los agentes |

---

## 7. Custom Hooks

### 7.1 Query Hooks (lectura de datos)

| Hook | Servicio | Query Key | StaleTime | Descripción |
|------|----------|-----------|-----------|-------------|
| `useMe()` | `authService.getMe` | `['auth', 'me']` | 5 min | Datos del usuario autenticado |
| `useClients(params?)` | `clientsService.list` | `['clients', 'list', params]` | 2 min | Lista de clientes |
| `useClientDetail(id)` | `clientsService.getById` | `['clients', 'detail', id]` | 2 min | Detalle de un cliente |
| `useClientInteractions(clientId, params?)` | `interactionsService.listByClient` | `['interactions', 'client', clientId, params]` | 1 min | Interacciones de un cliente |
| `useMetrics()` | `metricsService.getMetrics` | `['metrics', 'global']` | 2 min | Métricas globales del CRM |
| `useAgentMap()` | `usersService.getAgentMap` | `['users', 'agentMap']` | 10 min | Mapa de IDs de agente a nombres |
| `useInteraction(interactionId)` | `interactionsService.getById` | `['interactions', 'detail', interactionId]` | 2 min | Detalle de una interacción |
| `useInteractionAudit(interactionId)` | `interactionsService.getAuditLog` | `['interactions', 'audit', interactionId]` | 2 min | Historial de auditoría de una interacción |
| `useClientSummary(clientId)` | `interactionsService.getClientSummary` | `['interactions', 'summary', clientId]` | 2 min | Resumen de interacciones de un cliente |

### 7.2 Mutation Hooks (escritura de datos)

| Hook | Servicio | Invalidaciones | Descripción |
|------|----------|----------------|-------------|
| `useLoginMutation()` | `authService.login` + `authService.getMe` | — | Login: obtiene token, luego datos del usuario |
| `useLogoutMutation()` | `authService.logout` | Limpia todo el cache de React Query + auth store (usa `onSettled`) | Cierra sesión |
| `useCreateInteraction()` | `interactionsService.create` | `metrics.*`, `interactions.*` | Crea interacción e invalida caché relacionado |
| `useUpdateInteraction()` | `interactionsService.update` | `metrics.*`, `interactions.*` | Actualiza interacción e invalida caché relacionado |
| `useDeleteInteraction()` | `interactionsService.delete` | `metrics.*`, `interactions.*` | Elimina (soft-delete) interacción e invalida caché relacionado |

### 7.3 Otros Hooks

| Hook | Descripción |
|------|-------------|
| `useRole()` | Retorna el rol del usuario actual y helpers booleanos (`isAdmin`, `isSoporte`, `isComercial`) |

---

## 8. Tipos e Interfaces

### 8.1 Tipos Genéricos (`api.types.ts`)

```typescript
interface ApiResponse<T> {
  success: boolean
  data:    T
  message?: string
}

interface ApiError {
  success: false
  error: { code: string; message: string }
}

interface PaginatedResponse<T> {
  items: T[]; total: number; page: number; page_size: number; pages: number
}
```

### 8.2 Tipos de Autenticación (`auth.types.ts`)

| Tipo | Campos |
|------|--------|
| `Role` | `'admin' \| 'soporte' \| 'comercial'` |
| `User` | `id`, `email`, `full_name`, `role`, `is_active?` |
| `LoginRequest` | `email`, `password` |
| `LoginResponse` | `success`, `data: { access_token, token_type }`, `message` |
| `MeResponse` | `success`, `data: User`, `message` |

### 8.3 Tipos de Cliente (`client.types.ts`)

| Tipo | Campos |
|------|--------|
| `ClientStatus` | `'active' \| 'inactive'` |
| `Client` | `id`, `company`, `email`, `phone`, `status`, `created_at`, `updated_at` |
| `ClientListData` | `items: Client[]`, `total`, `page`, `page_size`, `pages` |
| `ClientListParams` | `status?`, `page?`, `page_size?` |

### 8.4 Tipos de Interacción (`interaction.types.ts`)

| Tipo | Valores |
|------|---------|
| `InteractionType` | `'call' \| 'email' \| 'meeting' \| 'ticket' \| 'note'` |
| `InteractionChannel` | `'phone' \| 'email' \| 'whatsapp' \| 'in_person' \| 'platform'` |
| `InteractionStatus` | `'open' \| 'pending' \| 'in_progress' \| 'resolved' \| 'closed'` |

| Tipo | Campos principales |
|------|-------------------|
| `Interaction` | `id`, `client_id`, `agent_id`, `type`, `channel`, `subject`, `status`, `notes`, `internal_notes`, `outcome`, `interaction_date`, `follow_up_date`, `duration_minutes`, `is_deleted`, `last_edited_by`, `created_at`, `updated_at` |
| `CreateInteractionPayload` | `client_id`, `type`, `channel`, `subject`, `status`, `interaction_date`, `notes?`, `internal_notes?`, `outcome?`, `follow_up_date?`, `duration_minutes?` |
| `InteractionListParams` | `page?`, `page_size?`, `type?`, `status?`, `date_from?`, `date_to?`, `agent_id?`, `order_by?`, `order_dir?` |
| `UpdateInteractionPayload` | `type?`, `channel?`, `subject?`, `status?`, `notes?`, `internal_notes?`, `outcome?`, `follow_up_date?`, `duration_minutes?` |
| `AuditEntry` | `id`, `interaction_id`, `changed_by`, `action`, `changes`, `timestamp` |
| `ClientSummary` | `client_id`, `total_interactions`, `by_status: Record<InteractionStatus, number>`, `by_type: Record<InteractionType, number>`, `last_interaction_date` |
| `InteractionListData` | `items: Interaction[]`, `total`, `page`, `page_size`, `pages` |

### 8.5 Tipos de Métricas (`metrics.types.ts`)

| Tipo | Campos |
|------|--------|
| `ClientMetric` | `client_id`, `interaction_count`, `last_interaction_date` |
| `MetricsData` | `total_clients`, `total_interactions`, `avg_interactions_per_client`, `per_client: ClientMetric[]` |

---

## 9. Utilidades

### 9.1 Funciones de Formato (`format.utils.ts`)

| Función | Entrada | Salida | Ejemplo |
|---------|---------|--------|---------|
| `formatFullName(name)` | `string` | Capitalizada | `"juan pérez"` → `"Juan Pérez"` |
| `formatDate(date)` | `string \| Date` | Fecha en español | `"2025-03-15"` → `"15 de marzo de 2025"` |
| `formatInitials(name)` | `string` | Iniciales (máx 2) | `"Juan Pérez"` → `"JP"` |
| `formatRelativeDate(date)` | `string \| Date` | Fecha relativa | `"hoy"`, `"hace 3 días"`, `"hace 2 meses"` |
| `formatTime(date)` | `string \| Date` | Hora en formato 24h | `"14:30"` |
| `formatDuration(minutes)` | `number` | Duración legible | `90` → `"1h 30min"` |

### 9.2 Utilidades de Token (`token.utils.ts`)

| Función | Descripción |
|---------|-------------|
| `tokenUtils.get()` | Obtiene el token de `localStorage` |
| `tokenUtils.set(token)` | Guarda el token en `localStorage` |
| `tokenUtils.remove()` | Elimina el token de `localStorage` |

---

## 10. Constantes

### 10.1 Rutas (`routes.constants.ts`)

| Constante | Valor |
|-----------|-------|
| `ROUTES.LOGIN` | `/login` |
| `ROUTES.DASHBOARD` | `/dashboard` |
| `ROUTES.CLIENT_DETAIL` | `/dashboard/clientes/:id` |
| `ROUTES.INTERACTION_DETAIL` | `/dashboard/clientes/:clientId/interacciones/:interactionId` |

### 10.2 Roles (`roles.constants.ts`)

| Constante | Valor | Label |
|-----------|-------|-------|
| `ROLES.ADMIN` | `'admin'` | `"Administrador"` |
| `ROLES.SOPORTE` | `'soporte'` | `"Soporte"` |
| `ROLES.COMERCIAL` | `'comercial'` | `"Account Manager"` |

### 10.3 API (`api.constants.ts`)

| Constante | Fuente |
|-----------|--------|
| `API_URL` | `VITE_API_URL` |
| `APP_NAME` | `VITE_APP_NAME` |
| `APP_ENV` | `VITE_APP_ENV` |

---

## 11. Estilos

La aplicación usa **CSS Modules** para el encapsulamiento de estilos por componente. Cada componente tiene su archivo `.module.css` correspondiente.

### 11.1 Estilos Globales

| Archivo | Contenido |
|---------|-----------|
| `global.css` | Reset de estilos, tipografía base, estilos globales |
| `variables.css` | Variables CSS (colores, espaciados, fuentes) |
| `breakpoints.css` | Media queries para diseño responsive |

### 11.2 Convención de Nombres

- Los archivos de estilos siguen el formato `ComponentName.module.css`.
- Las clases se aplican vía `styles.className` para garantizar el scope local.
- En los tests, Vitest está configurado con `generateScopedName: '[local]'` para que los nombres de clase no se transformen.

---

## 12. Testing

### 12.1 Stack de Testing

| Herramienta | Versión | Propósito |
|-------------|---------|-----------|
| Vitest | 4.0.18 | Test runner |
| jsdom | 28.1.0 | Simulación de DOM |
| @testing-library/react | 16.3.2 | Renderizado y queries de componentes |
| @testing-library/jest-dom | 6.9.1 | Matchers extendidos para DOM (`toBeInTheDocument`, etc.) |
| @testing-library/user-event | 14.6.1 | Simulación de eventos de usuario |
| @vitest/coverage-v8 | 4.0.18 | Reporte de cobertura de código |

### 12.2 Configuración (`vitest.config.ts`)

- **Entorno**: `jsdom` para simular el navegador.
- **Globals**: `true` — `describe`, `it`, `expect`, `beforeEach` están disponibles globalmente sin necesidad de importarlos.
- **Setup**: `./src/tests/setup.ts` importa `@testing-library/jest-dom` para habilitar los matchers extendidos.
- **CSS Modules**: `generateScopedName: '[local]'` para que los nombres de clase no se transformen durante los tests.
- **Cobertura**: Umbral mínimo de **80%** en líneas y funciones.

### 12.3 Archivos de Test

| Archivo | Componente | # Tests |
|---------|------------|---------|
| `Button.test.tsx` | Button (atom) | — |
| `Input.test.tsx` | Input (atom) | — |
| `Spinner.test.tsx` | Spinner (atom) | — |
| `Text.test.tsx` | Text (atom) | — |
| `AlertMessage.test.tsx` | AlertMessage (molecule) | — |
| `FormField.test.tsx` | FormField (molecule) | — |
| `UserMenu.test.tsx` | UserMenu (molecule) | — |
| `Footer.test.tsx` | Footer (organism) | — |
| `Header.test.tsx` | Header (organism) | — |
| `LoginForm.test.tsx` | LoginForm (organism) | — |
| `InteractionTimeline.test.tsx` | InteractionTimeline (organism) | 30 |
| `LoginPage.test.tsx` | LoginPage (page) | — |
| `DashboardPage.test.tsx` | DashboardPage (page) | — |
| `ClientesPage.test.tsx` | ClientesPage (page) | 37 |

### 12.4 Comandos de Testing

```bash
# Ejecutar todos los tests una vez
npx vitest run

# Ejecutar con salida detallada
npx vitest run --reporter=verbose

# Ejecutar tests de un archivo específico
npx vitest run src/pages/ClientesPage/ClientesPage.test.tsx

# Ejecutar en modo watch (re-ejecuta al cambiar archivos)
npm run test

# Ejecutar con reporte de cobertura
npm run test:coverage
```

---

## 13. Integración con Backend

### 13.1 Arquitectura de Microservicios

El frontend (Afrodita) se comunica con el backend a través de un **API Gateway**:

```
Afrodita (Frontend)
    │
    ▼
Atenea (API Gateway — Django)      ← Autenticación, proxy de peticiones
    │           │
    ▼           ▼
Artemisa       Venus
(FastAPI)      (FastAPI)
Clientes       Interacciones
Usuarios       Métricas
```

### 13.2 Endpoints Consumidos

| Servicio Backend | Endpoint | Método | Descripción |
|------------------|----------|--------|-------------|
| Atenea | `/auth/login` | POST | Login con email y contraseña |
| Atenea | `/auth/logout` | POST | Cerrar sesión |
| Atenea | `/auth/me` | GET | Datos del usuario autenticado |
| Artemisa | `/clients/` | GET | Listar clientes (paginado) |
| Artemisa | `/clients/:id` | GET | Detalle de un cliente |
| Artemisa | `/users/` | GET | Listar usuarios/agentes |
| Venus | `/interactions/` | POST | Crear interacción |
| Venus | `/interactions/client/:id/` | GET | Interacciones de un cliente |
| Venus | `/interactions/metrics/` | GET | Métricas globales |
| Venus | `/interactions/:id/` | GET | Detalle de una interacción |
| Venus | `/interactions/:id/` | PUT | Actualizar una interacción |
| Venus | `/interactions/:id/` | DELETE | Eliminar una interacción |
| Venus | `/interactions/client/:id/summary/` | GET | Resumen de interacciones de un cliente |
| Venus | `/interactions/:id/audit/` | GET | Historial de auditoría de una interacción |

### 13.3 Flujo de Autenticación

1. El usuario ingresa sus credenciales en `/login`.
2. `useLoginMutation` llama a `POST /auth/login` y obtiene el `access_token`.
3. Con el token, se llama a `GET /auth/me` para obtener los datos del usuario.
4. El token y usuario se guardan en el store de Zustand (persistido en `localStorage`).
5. El interceptor de Axios inyecta el token en cada petición subsiguiente.
6. Si el backend retorna `401`, el interceptor limpia la sesión y redirige a `/login`.

---

## 14. Dependencias del Proyecto

### 14.1 Dependencias de Producción

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| `react` | ^19.2.0 | Librería de UI |
| `react-dom` | ^19.2.0 | Renderizado del DOM |
| `react-router-dom` | ^7.13.1 | Routing de la SPA |
| `@tanstack/react-query` | ^5.90.21 | Gestión de estado del servidor |
| `zustand` | ^5.0.11 | Estado global del cliente |
| `axios` | ^1.13.6 | Cliente HTTP |
| `react-hook-form` | ^7.71.2 | Gestión de formularios (solo `LoginForm`) |
| `@hookform/resolvers` | ^5.2.2 | Integración de validadores con RHF (solo `LoginForm`) |
| `zod` | ^4.3.6 | Validación de esquemas (solo `LoginForm`). `NewInteractionForm` y `EditInteractionForm` usan validación manual con `useState` |

### 14.2 Dependencias de Desarrollo

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| `vite` | ^7.3.1 | Bundler y servidor de desarrollo |
| `@vitejs/plugin-react` | ^5.1.1 | Plugin de React para Vite |
| `typescript` | ~5.9.3 | Tipado estático |
| `vitest` | ^4.0.18 | Test runner |
| `jsdom` | ^28.1.0 | DOM simulado para tests |
| `@testing-library/react` | ^16.3.2 | Utilidades de testing para React |
| `@testing-library/jest-dom` | ^6.9.1 | Matchers de DOM |
| `@testing-library/user-event` | ^14.6.1 | Simulación de eventos de usuario |
| `@vitest/coverage-v8` | ^4.0.18 | Cobertura de código |
| `eslint` | ^9.39.1 | Linter de código |
| `typescript-eslint` | ^8.48.0 | Reglas de ESLint para TypeScript |
| `eslint-plugin-react-hooks` | ^7.0.1 | Reglas para React Hooks |
| `eslint-plugin-react-refresh` | ^0.4.24 | Reglas para React Refresh |
