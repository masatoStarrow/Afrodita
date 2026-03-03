import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Header } from './Header'
import { useAuthStore } from '@store/auth.store'
import type { User } from '@app-types/auth.types'

vi.mock('@store/auth.store', () => ({
  useAuthStore: vi.fn(),
}))

const mockLogout = vi.fn()
vi.mock('@hooks/mutations/useAuth.mutation', () => ({
  useLogoutMutation: () => ({ mutate: mockLogout, isPending: false }),
}))

const makeUser = (role: User['role'] = 'admin'): User => ({
  id:        '1',
  email:     'usuario@crm.com',
  full_name: 'Ana García',
  role,
  is_active: true,
})

const renderHeader = (user: User | null = makeUser()) => {
  vi.mocked(useAuthStore).mockReturnValue(user)
  const qc = new QueryClient()
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    </QueryClientProvider>
  )
}

// ── HU-03: Criterios de aceptación — Header del módulo Clientes ─────────────

describe('Header — HU-03: Header del módulo Clientes', () => {

  describe('Elementos de identidad', () => {
    it('muestra el logo de StarrowCRM', () => {
      renderHeader()
      expect(screen.getByText('CRM')).toBeInTheDocument()
    })

    it('muestra el nombre del módulo activo "Clientes"', () => {
      renderHeader()
      expect(screen.getByText('Clientes')).toBeInTheDocument()
    })
  })

  describe('Información del usuario', () => {
    it('muestra el nombre del usuario logueado', () => {
      renderHeader()
      expect(screen.getByText('Ana García')).toBeInTheDocument()
    })

    it('muestra el rol "Administrador" para el rol admin', () => {
      renderHeader(makeUser('admin'))
      expect(screen.getByText('Administrador')).toBeInTheDocument()
    })

    it('muestra el rol "Soporte" para el rol soporte', () => {
      renderHeader(makeUser('soporte'))
      expect(screen.getByText('Soporte')).toBeInTheDocument()
    })

    it('muestra el rol "Account Manager" para el rol comercial', () => {
      renderHeader(makeUser('comercial'))
      expect(screen.getByText('Account Manager')).toBeInTheDocument()
    })
  })

  describe('Navegación y sesión', () => {
    it('muestra el botón "Salir"', () => {
      renderHeader()
      expect(screen.getByRole('button', { name: /Cerrar sesión/i })).toBeInTheDocument()
    })

    it('llama a logout al hacer clic en "Salir"', async () => {
      renderHeader()
      await userEvent.click(screen.getByRole('button', { name: /Cerrar sesión/i }))
      expect(mockLogout).toHaveBeenCalledTimes(1)
    })

    it('muestra el enlace de navegación a Clientes', () => {
      renderHeader()
      expect(screen.getByRole('link', { name: /Clientes/i })).toBeInTheDocument()
    })
  })

  describe('Visibilidad', () => {
    it('no renderiza nada si no hay usuario logueado', () => {
      const { container } = renderHeader(null)
      expect(container.firstChild).toBeNull()
    })

    it('renderiza el header como elemento <header>', () => {
      renderHeader()
      expect(screen.getByRole('banner')).toBeInTheDocument()
    })
  })
})
