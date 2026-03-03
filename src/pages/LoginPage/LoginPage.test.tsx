import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import LoginPage from './LoginPage'

vi.mock('@hooks/mutations/useAuth.mutation', () => ({
  useLoginMutation: () => ({
    mutate:    vi.fn(),
    isPending: false,
    isError:   false,
    error:     null,
    reset:     vi.fn(),
  }),
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => vi.fn() }
})

const renderPage = () => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    </QueryClientProvider>
  )
}

// ── HU-01: Criterios de aceptación — Pantalla de login completa ─────────────

describe('LoginPage — HU-01: Pantalla de inicio de sesión', () => {

  it('muestra el logo de StarrowCRM', () => {
    renderPage()
    expect(screen.getByText('Starrow')).toBeInTheDocument()
    expect(screen.getByText('CRM')).toBeInTheDocument()
  })

  it('muestra el título "Bienvenido de vuelta"', () => {
    renderPage()
    expect(screen.getByText('Bienvenido de vuelta')).toBeInTheDocument()
  })

  it('muestra el texto introductorio correcto', () => {
    renderPage()
    expect(
      screen.getByText('Ingresa tus credenciales para acceder al sistema')
    ).toBeInTheDocument()
  })

  it('muestra el campo de correo electrónico', () => {
    renderPage()
    expect(screen.getByLabelText('Correo electrónico')).toBeInTheDocument()
  })

  it('muestra el campo de contraseña', () => {
    renderPage()
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument()
  })

  it('muestra el botón de inicio de sesión', () => {
    renderPage()
    expect(screen.getByRole('button', { name: 'Iniciar sesión' })).toBeInTheDocument()
  })

  it('renderiza el formulario de login dentro de la plantilla de autenticación', () => {
    renderPage()
    expect(screen.getByRole('button', { name: 'Iniciar sesión' })).toBeInTheDocument()
    expect(screen.getByLabelText('Correo electrónico')).toBeInTheDocument()
  })
})
