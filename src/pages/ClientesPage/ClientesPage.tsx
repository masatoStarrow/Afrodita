import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { DashboardTemplate } from '@components/templates/DashboardTemplate'
import { Spinner } from '@components/atoms/Spinner'
import { AlertMessage } from '@components/molecules/AlertMessage'
import { useClients } from '@hooks/queries/useClients.query'
import { useMetrics } from '@hooks/queries/useMetrics.query'
import { ROUTES } from '@constants/routes.constants'
import { formatRelativeDate } from '@utils/format.utils'
import type { Client } from '@app-types/client.types'
import type { ClientMetric } from '@app-types/metrics.types'
import styles from './ClientesPage.module.css'


/* ── Íconos ── */
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
  </svg>
)

const BuildingIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M9 22V12h6v10M9 7h1m4 0h1M9 11h1m4 0h1" />
  </svg>
)

const MailIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 7L2 7" />
  </svg>
)

const PhoneIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.63 1.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.5 16.92z" />
  </svg>
)

const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
)

const InteractionIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
)

const HistoryIcon = () => (
  <svg width="16" height="16" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M5.0001 1.5V0H10.0002V5H8.50016V2.56L2.56005 8.5H5.0001V10H0V5H1.50003V7.44L7.44014 1.5H5.0001ZM21.9804 15.82L21.3504 20.28C21.2104 21.27 20.3604 22 19.3704 22H13.2103C12.6802 22 11.9202 21.79 11.5502 21.41L7.00013 16.62L7.83015 15.78C8.07016 15.54 8.41016 15.43 8.75017 15.5L12.0002 16.24V5.5C12.0002 4.67 12.6702 4 13.5003 4C14.3303 4 15.0003 4.67 15.0003 5.5V11.5H15.9103C16.2203 11.5 16.5303 11.57 16.8003 11.71L20.8904 13.75C21.6604 14.14 22.1004 14.97 21.9804 15.82Z" fill="currentColor" />
  </svg>
)

/* ── Sub-componentes ── */
interface StatCardProps {
  label: string
  value: string | number
  mocked?: boolean
}
const StatCard = ({ label, value, mocked = false }: StatCardProps) => (
  <div className={styles.statCard}>
    <span className={styles.statLabel}>{label}</span>
    <span className={`${styles.statValue} ${mocked ? styles.statMocked : ''}`}>{value}</span>
  </div>
)

interface ClientRowProps {
  client: Client
  metric?: ClientMetric
}
const ClientRow = ({ client, metric }: ClientRowProps) => {
  const navigate = useNavigate()
  const isActive = client.status === 'active'

  const handleViewHistory = () => {
    navigate(ROUTES.CLIENT_DETAIL.replace(':id', client.id))
  }

  return (
    <tr className={styles.row}>
      <td className={styles.cell}>
        <div className={styles.clientCell}>
          <div className={styles.avatar}>
            <BuildingIcon />
          </div>
          <div className={styles.clientInfo}>
            <span className={styles.companyName}>{client.company}</span>
            <span className={`${styles.statusBadge} ${isActive ? styles.active : styles.inactive}`}>
              <span className={styles.statusDot} />
              {isActive ? 'Activo' : 'Inactivo'}
            </span>
          </div>
        </div>
      </td>
      <td className={styles.cell}>
        <div className={styles.contactCell}>
          <MailIcon />
          <span>{client.email}</span>
        </div>
      </td>
      <td className={styles.cell}>
        <div className={styles.contactCell}>
          <PhoneIcon />
          <span>{client.phone ?? '—'}</span>
        </div>
      </td>
      <td className={styles.cell}>
        <div className={styles.contactCell}>
          <CalendarIcon />
          <span>
            {metric?.last_interaction_date
              ? formatRelativeDate(metric.last_interaction_date)
              : '—'}
          </span>
        </div>
      </td>
      <td className={styles.cell}>
        <div className={styles.contactCell}>
          <InteractionIcon />
          <span>{metric?.interaction_count ?? 0}</span>
        </div>
      </td>
      <td className={styles.cell}>
        <button className={styles.historyBtn} type="button" onClick={handleViewHistory}>
          <HistoryIcon />
          Ver historial
        </button>
      </td>
    </tr>
  )
}

/* ── Página principal ── */
export const ClientesPage = () => {
  const [search, setSearch] = useState('')
  const { data, isLoading, isError, error } = useClients({ page_size: 100 })
  const { data: metrics, isLoading: metricsLoading } = useMetrics()

  const metricsMap = useMemo(() => {
    const map = new Map<string, ClientMetric>()
    if (metrics?.per_client) {
      for (const m of metrics.per_client) {
        map.set(m.client_id, m)
      }
    }
    return map
  }, [metrics?.per_client])

  const filtered = useMemo(() => {
    if (!data?.items) return []
    const q = search.trim().toLowerCase()
    if (!q) return data.items
    return data.items.filter(
      (c) =>
        c.company.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q)
    )
  }, [data?.items, search])

  return (
    <DashboardTemplate>
      {/* Encabezado de página */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Clientes</h1>
          <p className={styles.pageSubtitle}>Gestiona y visualiza el historial de interacciones con tus clientes</p>
        </div>
        <div className={styles.searchWrapper}>
          <span className={styles.searchIcon}><SearchIcon /></span>
          <input
            className={styles.searchInput}
            type="search"
            placeholder="Buscar clientes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Buscar clientes"
          />
        </div>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className={styles.statsGrid}>
        <StatCard
          label="Total de clientes"
          value={isLoading ? '...' : (metrics?.total_clients ?? data?.total ?? '—')}
        />
        <StatCard
          label="Interacciones totales"
          value={metricsLoading ? '...' : (metrics?.total_interactions ?? '—')}
        />
        <StatCard
          label="Promedio por cliente"
          value={metricsLoading ? '...' : (metrics?.avg_interactions_per_client ?? '—')}
        />
      </div>

      {/* Tabla de clientes */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <div>
            <h2 className={styles.tableTitle}>Lista de clientes</h2>
            {!isLoading && !isError && (
              <p className={styles.tableCount}>
                {filtered.length} {filtered.length === 1 ? 'cliente encontrado' : 'clientes encontrados'}
              </p>
            )}
          </div>
        </div>

        {isLoading && (
          <div className={styles.stateContainer}>
            <Spinner size="lg" />
          </div>
        )}

        {isError && (
          <div className={styles.stateContainer}>
            <AlertMessage
              variant="error"
              message={
                (error as { response?: { data?: { error?: { message?: string } } } })
                  ?.response?.data?.error?.message ??
                'No se pudo cargar la lista de clientes. Intenta de nuevo.'
              }
            />
          </div>
        )}

        {!isLoading && !isError && (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Cliente</th>
                  <th className={styles.th}>Contacto</th>
                  <th className={styles.th}>Teléfono</th>
                  <th className={styles.th}>Última interacción</th>
                  <th className={styles.th}># Interacción</th>
                  <th className={styles.th} />
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className={styles.emptyRow}>
                      No se encontraron clientes{search ? ` para "${search}"` : ''}.
                    </td>
                  </tr>
                ) : (
                  filtered.map((client) => (
                    <ClientRow key={client.id} client={client} metric={metricsMap.get(client.id)} />
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardTemplate>
  )
}

export default ClientesPage
