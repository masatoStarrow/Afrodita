import { render, screen } from '@testing-library/react'
import { InteractionTimeline } from './InteractionTimeline'
import type { Interaction } from '@app-types/interaction.types'

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
    render(<InteractionTimeline interactions={[]} />)
    expect(
      screen.getByText('No se encontraron interacciones para este cliente.')
    ).toBeInTheDocument()
  })

  it('no muestra mensaje de vacío cuando hay interacciones', () => {
    render(<InteractionTimeline interactions={[baseInteraction]} agentMap={agentMap} />)
    expect(
      screen.queryByText('No se encontraron interacciones para este cliente.')
    ).not.toBeInTheDocument()
  })

  it('renderiza el asunto de la interacción', () => {
    render(<InteractionTimeline interactions={[baseInteraction]} agentMap={agentMap} />)
    expect(screen.getByText('Llamada de seguimiento')).toBeInTheDocument()
  })

  it('renderiza las notas de la interacción', () => {
    render(<InteractionTimeline interactions={[baseInteraction]} agentMap={agentMap} />)
    expect(screen.getByText('Cliente interesado')).toBeInTheDocument()
  })

  it('muestra el nombre del agente cuando está en el mapa', () => {
    render(<InteractionTimeline interactions={[baseInteraction]} agentMap={agentMap} />)
    expect(screen.getByText('Ana García')).toBeInTheDocument()
  })

  it('muestra un fragmento del ID del agente si no está en el mapa', () => {
    render(<InteractionTimeline interactions={[baseInteraction]} agentMap={{}} />)
    expect(screen.getByText('agent-1')).toBeInTheDocument()
  })

  it('muestra la duración cuando está definida', () => {
    render(<InteractionTimeline interactions={[baseInteraction]} agentMap={agentMap} />)
    expect(screen.getByText('15 min')).toBeInTheDocument()
  })

  it('no muestra duración cuando no está definida', () => {
    const interaction = makeInteraction({ duration_minutes: null })
    render(<InteractionTimeline interactions={[interaction]} agentMap={agentMap} />)
    expect(screen.queryByText(/min/)).not.toBeInTheDocument()
  })
})

describe('InteractionTimeline — Labels de tipo', () => {

  it('muestra "Llamada" para tipo call', () => {
    render(<InteractionTimeline interactions={[makeInteraction({ type: 'call' })]} agentMap={agentMap} />)
    expect(screen.getByText('Llamada')).toBeInTheDocument()
  })

  it('muestra "Correo" para tipo email', () => {
    render(<InteractionTimeline interactions={[makeInteraction({ id: 'e', type: 'email' })]} agentMap={agentMap} />)
    expect(screen.getByText('Correo')).toBeInTheDocument()
  })

  it('muestra "Reunión" para tipo meeting', () => {
    render(<InteractionTimeline interactions={[makeInteraction({ id: 'm', type: 'meeting' })]} agentMap={agentMap} />)
    expect(screen.getByText('Reunión')).toBeInTheDocument()
  })

  it('muestra "Mensaje" para tipo ticket', () => {
    render(<InteractionTimeline interactions={[makeInteraction({ id: 't', type: 'ticket' })]} agentMap={agentMap} />)
    expect(screen.getByText('Mensaje')).toBeInTheDocument()
  })

  it('muestra "Nota" para tipo note', () => {
    render(<InteractionTimeline interactions={[makeInteraction({ id: 'n', type: 'note' })]} agentMap={agentMap} />)
    expect(screen.getByText('Nota')).toBeInTheDocument()
  })
})

describe('InteractionTimeline — Badges de estado', () => {

  it('muestra badge "Pendiente" para status pending', () => {
    render(<InteractionTimeline interactions={[makeInteraction({ status: 'pending' })]} agentMap={agentMap} />)
    expect(screen.getByText('Pendiente')).toBeInTheDocument()
  })

  it('muestra badge "En progreso" para status in_progress', () => {
    render(<InteractionTimeline interactions={[makeInteraction({ status: 'in_progress' })]} agentMap={agentMap} />)
    expect(screen.getByText('En progreso')).toBeInTheDocument()
  })

  it('muestra badge "Resuelto" para status resolved', () => {
    render(<InteractionTimeline interactions={[makeInteraction({ status: 'resolved' })]} agentMap={agentMap} />)
    expect(screen.getByText('Resuelto')).toBeInTheDocument()
  })

  it('muestra badge "Cerrado" para status closed', () => {
    render(<InteractionTimeline interactions={[makeInteraction({ status: 'closed' })]} agentMap={agentMap} />)
    expect(screen.getByText('Cerrado')).toBeInTheDocument()
  })
})

describe('InteractionTimeline — Colores por estado en ícono y card', () => {

  it('aplica clase de ícono pending cuando el estado es pending', () => {
    const { container } = render(
      <InteractionTimeline interactions={[makeInteraction({ status: 'pending' })]} agentMap={agentMap} />
    )
    const icon = findByClassSubstring(container, 'cardIcon')
    expect(icon).not.toBeNull()
    expect(icon!.className).toContain('iconPending')
  })

  it('aplica clase de ícono in_progress cuando el estado es in_progress', () => {
    const { container } = render(
      <InteractionTimeline interactions={[makeInteraction({ status: 'in_progress' })]} agentMap={agentMap} />
    )
    const icon = findByClassSubstring(container, 'cardIcon')
    expect(icon).not.toBeNull()
    expect(icon!.className).toContain('iconInProgress')
  })

  it('aplica clase de ícono resolved cuando el estado es resolved', () => {
    const { container } = render(
      <InteractionTimeline interactions={[makeInteraction({ status: 'resolved' })]} agentMap={agentMap} />
    )
    const icon = findByClassSubstring(container, 'cardIcon')
    expect(icon).not.toBeNull()
    expect(icon!.className).toContain('iconResolved')
  })

  it('aplica clase de ícono closed cuando el estado es closed', () => {
    const { container } = render(
      <InteractionTimeline interactions={[makeInteraction({ status: 'closed' })]} agentMap={agentMap} />
    )
    const icon = findByClassSubstring(container, 'cardIcon')
    expect(icon).not.toBeNull()
    expect(icon!.className).toContain('iconClosed')
  })

  it('aplica clase de card pending cuando el estado es pending', () => {
    render(
      <InteractionTimeline interactions={[makeInteraction({ status: 'pending' })]} agentMap={agentMap} />
    )
    const heading = screen.getByText('Llamada de seguimiento')
    const card = heading.parentElement!.parentElement!.parentElement!
    expect(card.className).toContain('cardPending')
  })

  it('aplica clase de card in_progress cuando el estado es in_progress', () => {
    render(
      <InteractionTimeline interactions={[makeInteraction({ status: 'in_progress' })]} agentMap={agentMap} />
    )
    const heading = screen.getByText('Llamada de seguimiento')
    const card = heading.parentElement!.parentElement!.parentElement!
    expect(card.className).toContain('cardInProgress')
  })

  it('aplica clase de card resolved cuando el estado es resolved', () => {
    render(
      <InteractionTimeline interactions={[makeInteraction({ status: 'resolved' })]} agentMap={agentMap} />
    )
    const heading = screen.getByText('Llamada de seguimiento')
    const card = heading.parentElement!.parentElement!.parentElement!
    expect(card.className).toContain('cardResolved')
  })

  it('aplica clase de card closed cuando el estado es closed', () => {
    render(
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
    const { container } = render(<InteractionTimeline interactions={interactions} agentMap={agentMap} />)
    const dateHeaders = container.querySelectorAll('[class*="dateGroup"]')
    expect(dateHeaders).toHaveLength(1)
  })

  it('crea grupos separados para fechas distintas', () => {
    const interactions = [
      makeInteraction({ id: 'int-1', interaction_date: '2026-03-18T10:00:00Z' }),
      makeInteraction({ id: 'int-2', interaction_date: '2026-03-17T10:00:00Z', subject: 'Ayer' }),
    ]
    const { container } = render(<InteractionTimeline interactions={interactions} agentMap={agentMap} />)
    const dateHeaders = container.querySelectorAll('[class*="dateGroup"]')
    expect(dateHeaders).toHaveLength(2)
  })

  it('muestra múltiples cards dentro de un mismo grupo de fecha', () => {
    const interactions = [
      makeInteraction({ id: 'int-1', interaction_date: '2026-03-18T10:00:00Z', subject: 'Primera' }),
      makeInteraction({ id: 'int-2', interaction_date: '2026-03-18T15:00:00Z', subject: 'Segunda' }),
    ]
    render(<InteractionTimeline interactions={interactions} agentMap={agentMap} />)
    expect(screen.getByText('Primera')).toBeInTheDocument()
    expect(screen.getByText('Segunda')).toBeInTheDocument()
  })
})

describe('InteractionTimeline — Notas internas', () => {

  it('muestra la sección de notas internas cuando existen', () => {
    const interaction = makeInteraction({ internal_notes: 'Dato confidencial' })
    render(<InteractionTimeline interactions={[interaction]} agentMap={agentMap} />)
    expect(screen.getByText('Notas internas')).toBeInTheDocument()
    expect(screen.getByText('Dato confidencial')).toBeInTheDocument()
  })

  it('no muestra la sección de notas internas cuando no existen', () => {
    const interaction = makeInteraction({ internal_notes: null })
    render(<InteractionTimeline interactions={[interaction]} agentMap={agentMap} />)
    expect(screen.queryByText('Notas internas')).not.toBeInTheDocument()
  })
})
