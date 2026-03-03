import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Footer } from './Footer'

// ── HU-08: Criterios de aceptación — Footer ──────────────────────────────────

describe('Footer — HU-08: Footer institucional', () => {

  describe('Visibilidad y estructura', () => {
    it('renderiza el footer como elemento semántico <footer>', () => {
      render(<Footer />)
      expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    })

    it('el footer es visible en el DOM', () => {
      render(<Footer />)
      const footer = screen.getByRole('contentinfo')
      expect(footer).toBeVisible()
    })
  })

  describe('Contenido del footer', () => {
    it('muestra el logo de StarrowCRM', () => {
      render(<Footer />)
      expect(screen.getByText('CRM')).toBeInTheDocument()
    })

    it('muestra el año actual en el copyright', () => {
      render(<Footer />)
      const year = new Date().getFullYear().toString()
      expect(screen.getByText(new RegExp(year))).toBeInTheDocument()
    })

    it('muestra el texto de copyright de Starrow CRM', () => {
      render(<Footer />)
      expect(screen.getByText(/Starrow CRM/i)).toBeInTheDocument()
    })

    it('muestra el texto de derechos reservados', () => {
      render(<Footer />)
      expect(screen.getByText(/Todos los derechos reservados/i)).toBeInTheDocument()
    })

    it('muestra descripción del sistema', () => {
      render(<Footer />)
      expect(
        screen.getByText(/Sistema de gestión/i)
      ).toBeInTheDocument()
    })
  })

  describe('No interferencia con el contenido', () => {
    it('el footer no contiene tabla ni elementos de datos', () => {
      render(<Footer />)
      expect(screen.queryByRole('table')).not.toBeInTheDocument()
    })

    it('el footer no contiene campos de formulario', () => {
      render(<Footer />)
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    })
  })
})
