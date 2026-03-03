import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { UserMenu } from './UserMenu'
import type { User } from '@app-types/auth.types'

const mockUser: User = {
  id:        '1',
  email:     'admin@empresa.com',
  full_name: 'Carlos López',
  role:      'admin',
  is_active: true,
}

describe('UserMenu', () => {
  it('renders user name', () => {
    render(<UserMenu user={mockUser} onLogout={vi.fn()} />)
    expect(screen.getByText('Carlos López')).toBeInTheDocument()
  })

  it('shows dropdown on click', async () => {
    render(<UserMenu user={mockUser} onLogout={vi.fn()} />)
    await userEvent.click(screen.getByRole('button', { name: /carlos/i }))
    expect(screen.getByRole('menu')).toBeInTheDocument()
  })

  it('calls onLogout when logout button is clicked', async () => {
    const onLogout = vi.fn()
    render(<UserMenu user={mockUser} onLogout={onLogout} />)
    await userEvent.click(screen.getByRole('button', { name: /carlos/i }))
    await userEvent.click(screen.getByText('Cerrar sesión'))
    expect(onLogout).toHaveBeenCalledTimes(1)
  })
})
