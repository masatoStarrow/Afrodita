import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import DashboardPage from './DashboardPage'

vi.mock('@store/auth.store', () => ({
  useAuthStore: vi.fn(() => ({ full_name: 'Ana García', role: 'admin' })),
}))

vi.mock('@hooks/mutations/useAuth.mutation', () => ({
  useLogoutMutation: () => ({ mutate: vi.fn(), isPending: false }),
}))

describe('DashboardPage', () => {
  it('renders welcome message', () => {
    const qc = new QueryClient()
    render(
      <QueryClientProvider client={qc}>
        <MemoryRouter>
          <DashboardPage />
        </MemoryRouter>
      </QueryClientProvider>
    )
    expect(screen.getByText(/Bienvenido/i)).toBeInTheDocument()
  })
})
