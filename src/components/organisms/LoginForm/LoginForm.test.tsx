import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LoginForm } from './LoginForm'

vi.mock('@hooks/mutations/useAuth.mutation', () => ({
  useLoginMutation: () => ({
    mutate: vi.fn(),
    isPending: false,
    isError: false,
    error: null,
  }),
}))

const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>
  )
}

describe('LoginForm', () => {
  it('renders email and password fields', () => {
    renderWithProviders(<LoginForm />)
    expect(screen.getByLabelText('Correo electrónico')).toBeInTheDocument()
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument()
  })

  it('renders submit button', () => {
    renderWithProviders(<LoginForm />)
    expect(screen.getByRole('button', { name: 'Iniciar sesión' })).toBeInTheDocument()
  })

  it('shows validation errors when submitting empty form', async () => {
    renderWithProviders(<LoginForm />)
    await userEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }))
    await waitFor(() => {
      expect(screen.getByText('El email es requerido')).toBeInTheDocument()
    })
  })

  it('shows invalid email error', async () => {
    renderWithProviders(<LoginForm />)
    await userEvent.type(screen.getByLabelText('Correo electrónico'), 'noesvalido')
    await userEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }))
    await waitFor(() => {
      expect(screen.getByText('Ingresa un email válido')).toBeInTheDocument()
    })
  })
})
