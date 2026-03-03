import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import axios from 'axios'
import { LoginForm } from './LoginForm'

// Estado mutable para controlar el mock entre tests
let mockMutationState = {
  mutate:     vi.fn(),
  isPending:  false,
  isError:    false,
  error:      null as unknown,
  reset:      vi.fn(),
}

vi.mock('@hooks/mutations/useAuth.mutation', () => ({
  useLoginMutation: () => mockMutationState,
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => vi.fn() }
})

const renderForm = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    </QueryClientProvider>
  )
}

const makeAxiosError = (status: number, data: object = {}) => {
  const err = new Error() as Error & { isAxiosError: boolean; response: object }
  err.isAxiosError = true
  err.response     = { status, data }
  vi.spyOn(axios, 'isAxiosError').mockReturnValue(true)
  return err
}

beforeEach(() => {
  mockMutationState = {
    mutate:    vi.fn(),
    isPending: false,
    isError:   false,
    error:     null,
    reset:     vi.fn(),
  }
  vi.restoreAllMocks()
})

// ── HU-01: Criterios de aceptación — Información general ────────────────────

describe('LoginForm — HU-01: Información general', () => {

  describe('Estructura visual', () => {
    it('muestra el título "Bienvenido de vuelta"', () => {
      renderForm()
      expect(screen.getByText('Bienvenido de vuelta')).toBeInTheDocument()
    })

    it('muestra el texto introductorio de credenciales', () => {
      renderForm()
      expect(
        screen.getByText('Ingresa tus credenciales para acceder al sistema')
      ).toBeInTheDocument()
    })

    it('muestra el campo de correo electrónico', () => {
      renderForm()
      expect(screen.getByLabelText('Correo electrónico')).toBeInTheDocument()
    })

    it('muestra el campo de contraseña', () => {
      renderForm()
      expect(screen.getByLabelText('Contraseña')).toBeInTheDocument()
    })

    it('muestra el botón de iniciar sesión', () => {
      renderForm()
      expect(screen.getByRole('button', { name: 'Iniciar sesión' })).toBeInTheDocument()
    })

    it('el campo de contraseña es de tipo password', () => {
      renderForm()
      expect(screen.getByLabelText('Contraseña')).toHaveAttribute('type', 'password')
    })
  })

  describe('Validaciones del formulario', () => {
    it('muestra error cuando el email está vacío', async () => {
      renderForm()
      await userEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }))
      await waitFor(() => {
        expect(screen.getByText('El email es requerido')).toBeInTheDocument()
      })
    })

    it('muestra error cuando el email no tiene formato válido', async () => {
      renderForm()
      await userEvent.type(screen.getByLabelText('Correo electrónico'), 'noesvalido')
      await userEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }))
      await waitFor(() => {
        expect(screen.getByText('Ingresa un email válido')).toBeInTheDocument()
      })
    })

    it('muestra error cuando la contraseña está vacía', async () => {
      renderForm()
      await userEvent.type(screen.getByLabelText('Correo electrónico'), 'user@test.com')
      await userEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }))
      await waitFor(() => {
        expect(screen.getByText('La contraseña es requerida')).toBeInTheDocument()
      })
    })

    it('muestra error cuando la contraseña tiene menos de 6 caracteres', async () => {
      renderForm()
      await userEvent.type(screen.getByLabelText('Correo electrónico'), 'user@test.com')
      await userEvent.type(screen.getByLabelText('Contraseña'), 'abc')
      await userEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }))
      await waitFor(() => {
        expect(screen.getByText('Mínimo 6 caracteres')).toBeInTheDocument()
      })
    })

    it('no muestra errores de validación con datos correctos', async () => {
      renderForm()
      await userEvent.type(screen.getByLabelText('Correo electrónico'), 'admin@crm.com')
      await userEvent.type(screen.getByLabelText('Contraseña'), 'Password1!')
      await userEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }))
      await waitFor(() => {
        expect(screen.queryByText('El email es requerido')).not.toBeInTheDocument()
        expect(screen.queryByText('La contraseña es requerida')).not.toBeInTheDocument()
      })
    })
  })

  describe('Mensajes de error del servidor', () => {
    it('muestra "Correo o contraseña incorrectos" en error 401', () => {
      mockMutationState.isError = true
      mockMutationState.error   = makeAxiosError(401)
      renderForm()
      expect(screen.getByText('Correo o contraseña incorrectos.')).toBeInTheDocument()
    })

    it('muestra mensaje de rate limit en error 429', () => {
      mockMutationState.isError = true
      mockMutationState.error   = makeAxiosError(429, { error: { code: 'RATE_LIMIT_EXCEEDED' } })
      renderForm()
      expect(
        screen.getByText(/Demasiados intentos fallidos/i)
      ).toBeInTheDocument()
    })

    it('muestra error de conexión cuando no hay respuesta del servidor', () => {
      const err = new Error() as Error & { isAxiosError: boolean; response: undefined }
      err.isAxiosError = true
      err.response     = undefined
      vi.spyOn(axios, 'isAxiosError').mockReturnValue(true)
      mockMutationState.isError = true
      mockMutationState.error   = err
      renderForm()
      expect(
        screen.getByText(/No se pudo conectar con el servidor/i)
      ).toBeInTheDocument()
    })

    it('llama a mutate con email y contraseña al enviar el formulario', async () => {
      renderForm()
      await userEvent.type(screen.getByLabelText('Correo electrónico'), 'admin@crm.com')
      await userEvent.type(screen.getByLabelText('Contraseña'), 'Password1!')
      await userEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }))
      await waitFor(() => {
        expect(mockMutationState.mutate).toHaveBeenCalledWith(
          { email: 'admin@crm.com', password: 'Password1!' },
          expect.any(Object)
        )
      })
    })

    it('deshabilita el botón mientras se procesa la petición', () => {
      mockMutationState.isPending = true
      renderForm()
      const btn = screen.getByRole('button', { name: /Cargando/i })
      expect(btn).toBeDisabled()
      expect(btn).toHaveAttribute('aria-busy', 'true')
    })
  })
})
