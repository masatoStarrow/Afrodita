import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { Input } from './Input'

describe('Input', () => {
  it('renders correctly', () => {
    render(<Input placeholder="Escribe aquí" />)
    expect(screen.getByPlaceholderText('Escribe aquí')).toBeInTheDocument()
  })

  it('accepts user input', async () => {
    render(<Input placeholder="Email" />)
    const input = screen.getByPlaceholderText('Email')
    await userEvent.type(input, 'test@email.com')
    expect(input).toHaveValue('test@email.com')
  })

  it('shows aria-invalid when error is provided', () => {
    render(<Input error="Campo requerido" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('renders as password type', () => {
    render(<Input type="password" />)
    expect(document.querySelector('input[type="password"]')).toBeInTheDocument()
  })
})
