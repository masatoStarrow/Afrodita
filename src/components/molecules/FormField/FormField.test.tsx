import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { FormField } from './FormField'

describe('FormField', () => {
  it('renders label and input', () => {
    render(<FormField label="Email" fieldId="email" />)
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
  })

  it('shows error message when provided', () => {
    render(<FormField label="Email" fieldId="email" errorMessage="Campo requerido" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Campo requerido')
  })

  it('associates label with input via htmlFor', () => {
    render(<FormField label="Contraseña" fieldId="password" type="password" />)
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument()
  })

  it('marks input as required when prop is set', () => {
    render(<FormField label="Email" fieldId="email" required />)
    expect(screen.getByText('*')).toBeInTheDocument()
  })
})
