import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Text } from './Text'

describe('Text', () => {
  it('renders children correctly', () => {
    render(<Text>Hola mundo</Text>)
    expect(screen.getByText('Hola mundo')).toBeInTheDocument()
  })

  it('renders as custom tag', () => {
    render(<Text as="h1">Título</Text>)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('applies variant class', () => {
    const { container } = render(<Text variant="heading">Título</Text>)
    expect((container.firstChild as HTMLElement)?.className).toContain('heading')
  })
})
