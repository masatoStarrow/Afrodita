import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { DashboardTemplate } from '@components/templates/DashboardTemplate'
import { Spinner } from '@components/atoms/Spinner'
import { AlertMessage } from '@components/molecules/AlertMessage'
import { useClients } from '@hooks/queries/useClients.query'
import { ROUTES } from '@constants/routes.constants'
import type { Client } from '@app-types/client.types'
import styles from './ClientesPage.module.css'

/* ── Datos mock de interacciones (se reemplazarán cuando el módulo esté listo) ── */
const MOCK_INTERACTIONS: Record<number, { days: number; count: number }> = {
  0: { days: 10, count: 45 },
  1: { days: 10, count: 32 },
  2: { days: 11, count: 28 },
  3: { days: 12, count: 35 },
  4: { days: 13, count: 22 },
  5: { days: 14, count: 12 },
}
const getMockInteraction = (idx: number) =>
  MOCK_INTERACTIONS[idx % Object.keys(MOCK_INTERACTIONS).length]

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
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M12 7v5l4 2" />
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
  index:  number
}
const ClientRow = ({ client, index }: ClientRowProps) => {
  const navigate = useNavigate()
  const mock     = getMockInteraction(index)
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
      <td className={`${styles.cell} ${styles.mockCell}`}>
        <div className={styles.contactCell}>
          <CalendarIcon />
          <span>hace {mock.days} días</span>
        </div>
      </td>
      <td className={`${styles.cell} ${styles.mockCell}`}>
        <div className={styles.contactCell}>
          <InteractionIcon />
          <span>{mock.count}</span>
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
          value={isLoading ? '...' : (data?.total ?? '—')}
        />
        <StatCard label="Interacciones totales" value="—" mocked />
        <StatCard label="Promedio por cliente"  value="—" mocked />
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
                  filtered.map((client, idx) => (
                    <ClientRow key={client.id} client={client} index={idx} />
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
