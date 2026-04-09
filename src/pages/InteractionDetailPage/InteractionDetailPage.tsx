import { Link, useParams } from 'react-router-dom'
import { DashboardTemplate } from '@components/templates/DashboardTemplate'
import { Spinner } from '@components/atoms/Spinner'
import { useClientDetail } from '@hooks/queries/useClients.query'
import { useInteraction } from '@hooks/queries/useInteractions.query'
import { ROUTES, buildRoute } from '@constants/routes.constants'
import type { InteractionType, InteractionStatus } from '@app-types/interaction.types'
import styles from './InteractionDetailPage.module.css'

/* ── Icons ── */

const ChevronIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

const CallIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 5.16 12 19.79 19.79 0 0 1 2.09 3.38A2 2 0 0 1 4.11 1.18h3a2 2 0 0 1 2 1.72c.13.97.36 1.93.7 2.85a2 2 0 0 1-.45 2.11L8.09 9.13a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.92.34 1.88.57 2.85.7A2 2 0 0 1 22 16.92z" />
  </svg>
)

const MailIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 7L2 7" />
  </svg>
)

const MeetingIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const TicketIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
)

const NoteIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
  </svg>
)

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
)

const BuildingIcon = () => (
  <svg width="24" height="24" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect width="54" height="54" rx="27" fill="url(#clientGrad)" />
    <path d="M21 37V19C21 18.4696 21.2107 17.9609 21.5858 17.5858C21.9609 17.2107 22.4696 17 23 17H31C31.5304 17 32.0391 17.2107 32.4142 17.5858C32.7893 17.9609 33 18.4696 33 19V37H21Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21 27H19C18.4696 27 17.9609 27.2107 17.5858 27.5858C17.2107 27.9609 17 28.4696 17 29V35C17 35.5304 17.2107 36.0391 17.5858 36.4142C17.9609 36.7893 18.4696 37 19 37H21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M33 24H35C35.5304 24 36.0391 24.2107 36.4142 24.5858C36.7893 24.9609 37 25.4696 37 26V35C37 35.5304 36.7893 36.0391 36.4142 36.4142C36.0391 36.7893 35.5304 37 35 37H33" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M25 21H29M25 25H29M25 29H29M25 33H29" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <defs>
      <linearGradient id="clientGrad" x1="27" y1="0" x2="27" y2="54" gradientUnits="userSpaceOnUse">
        <stop stopColor="#A1C6D5" /><stop offset="1" stopColor="#75B6D0" />
      </linearGradient>
    </defs>
  </svg>
)

const ClientMailIcon = () => (
  <svg width="15" height="15" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M15 3H3C2.17157 3 1.5 3.67157 1.5 4.5V13.5C1.5 14.3284 2.17157 15 3 15H15C15.8284 15 16.5 14.3284 16.5 13.5V4.5C16.5 3.67157 15.8284 3 15 3Z" stroke="#32687A" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16.5 5.25L9.7725 9.525C9.54095 9.67007 9.27324 9.74701 9 9.74701C8.72676 9.74701 8.45905 9.67007 8.2275 9.525L1.5 5.25" stroke="#32687A" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ClientPhoneIcon = () => (
  <svg width="15" height="15" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M16.95 18C14.8 18 12.7043 17.5207 10.663 16.562C8.621 15.604 6.81267 14.3373 5.238 12.762C3.66267 11.1873 2.396 9.379 1.438 7.337C0.479334 5.29567 0 3.2 0 1.05C0 0.75 0.0999999 0.5 0.3 0.3C0.5 0.0999999 0.75 0 1.05 0H5.1C5.33333 0 5.54167 0.0749999 5.725 0.225C5.90833 0.375 6.01667 0.566667 6.05 0.8L6.7 4.3C6.73333 4.53333 6.729 4.746 6.688 4.937C6.646 5.129 6.55 5.3 6.4 5.45L4 7.9C4.7 9.1 5.575 10.225 6.625 11.275C7.675 12.325 8.83333 13.2333 10.1 14L12.45 11.65C12.6 11.5 12.796 11.387 13.038 11.312C13.279 11.237 13.5167 11.217 13.75 11.25L17.2 11.95C17.4333 12 17.625 12.112 17.775 12.287C17.925 12.462 18 12.667 18 12.9V16.95C18 17.25 17.9 17.5 17.7 17.7C17.5 17.9 17.25 18 16.95 18Z" fill="#32687A" />
  </svg>
)

/* ── Maps ── */

const TYPE_ICONS: Record<InteractionType, JSX.Element> = {
  call:    <CallIcon />,
  email:   <MailIcon />,
  meeting: <MeetingIcon />,
  ticket:  <TicketIcon />,
  note:    <NoteIcon />,
}

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

const TYPE_ICON_BG: Record<InteractionType, string> = {
  call:    styles.iconBgCall,
  email:   styles.iconBgEmail,
  meeting: styles.iconBgMeeting,
  ticket:  styles.iconBgTicket,
  note:    styles.iconBgNote,
}

/* ── Page ── */

export const InteractionDetailPage = () => {
  const { clientId, interactionId } = useParams<{
    clientId:      string
    interactionId: string
  }>()

  const { data: client }      = useClientDetail(clientId ?? '')
  const { data: interaction, isLoading } = useInteraction(interactionId ?? '')

  return (
    <DashboardTemplate>
      <nav className={styles.breadcrumb} aria-label="Navegación">
        <Link to={ROUTES.DASHBOARD} className={styles.crumbLink}>
          Clientes
        </Link>
        <span className={styles.separator} aria-hidden="true"><ChevronIcon /></span>
        <Link to={buildRoute.clientDetail(clientId ?? '')} className={styles.crumbLink}>
          {client?.company ?? '...'}
        </Link>
        <span className={styles.separator} aria-hidden="true"><ChevronIcon /></span>
        <span className={styles.crumbCurrent} aria-current="page">
          Detalle de interacción
        </span>
      </nav>

      {isLoading && (
        <div className={styles.loadingState}>
          <Spinner size="lg" />
        </div>
      )}

      {interaction && (
        <>
          <div className={styles.headerCard}>
            <div className={`${styles.typeIcon} ${TYPE_ICON_BG[interaction.type]}`}>
              {TYPE_ICONS[interaction.type]}
            </div>
            <div className={styles.headerInfo}>
              <h1 className={styles.subject}>{interaction.subject}</h1>
              <div className={styles.meta}>
                <span className={styles.typeLabel}>
                  {TYPE_LABELS[interaction.type]}
                </span>
                <span className={styles.metaDot}>·</span>
                <span className={`${styles.badge} ${STATUS_STYLE[interaction.status]}`}>
                  {STATUS_LABELS[interaction.status]}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.bodyGrid}>
            <div className={styles.mainCol}>
              <section className={styles.descriptionCard} aria-label="Descripción">
                <div className={styles.sectionHeader}>
                  <EyeIcon />
                  <h2 className={styles.sectionTitle}>Descripción</h2>
                </div>
                <div className={styles.sectionBody}>
                  {interaction.notes
                    ? <p className={styles.descriptionText}>{interaction.notes}</p>
                    : <p className={styles.emptyText}>Sin descripción.</p>
                  }
                </div>
              </section>
            </div>
            <div className={styles.sideCol}>
              {client && (
                <section className={styles.descriptionCard} aria-label="Cliente">
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Cliente</h2>
                  </div>
                  <div className={styles.sectionBody}>
                    <div className={styles.clientNameCard}>
                      <div className={styles.clientAvatar}>
                        <BuildingIcon />
                      </div>
                      <div className={styles.clientNameInfo}>
                        <span className={styles.clientCompany}>{client.company}</span>
                        <span className={styles.clientCompanySub}>{client.company}</span>
                      </div>
                    </div>
                    <ul className={styles.clientMetaList}>
                      {client.email && (
                        <li className={styles.clientMetaItem}>
                          <ClientMailIcon />
                          <span>{client.email}</span>
                        </li>
                      )}
                      {client.phone && (
                        <li className={styles.clientMetaItem}>
                          <ClientPhoneIcon />
                          <span>{client.phone}</span>
                        </li>
                      )}
                    </ul>
                  </div>
                </section>
              )}
            </div>
          </div>
        </>
      )}
    </DashboardTemplate>
  )
}

export default InteractionDetailPage
