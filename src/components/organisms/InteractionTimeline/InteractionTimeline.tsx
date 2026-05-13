import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import type { Interaction, InteractionType, InteractionStatus } from '@app-types/interaction.types'
import { formatDate, formatRelativeDate, formatTime, formatDuration } from '@utils/format.utils'
import { buildRoute } from '@constants/routes.constants'
import styles from './InteractionTimeline.module.css'

/* ── Icons ── */

const CalendarDotIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
)

const CallIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 5.16 12 19.79 19.79 0 0 1 2.09 3.38A2 2 0 0 1 4.11 1.18h3a2 2 0 0 1 2 1.72c.13.97.36 1.93.7 2.85a2 2 0 0 1-.45 2.11L8.09 9.13a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.92.34 1.88.57 2.85.7A2 2 0 0 1 22 16.92z" />
  </svg>
)

const MailSmIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 7L2 7" />
  </svg>
)

const MeetingIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const TicketIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
)

const NoteIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
  </svg>
)

const ClockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
)

const TimerIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
)

const UserIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
)

const LockIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)

const TypeIcon = ({ type }: { type: InteractionType }) => {
  switch (type) {
    case 'call':    return <CallIcon />
    case 'email':   return <MailSmIcon />
    case 'meeting': return <MeetingIcon />
    case 'ticket':  return <TicketIcon />
    case 'note':    return <NoteIcon />
    default:        return <NoteIcon />
  }
}

/* ── Labels ── */

const TYPE_LABELS: Record<InteractionType, string> = {
  call:    'Llamada',
  email:   'Correo',
  meeting: 'Reunión',
  ticket:  'Mensaje',
  note:    'Nota',
}

const STATUS_LABELS: Record<InteractionStatus, string> = {
  open:        'Abierto',
  pending:     'Pendiente',
  in_progress: 'En progreso',
  resolved:    'Resuelto',
  closed:      'Cerrado',
}

const STATUS_STYLE: Record<InteractionStatus, string> = {
  open:        styles.badgePending,
  pending:     styles.badgePending,
  in_progress: styles.badgeInProgress,
  resolved:    styles.badgeResolved,
  closed:      styles.badgeClosed,
}

const ICON_TYPE_STYLE: Record<InteractionType, string> = {
  call:    styles.iconCall,
  email:   styles.iconEmail,
  meeting: styles.iconMeeting,
  ticket:  styles.iconTicket,
  note:    styles.iconNote,
}

const CARD_STATUS_STYLE: Record<InteractionStatus, string> = {
  open:        styles.cardPending,
  pending:     styles.cardPending,
  in_progress: styles.cardInProgress,
  resolved:    styles.cardResolved,
  closed:      styles.cardClosed,
}

/* ── Helpers ── */

function groupByDate(interactions: Interaction[]): Map<string, Interaction[]> {
  const groups = new Map<string, Interaction[]>()
  for (const interaction of interactions) {
    const dateKey = new Date(interaction.interaction_date).toISOString().slice(0, 10)
    const existing = groups.get(dateKey)
    if (existing) {
      existing.push(interaction)
    } else {
      groups.set(dateKey, [interaction])
    }
  }
  return groups
}

/* ── Card component ── */

interface InteractionCardProps {
  interaction: Interaction
  agentName:   string
  clientId:    string
}

const InteractionCard = ({ interaction, agentName, clientId }: InteractionCardProps) => (
  <Link
    to={buildRoute.interactionDetail(clientId, interaction.id)}
    className={`${styles.card} ${CARD_STATUS_STYLE[interaction.status] ?? ''}`}>
    <div className={styles.cardTop}>
      <div className={`${styles.cardIcon} ${ICON_TYPE_STYLE[interaction.type] ?? ''}`}>
        <TypeIcon type={interaction.type} />
      </div>
      <div className={styles.cardMain}>
        <h3 className={styles.cardSubject}>{interaction.subject}</h3>
        {interaction.notes && (
          <p className={styles.cardDescription}>{interaction.notes}</p>
        )}
        <div className={styles.cardMeta}>
          <span className={styles.metaItem}>
            <TypeIcon type={interaction.type} />
            {TYPE_LABELS[interaction.type] ?? interaction.type}
          </span>
          <span className={styles.metaItem}>
            <UserIcon />
            {agentName}
          </span>
          <span className={styles.metaItem}>
            <ClockIcon />
            {formatTime(interaction.interaction_date)}
          </span>
          {interaction.duration_minutes && (
            <span className={styles.metaItem}>
              <TimerIcon />
              {formatDuration(interaction.duration_minutes)}
            </span>
          )}
        </div>
      </div>
      <span className={`${styles.badge} ${STATUS_STYLE[interaction.status] ?? styles.badgePending}`}>
        {STATUS_LABELS[interaction.status] ?? interaction.status}
      </span>
    </div>

    {interaction.internal_notes && (
      <div className={styles.internalNotes}>
        <span className={styles.internalNotesLabel}>
          <LockIcon />
          Notas internas
        </span>
        <p className={styles.internalNotesText}>{interaction.internal_notes}</p>
      </div>
    )}
  </Link>
)

/* ── Timeline component ── */

interface InteractionTimelineProps {
  interactions: Interaction[]
  clientId:     string
  agentMap?:    Record<string, string>
}

export const InteractionTimeline = ({ interactions, clientId, agentMap = {} }: InteractionTimelineProps) => {
  const grouped = useMemo(() => groupByDate(interactions), [interactions])

  const getAgentName = (agentId: string) =>
    agentMap[agentId] ?? agentId.slice(0, 8)

  if (interactions.length === 0) {
    return (
      <div className={styles.emptyState}>
        No se encontraron interacciones para este cliente.
      </div>
    )
  }

  return (
    <div className={styles.timeline}>
      {Array.from(grouped.entries()).map(([dateKey, items]) => (
        <div key={dateKey} className={styles.dateGroup}>
          <div className={styles.dateHeader}>
            <span className={styles.dateDot}>
              <CalendarDotIcon />
            </span>
            <span className={styles.dateText}>{formatDate(dateKey)}</span>
            <span className={styles.dateRelative}>{formatRelativeDate(dateKey)}</span>
          </div>
          <div className={styles.cards}>
            {items.map((interaction) => (
              <InteractionCard
                key={interaction.id}
                interaction={interaction}
                agentName={getAgentName(interaction.agent_id)}
                clientId={clientId}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
