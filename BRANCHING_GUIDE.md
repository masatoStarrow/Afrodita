# Guía de ramificación por Historia de Usuario

Todo el código actual está commiteado en `feat/HU-15-Historial-Filtrar`.
Esta guía explica qué archivos y cambios corresponden a cada HU para poder separarlos en ramas individuales si se necesita.

---

## Orden de dependencia

```
HU-09 → HU-10 → HU-11 → HU-12 → HU-13 → HU-14 → HU-15
```

Cada HU depende de la anterior. El flujo de merge sería: HU-09 → develop, luego HU-10 → develop, y así sucesivamente.

---

## HU-09 — Barra de navegación

**Rama:** `feat/HU-09-Barra-de-navegación`

**Archivos:**
- `src/constants/routes.constants.ts` — agregar `CLIENT_DETAIL: '/dashboard/clientes/:id'`
- `src/router/index.tsx` — agregar lazy import de `ClienteDetailPage` y registrar ruta protegida
- `src/pages/ClientesPage/ClientesPage.tsx` — agregar `useNavigate`, import de `ROUTES`, habilitar botón "Ver historial" con `navigate(ROUTES.CLIENT_DETAIL.replace(':id', client.id))`
- `src/pages/ClienteDetailPage/ClienteDetailPage.tsx` — crear con solo: imports, `ArrowLeftIcon`, componente con `DashboardTemplate` + `<nav>` breadcrumb "← Clientes"
- `src/pages/ClienteDetailPage/ClienteDetailPage.module.css` — solo estilos: `.breadcrumb`, `.backLink`, `.backLink:hover`

---

## HU-10 — Información del cliente

**Rama:** `feat/HU-10-Información-del-cliente`  
**Depende de:** HU-09

**Archivos a agregar sobre HU-09:**
- `src/services/clients.service.ts` — agregar método `getById(id)` que hace `GET /clients/:id`
- `src/hooks/queries/useClients.query.ts` — agregar `CLIENT_KEYS.detail()` y hook `useClientDetail(id)`
- `src/pages/ClienteDetailPage/ClienteDetailPage.tsx` — agregar:
  - Imports: `useParams`, `Spinner`, `AlertMessage`, `useClientDetail`, `formatDate`
  - Iconos: `BuildingIcon`, `MailIcon`, `PhoneIcon`, `CalendarIcon` (los SVGs del diseño)
  - Lógica: `useParams` para obtener `id`, `useClientDetail(id)` para fetch
  - JSX: estados de loading/error + tarjeta `.clientCard` con datos dinámicos del backend
- `src/pages/ClienteDetailPage/ClienteDetailPage.module.css` — agregar estilos: `.clientCard`, `.clientAvatar`, `.clientInfo`, `.clientName`, `.clientMeta`, `.stateContainer`

---

## HU-11 — Métrica Total interacciones

**Rama:** `feat/HU-11-Metrica-Total-interacciones`  
**Depende de:** HU-10

**Agregar sobre HU-10:**
- `ClienteDetailPage.tsx` — agregar:
  - `TotalInteractionsIcon` (SVG de `Container.svg` — chat bubble azul, fondo `#DBEAFE`)
  - `MOCK_TOTAL_INTERACTIONS = 45`
  - JSX: `.statsGrid` con 1 `.statCard` (label "Total interacciones")
- `ClienteDetailPage.module.css` — agregar estilos: `.statsGrid`, `.statCard`, `.statContent`, `.statLabel`, `.statValue` + responsive `.statsGrid` 1 columna

---

## HU-12 — Métrica Últimos 30 días

**Rama:** `feat/HU-12-Metrica-Ultimos-30-dias`  
**Depende de:** HU-11

**Agregar sobre HU-11:**
- `ClienteDetailPage.tsx` — agregar:
  - `Last30DaysIcon` (SVG de `Container (1).svg` — trend up, fondo `#CEFAFE`, trazo `#0092B8`)
  - `MOCK_LAST_30_DAYS = 45`
  - JSX: segunda `.statCard` en el grid (label "Últimos 30 días")

---

## HU-13 — Métrica Tasa de completado

**Rama:** `feat/HU-13-Metrica-Tasa-de-completado`  
**Depende de:** HU-12

**Agregar sobre HU-12:**
- `ClienteDetailPage.tsx` — agregar:
  - `CompletionRateIcon` (SVG de `Container (2).svg` — pulso, fondo `#D0FAE5`, trazo `#009966`)
  - `MOCK_COMPLETION_RATE = '0%'`
  - JSX: tercera `.statCard` en el grid (label "Tasa de completado")

---

## HU-14 — Historial número de interacciones

**Rama:** `feat/HU-14-Historial-Numero-de-interacciones-encontradas`  
**Depende de:** HU-13

**Agregar sobre HU-13:**
- `ClienteDetailPage.tsx` — agregar:
  - `MOCK_HISTORY_COUNT = 45`
  - JSX: sección `.historySection` con header que contiene título "Historial de interacciones" y texto "45 interacciones encontradas"
- `ClienteDetailPage.module.css` — agregar estilos: `.historySection`, `.historyHeader`, `.historyTitleGroup`, `.historyTitle`, `.historyCount`

---

## HU-15 — Historial Filtrar

**Rama:** `feat/HU-15-Historial-Filtrar`  
**Depende de:** HU-14

**Agregar sobre HU-14:**
- `ClienteDetailPage.tsx` — agregar:
  - Import: `useState`
  - Iconos: `FilterIcon` (SVG de `Group.svg`), `CloseIcon`
  - Constantes: `FILTER_TYPES`, `FILTER_STATUSES`
  - State: `showFilters`, `filterDateFrom`, `filterDateTo`, `filterType`, `filterStatus`, `filterAgent`
  - Lógica: `hasActiveFilters`, `handleClearFilters`
  - JSX: `.historyActions` con botón "Filtros" + panel `.filtersPanel` con campos (fecha desde/hasta, tipo, estado, agente) + botón "Limpiar filtros"
- `ClienteDetailPage.module.css` — agregar estilos: `.historyActions`, `.filterBtn`, `.filterBtnActive`, `.filtersPanel`, `.filtersGrid`, `.filterField`, `.filterLabel`, `.filterInput`, `.clearFiltersBtn` + responsive
