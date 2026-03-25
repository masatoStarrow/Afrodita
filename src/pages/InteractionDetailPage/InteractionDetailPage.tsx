import { Link, useParams } from 'react-router-dom'
import { DashboardTemplate } from '@components/templates/DashboardTemplate'
import { useClientDetail } from '@hooks/queries/useClients.query'
import { ROUTES, buildRoute } from '@constants/routes.constants'
import styles from './InteractionDetailPage.module.css'

const ChevronIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

export const InteractionDetailPage = () => {
  const { clientId, interactionId: _interactionId } = useParams<{
    clientId: string
    interactionId: string
  }>()

  const { data: client } = useClientDetail(clientId ?? '')

  return (
    <DashboardTemplate>
      <nav className={styles.breadcrumb} aria-label="Navegación">
        <Link to={ROUTES.DASHBOARD} className={styles.crumbLink}>
          Clientes
        </Link>
        <span className={styles.separator} aria-hidden="true">
          <ChevronIcon />
        </span>
        <Link
          to={buildRoute.clientDetail(clientId ?? '')}
          className={styles.crumbLink}
        >
          {client?.company ?? '...'}
        </Link>
        <span className={styles.separator} aria-hidden="true">
          <ChevronIcon />
        </span>
        <span className={styles.crumbCurrent} aria-current="page">
          Detalle de interacción
        </span>
      </nav>
    </DashboardTemplate>
  )
}

export default InteractionDetailPage
