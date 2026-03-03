import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { AlertMessage } from './AlertMessage'

describe('AlertMessage', () => {
  it('renders error message', () => {
    render(<AlertMessage variant="error" message="Credenciales inválidas" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Credenciales inválidas')
  })

  it('renders success message', () => {
    render(<AlertMessage variant="success" message="Operación exitosa" />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('applies correct variant class', () => {
    const { container } = render(<AlertMessage variant="warning" message="Advertencia" />)
    expect((container.firstChild as HTMLElement)?.className).toContain('warning')
  })
})
