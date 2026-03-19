import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ClientesPage from './ClientesPage'
import type { ClientListData } from '@app-types/client.types'
import type { MetricsData } from '@app-types/metrics.types'

// ── Mocks de dependencias ────────────────────────────────────────────────────

vi.mock('@store/auth.store', () => ({
  useAuthStore: vi.fn(() => ({
    id:        '1',
    email:     'admin@crm.com',
    full_name: 'Ana García',
    role:      'admin',
    is_active: true,
  })),
}))

vi.mock('@hooks/mutations/useAuth.mutation', () => ({
  useLogoutMutation: () => ({ mutate: vi.fn(), isPending: false }),
}))

let mockClientsState = {
  data:      undefined as ClientListData | undefined,
  isLoading: false,
  isError:   false,
  error:     null as unknown,
}

vi.mock('@hooks/queries/useClients.query', () => ({
  useClients: () => mockClientsState,
}))

let mockMetricsState = {
  data:      undefined as MetricsData | undefined,
  isLoading: false,
}

vi.mock('@hooks/queries/useMetrics.query', () => ({
  useMetrics: () => mockMetricsState,
}))

// ── Datos de prueba ──────────────────────────────────────────────────────────

const mockClients: ClientListData = {
  items: [
    {
      id:         'uuid-1',
      company:    'Tech Solutions S.A.S',
      email:      'contacto@techsolutions.com',
      phone:      '3001234567',
      status:     'active',
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
    },
    {
      id:         'uuid-2',
      company:    'Distribuidora Norte',
      email:      'info@distrinorte.com',
      phone:      null,
      status:     'inactive',
      created_at: '2025-01-02T00:00:00Z',
      updated_at: '2025-01-02T00:00:00Z',
    },
    {
      id:         'uuid-3',
      company:    'Marketing Digital XYZ',
      email:      'hola@marketingxyz.com',
      phone:      '3109876543',
      status:     'active',
      created_at: '2025-01-03T00:00:00Z',
      updated_at: '2025-01-03T00:00:00Z',
    },
  ],
  total:     3,
  page:      1,
  page_size: 100,
  pages:     1,
}

const mockMetrics: MetricsData = {
  total_clients:              3,
  total_interactions:         12,
  avg_interactions_per_client: 4,
  per_client: [
    { client_id: 'uuid-1', interaction_count: 5, last_interaction_date: '2026-03-15T10:00:00Z' },
    { client_id: 'uuid-2', interaction_count: 3, last_interaction_date: '2026-03-10T14:00:00Z' },
    { client_id: 'uuid-3', interaction_count: 4, last_interaction_date: null },
  ],
}

const renderPage = () => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <ClientesPage />
      </MemoryRouter>
    </QueryClientProvider>
  )
}

beforeEach(() => {
  mockClientsState = {
    data:      undefined,
    isLoading: false,
    isError:   false,
    error:     null,
  }
  mockMetricsState = {
    data:      undefined,
    isLoading: false,
  }
})

// ── HU-05: Módulo de clientes ────────────────────────────────────────────────

describe('ClientesPage — HU-05: Módulo de clientes', () => {

  describe('Carga de datos', () => {
    it('muestra spinner mientras se cargan los clientes', () => {
      mockClientsState.isLoading = true
      renderPage()
      expect(screen.getByRole('status')).toBeInTheDocument()
    })

    it('muestra la tabla cuando los datos están disponibles', () => {
      mockClientsState.data = mockClients
      renderPage()
      expect(screen.getByRole('table')).toBeInTheDocument()
    })

    it('carga la lista automáticamente al ingresar al módulo', () => {
      mockClientsState.data = mockClients
      renderPage()
      expect(screen.getByText('Tech Solutions S.A.S')).toBeInTheDocument()
    })
  })

  describe('Columnas de la tabla', () => {
    beforeEach(() => { mockClientsState.data = mockClients })

    it('muestra la columna "Cliente"', () => {
      renderPage()
      expect(screen.getByRole('columnheader', { name: 'Cliente' })).toBeInTheDocument()
    })

    it('muestra la columna "Contacto"', () => {
      renderPage()
      expect(screen.getByRole('columnheader', { name: 'Contacto' })).toBeInTheDocument()
    })

    it('muestra la columna "Teléfono"', () => {
      renderPage()
      expect(screen.getByRole('columnheader', { name: 'Teléfono' })).toBeInTheDocument()
    })

    it('muestra la columna "Última interacción"', () => {
      renderPage()
      expect(screen.getByRole('columnheader', { name: 'Última interacción' })).toBeInTheDocument()
    })

    it('muestra la columna "# Interacción"', () => {
      renderPage()
      expect(screen.getByRole('columnheader', { name: '# Interacción' })).toBeInTheDocument()
    })
  })

  describe('Datos de los clientes', () => {
    beforeEach(() => { mockClientsState.data = mockClients })

    it('muestra el nombre de empresa de cada cliente', () => {
      renderPage()
      expect(screen.getByText('Tech Solutions S.A.S')).toBeInTheDocument()
      expect(screen.getByText('Distribuidora Norte')).toBeInTheDocument()
    })

    it('muestra el correo de contacto de cada cliente', () => {
      renderPage()
      expect(screen.getByText('contacto@techsolutions.com')).toBeInTheDocument()
      expect(screen.getByText('info@distrinorte.com')).toBeInTheDocument()
    })

    it('muestra el teléfono del cliente cuando está disponible', () => {
      renderPage()
      expect(screen.getByText('3001234567')).toBeInTheDocument()
    })

    it('muestra "—" cuando el cliente no tiene teléfono', () => {
      renderPage()
      const cells = screen.getAllByText('—')
      expect(cells.length).toBeGreaterThan(0)
    })

    it('muestra badge "Activo" para clientes activos', () => {
      renderPage()
      const badges = screen.getAllByText('Activo')
      expect(badges.length).toBeGreaterThan(0)
    })

    it('muestra badge "Inactivo" para clientes inactivos', () => {
      renderPage()
      expect(screen.getByText('Inactivo')).toBeInTheDocument()
    })
  })

  describe('Contador de clientes', () => {
    it('muestra el total de clientes encontrados', () => {
      mockClientsState.data = mockClients
      renderPage()
      expect(screen.getByText(/3 clientes encontrados/i)).toBeInTheDocument()
    })

    it('muestra "1 cliente encontrado" en singular', () => {
      mockClientsState.data = { ...mockClients, items: [mockClients.items[0]], total: 1 }
      renderPage()
      expect(screen.getByText('1 cliente encontrado')).toBeInTheDocument()
    })
  })

  describe('Estado de error', () => {
    it('muestra mensaje de error si falla la carga de clientes', () => {
      mockClientsState.isError = true
      mockClientsState.error   = { response: { data: { error: { message: 'Error del servidor' } } } }
      renderPage()
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    it('no muestra la tabla cuando hay error', () => {
      mockClientsState.isError = true
      mockClientsState.error   = {}
      renderPage()
      expect(screen.queryByRole('table')).not.toBeInTheDocument()
    })
  })
})

// ── HU-06: Buscador de clientes ──────────────────────────────────────────────

describe('ClientesPage — HU-06: Buscador de clientes', () => {

  beforeEach(() => { mockClientsState.data = mockClients })

  it('muestra el campo de búsqueda con placeholder "Buscar clientes..."', () => {
    renderPage()
    expect(
      screen.getByPlaceholderText('Buscar clientes...')
    ).toBeInTheDocument()
  })

  it('el campo de búsqueda tiene aria-label accesible', () => {
    renderPage()
    expect(screen.getByRole('searchbox', { name: 'Buscar clientes' })).toBeInTheDocument()
  })

  it('filtra clientes por nombre de empresa', async () => {
    renderPage()
    await userEvent.type(screen.getByPlaceholderText('Buscar clientes...'), 'Tech')
    await waitFor(() => {
      expect(screen.getByText('Tech Solutions S.A.S')).toBeInTheDocument()
      expect(screen.queryByText('Distribuidora Norte')).not.toBeInTheDocument()
    })
  })

  it('filtra clientes por correo electrónico', async () => {
    renderPage()
    await userEvent.type(screen.getByPlaceholderText('Buscar clientes...'), 'distrinorte')
    await waitFor(() => {
      expect(screen.getByText('Distribuidora Norte')).toBeInTheDocument()
      expect(screen.queryByText('Tech Solutions S.A.S')).not.toBeInTheDocument()
    })
  })

  it('la búsqueda no distingue entre mayúsculas y minúsculas', async () => {
    renderPage()
    await userEvent.type(screen.getByPlaceholderText('Buscar clientes...'), 'TECH')
    await waitFor(() => {
      expect(screen.getByText('Tech Solutions S.A.S')).toBeInTheDocument()
    })
  })

  it('actualiza el contador al filtrar', async () => {
    renderPage()
    await userEvent.type(screen.getByPlaceholderText('Buscar clientes...'), 'Tech')
    await waitFor(() => {
      expect(screen.getByText('1 cliente encontrado')).toBeInTheDocument()
    })
  })

  it('muestra mensaje de vacío cuando no hay resultados', async () => {
    renderPage()
    await userEvent.type(screen.getByPlaceholderText('Buscar clientes...'), 'xyzinexistente')
    await waitFor(() => {
      expect(
        screen.getByText(/No se encontraron clientes/i)
      ).toBeInTheDocument()
    })
  })

  it('incluye el término buscado en el mensaje de sin resultados', async () => {
    renderPage()
    await userEvent.type(screen.getByPlaceholderText('Buscar clientes...'), 'inexistente')
    await waitFor(() => {
      expect(
        screen.getByText(/No se encontraron clientes para "inexistente"/i)
      ).toBeInTheDocument()
    })
  })
})

// ── HU-07: Ver el historial de cada cliente ──────────────────────────────────

describe('ClientesPage — HU-07: Ver el historial de cada cliente', () => {

  beforeEach(() => { mockClientsState.data = mockClients })

  it('muestra un botón "Ver historial" en cada fila de cliente', () => {
    renderPage()
    const historialBtns = screen.getAllByRole('button', { name: /Ver historial/i })
    expect(historialBtns).toHaveLength(mockClients.items.length)
  })

  it('el botón "Ver historial" está presente para clientes activos', () => {
    renderPage()
    const rows = screen.getAllByRole('row').slice(1)
    const activeRow = within(rows[0]).getByRole('button', { name: /Ver historial/i })
    expect(activeRow).toBeInTheDocument()
  })

  it('el botón "Ver historial" está presente para clientes inactivos', () => {
    renderPage()
    const rows = screen.getAllByRole('row').slice(1)
    const inactiveRow = within(rows[1]).getByRole('button', { name: /Ver historial/i })
    expect(inactiveRow).toBeInTheDocument()
  })
})

// ── Integración con métricas reales (reemplazo de datos mock) ────────────────

describe('ClientesPage — Datos de interacciones desde backend', () => {

  beforeEach(() => {
    mockClientsState.data = mockClients
    mockMetricsState.data = mockMetrics
  })

  it('muestra el conteo real de interacciones por cliente', () => {
    renderPage()
    const rows = screen.getAllByRole('row').slice(1)
    expect(within(rows[0]).getByText('5')).toBeInTheDocument()
    expect(within(rows[1]).getByText('3')).toBeInTheDocument()
    expect(within(rows[2]).getByText('4')).toBeInTheDocument()
  })

  it('muestra 0 interacciones si el cliente no tiene métricas', () => {
    mockMetricsState.data = { ...mockMetrics, per_client: [] }
    renderPage()
    const zeros = screen.getAllByText('0')
    expect(zeros).toHaveLength(mockClients.items.length)
  })

  it('muestra la fecha relativa de última interacción cuando existe', () => {
    renderPage()
    const rows = screen.getAllByRole('row').slice(1)
    expect(within(rows[0]).getByText(/hace/i)).toBeInTheDocument()
  })

  it('muestra "—" si el cliente no tiene fecha de última interacción', () => {
    renderPage()
    const rows = screen.getAllByRole('row').slice(1)
    const thirdRow = rows[2]
    const dashes = within(thirdRow).getAllByText('—')
    expect(dashes.length).toBeGreaterThan(0)
  })

  it('muestra las tarjetas de métricas globales', () => {
    renderPage()
    expect(screen.getByText('Total de clientes')).toBeInTheDocument()
    expect(screen.getByText('Interacciones totales')).toBeInTheDocument()
    expect(screen.getByText('Promedio por cliente')).toBeInTheDocument()
  })

  it('muestra el valor real de interacciones totales en la tarjeta', () => {
    renderPage()
    expect(screen.getByText('12')).toBeInTheDocument()
  })

  it('muestra el promedio real por cliente en la tarjeta', () => {
    renderPage()
    const allFours = screen.getAllByText('4')
    expect(allFours.length).toBeGreaterThanOrEqual(1)
  })

  it('muestra "..." mientras las métricas están cargando', () => {
    mockMetricsState.isLoading = true
    mockMetricsState.data = undefined
    renderPage()
    const loadingIndicators = screen.getAllByText('...')
    expect(loadingIndicators.length).toBeGreaterThanOrEqual(2)
  })
})
