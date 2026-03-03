import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Header } from './Header'
import { useAuthStore } from '@store/auth.store'

vi.mock('@store/auth.store', () => ({
  useAuthStore: vi.fn(),
}))

vi.mock('@hooks/mutations/useAuth.mutation', () => ({
  useLogoutMutation: () => ({ mutate: vi.fn(), isPending: false }),
}))

const mockUser = {
  id: '1', email: 'a@b.com', full_name: 'Ana García', role: 'admin' as const, is_active: true,
}

const renderWithProviders = (ui: React.ReactElement) => {
  const qc = new QueryClient()
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>
  )
}

describe('Header', () => {
  it('renders logo text', () => {
    vi.mocked(useAuthStore).mockReturnValue(mockUser)
    renderWithProviders(<Header />)
    expect(screen.getByText('CRM')).toBeInTheDocument()
  })

  it('renders user name', () => {
    vi.mocked(useAuthStore).mockReturnValue(mockUser)
    renderWithProviders(<Header />)
    expect(screen.getByText('Ana García')).toBeInTheDocument()
  })

  it('returns null when no user', () => {
    vi.mocked(useAuthStore).mockReturnValue(null)
    const { container } = renderWithProviders(<Header />)
    expect(container.firstChild).toBeNull()
  })
})
