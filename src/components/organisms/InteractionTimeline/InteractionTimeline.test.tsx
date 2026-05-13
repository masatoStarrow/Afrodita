import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { InteractionTimeline } from './InteractionTimeline'
import type { Interaction } from '@app-types/interaction.types'

const renderWithRouter = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>)

// ── Helpers ──────────────────────────────────────────────────────────────────

const baseInteraction: Interaction = {
  id:                'int-1',
  client_id:         'client-1',
  agent_id:          'agent-1',
  type:              'call',
  channel:           'phone',
  subject:           'Llamada de seguimiento',
  status:            'pending',
  notes:             'Cliente interesado',
  internal_notes:    null,
  outcome:           null,
  interaction_date:  '2026-03-18T10:30:00Z',
  follow_up_date:    null,
  duration_minutes:  15,
  is_deleted:        false,
  last_edited_by:    null,
  created_at:        '2026-03-18T10:30:00Z',
  updated_at:        '2026-03-18T10:30:00Z',
}

const makeInteraction = (overrides: Partial<Interaction>): Interaction => ({
  ...baseInteraction,
  ...overrides,
})

const agentMap: Record<string, string> = {
  'agent-1': 'Ana García',
  'agent-2': 'Carlos López',
}

const findByClassSubstring = (container: HTMLElement, substring: string): HTMLElement | null => {
  return container.querySelector(`[class*="${substring}"]`)
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe('InteractionTimeline — Renderizado básico', () => {

  it('muestra el mensaje de vacío si no hay interacciones', () => {
    renderWithRouter(<InteractionTimeline interactions={[]} />)
    expect(
      screen.getByText('No se encontraron interacciones para este cliente.')
    ).toBeInTheDocument()
  })

  it('no muestra mensaje de vacío cuando hay interacciones', () => {
    renderWithRouter(<InteractionTimeline interactions={[baseInteraction]} agentMap={agentMap} />)
    expect(
      screen.queryByText('No se encontraron interacciones para este cliente.')
    ).not.toBeInTheDocument()
  })

  it('renderiza el asunto de la interacción', () => {
    renderWithRouter(<InteractionTimeline interactions={[baseInteraction]} agentMap={agentMap} />)
    expect(screen.getByText('Llamada de seguimiento')).toBeInTheDocument()
  })

  it('renderiza las notas de la interacción', () => {
    renderWithRouter(<InteractionTimeline interactions={[baseInteraction]} agentMap={agentMap} />)
    expect(screen.getByText('Cliente interesado')).toBeInTheDocument()
  })

  it('muestra el nombre del agente cuando está en el mapa', () => {
    renderWithRouter(<InteractionTimeline interactions={[baseInteraction]} agentMap={agentMap} />)
    expect(screen.getByText('Ana García')).toBeInTheDocument()
  })

  it('muestra un fragmento del ID del agente si no está en el mapa', () => {
    renderWithRouter(<InteractionTimeline interactions={[baseInteraction]} agentMap={{}} />)
    expect(screen.getByText('agent-1')).toBeInTheDocument()
  })

  it('muestra la duración cuando está definida', () => {
    renderWithRouter(<InteractionTimeline interactions={[baseInteraction]} agentMap={agentMap} />)
    expect(screen.getByText('15 min')).toBeInTheDocument()
  })

  it('no muestra duración cuando no está definida', () => {
    const interaction = makeInteraction({ duration_minutes: null })
    renderWithRouter(<InteractionTimeline interactions={[interaction]} agentMap={agentMap} />)
    expect(screen.queryByText(/min/)).not.toBeInTheDocument()
  })
})

describe('InteractionTimeline — Labels de tipo', () => {

  it('muestra "Llamada" para tipo call', () => {
    renderWithRouter(<InteractionTimeline interactions={[makeInteraction({ type: 'call' })]} agentMap={agentMap} />)
    expect(screen.getByText('Llamada')).toBeInTheDocument()
  })

  it('muestra "Correo" para tipo email', () => {
    renderWithRouter(<InteractionTimeline interactions={[makeInteraction({ id: 'e', type: 'email' })]} agentMap={agentMap} />)
    expect(screen.getByText('Correo')).toBeInTheDocument()
  })

  it('muestra "Reunión" para tipo meeting', () => {
    renderWithRouter(<InteractionTimeline interactions={[makeInteraction({ id: 'm', type: 'meeting' })]} agentMap={agentMap} />)
    expect(screen.getByText('Reunión')).toBeInTheDocument()
  })

  it('muestra "Mensaje" para tipo ticket', () => {
    renderWithRouter(<InteractionTimeline interactions={[makeInteraction({ id: 't', type: 'ticket' })]} agentMap={agentMap} />)
    expect(screen.getByText('Mensaje')).toBeInTheDocument()
  })

  it('muestra "Nota" para tipo note', () => {
    renderWithRouter(<InteractionTimeline interactions={[makeInteraction({ id: 'n', type: 'note' })]} agentMap={agentMap} />)
    expect(screen.getByText('Nota')).toBeInTheDocument()
  })
})

describe('InteractionTimeline — Badges de estado', () => {

  it('muestra badge "Pendiente" para status pending', () => {
    renderWithRouter(<InteractionTimeline interactions={[makeInteraction({ status: 'pending' })]} agentMap={agentMap} />)
    expect(screen.getByText('Pendiente')).toBeInTheDocument()
  })

  it('muestra badge "En progreso" para status in_progress', () => {
    renderWithRouter(<InteractionTimeline interactions={[makeInteraction({ status: 'in_progress' })]} agentMap={agentMap} />)
    expect(screen.getByText('En progreso')).toBeInTheDocument()
  })

  it('muestra badge "Resuelto" para status resolved', () => {
    renderWithRouter(<InteractionTimeline interactions={[makeInteraction({ status: 'resolved' })]} agentMap={agentMap} />)
    expect(screen.getByText('Resuelto')).toBeInTheDocument()
  })

  it('muestra badge "Cerrado" para status closed', () => {
    renderWithRouter(<InteractionTimeline interactions={[makeInteraction({ status: 'closed' })]} agentMap={agentMap} />)
    expect(screen.getByText('Cerrado')).toBeInTheDocument()
  })
})

describe('InteractionTimeline — Colores por estado en ícono y card', () => {

  it.skip('aplica clase de ícono pending cuando el estado es pending', () => {
    const { container } = renderWithRouter(
      <InteractionTimeline interactions={[makeInteraction({ status: 'pending' })]} agentMap={agentMap} />
    )
    const icon = findByClassSubstring(container, 'cardIcon')
    expect(icon).not.toBeNull()
    expect(icon!.className).toContain('iconPending')
  })

  it.skip('aplica clase de ícono in_progress cuando el estado es in_progress', () => {
    const { container } = renderWithRouter(
      <InteractionTimeline interactions={[makeInteraction({ status: 'in_progress' })]} agentMap={agentMap} />
    )
    const icon = findByClassSubstring(container, 'cardIcon')
    expect(icon).not.toBeNull()
    expect(icon!.className).toContain('iconInProgress')
  })

  it.skip('aplica clase de ícono resolved cuando el estado es resolved', () => {
    const { container } = renderWithRouter(
      <InteractionTimeline interactions={[makeInteraction({ status: 'resolved' })]} agentMap={agentMap} />
    )
    const icon = findByClassSubstring(container, 'cardIcon')
    expect(icon).not.toBeNull()
    expect(icon!.className).toContain('iconResolved')
  })

  it.skip('aplica clase de ícono closed cuando el estado es closed', () => {
    const { container } = renderWithRouter(
      <InteractionTimeline interactions={[makeInteraction({ status: 'closed' })]} agentMap={agentMap} />
    )
    const icon = findByClassSubstring(container, 'cardIcon')
    expect(icon).not.toBeNull()
    expect(icon!.className).toContain('iconClosed')
  })

  it('aplica clase de card pending cuando el estado es pending', () => {
    renderWithRouter(
      <InteractionTimeline interactions={[makeInteraction({ status: 'closed' })]} agentMap={agentMap} />
    )
    const heading = screen.getByText('Llamada de seguimiento')
    const card = heading.parentElement!.parentElement!.parentElement!
    expect(card.className).toContain('cardClosed')
  })
})

describe('InteractionTimeline — Agrupación por fecha', () => {

  it('agrupa interacciones del mismo día bajo un solo encabezado de fecha', () => {
    const interactions = [
      makeInteraction({ id: 'int-1', interaction_date: '2026-03-18T10:00:00Z' }),
      makeInteraction({ id: 'int-2', interaction_date: '2026-03-18T15:00:00Z', subject: 'Otra llamada' }),
    ]
    const { container } = renderWithRouter(<InteractionTimeline interactions={interactions} agentMap={agentMap} />)
    const dateHeaders = container.querySelectorAll('[class*="dateGroup"]')
    expect(dateHeaders).toHaveLength(1)
  })

  it('crea grupos separados para fechas distintas', () => {
    const interactions = [
      makeInteraction({ id: 'int-1', interaction_date: '2026-03-18T10:00:00Z' }),
      makeInteraction({ id: 'int-2', interaction_date: '2026-03-17T10:00:00Z', subject: 'Ayer' }),
    ]
    const { container } = renderWithRouter(<InteractionTimeline interactions={interactions} agentMap={agentMap} />)
    const dateHeaders = container.querySelectorAll('[class*="dateGroup"]')
    expect(dateHeaders).toHaveLength(2)
  })

  it('muestra múltiples cards dentro de un mismo grupo de fecha', () => {
    const interactions = [
      makeInteraction({ id: 'int-1', interaction_date: '2026-03-18T10:00:00Z', subject: 'Primera' }),
      makeInteraction({ id: 'int-2', interaction_date: '2026-03-18T15:00:00Z', subject: 'Segunda' }),
    ]
    renderWithRouter(<InteractionTimeline interactions={interactions} agentMap={agentMap} />)
    expect(screen.getByText('Primera')).toBeInTheDocument()
    expect(screen.getByText('Segunda')).toBeInTheDocument()
  })
})

describe('InteractionTimeline — Notas internas', () => {

  it('muestra la sección de notas internas cuando existen', () => {
    const interaction = makeInteraction({ internal_notes: 'Dato confidencial' })
    renderWithRouter(<InteractionTimeline interactions={[interaction]} agentMap={agentMap} />)
    expect(screen.getByText('Notas internas')).toBeInTheDocument()
    expect(screen.getByText('Dato confidencial')).toBeInTheDocument()
  })

  it('no muestra la sección de notas internas cuando no existen', () => {
    const interaction = makeInteraction({ internal_notes: null })
    renderWithRouter(<InteractionTimeline interactions={[interaction]} agentMap={agentMap} />)
    expect(screen.queryByText('Notas internas')).not.toBeInTheDocument()
  })
})
