import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Spinner } from './Spinner'

describe('Spinner', () => {
  it('renders with accessible label', () => {
    render(<Spinner />)
    expect(screen.getByRole('status', { name: 'Cargando' })).toBeInTheDocument()
  })

  it('applies size classes correctly', () => {
    const { container } = render(<Spinner size="lg" />)
    expect((container.firstChild as HTMLElement)?.className).toContain('lg')
  })
})
