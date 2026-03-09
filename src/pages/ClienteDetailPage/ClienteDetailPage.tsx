import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { DashboardTemplate } from '@components/templates/DashboardTemplate'
import { Spinner } from '@components/atoms/Spinner'
import { AlertMessage } from '@components/molecules/AlertMessage'
import { useClientDetail } from '@hooks/queries/useClients.query'
import { ROUTES } from '@constants/routes.constants'
import { formatDate } from '@utils/format.utils'
import styles from './ClienteDetailPage.module.css'

const ArrowLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M19 12H5" /><polyline points="12 19 5 12 12 5" />
  </svg>
)

const BuildingIcon = () => (
  <svg width="54" height="54" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect width="54" height="54" rx="27" fill="url(#paint0_linear_134_490)" />
    <path d="M21 37V19C21 18.4696 21.2107 17.9609 21.5858 17.5858C21.9609 17.2107 22.4696 17 23 17H31C31.5304 17 32.0391 17.2107 32.4142 17.5858C32.7893 17.9609 33 18.4696 33 19V37H21Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21 27H19C18.4696 27 17.9609 27.2107 17.5858 27.5858C17.2107 27.9609 17 28.4696 17 29V35C17 35.5304 17.2107 36.0391 17.5858 36.4142C17.9609 36.7893 18.4696 37 19 37H21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M33 24H35C35.5304 24 36.0391 24.2107 36.4142 24.5858C36.7893 24.9609 37 25.4696 37 26V35C37 35.5304 36.7893 36.0391 36.4142 36.4142C36.0391 36.7893 35.5304 37 35 37H33" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M25 21H29" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M25 25H29" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M25 29H29" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M25 33H29" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <defs>
      <linearGradient id="paint0_linear_134_490" x1="27" y1="0" x2="27" y2="54" gradientUnits="userSpaceOnUse">
        <stop stopColor="#A1C6D5" />
        <stop offset="1" stopColor="#75B6D0" />
      </linearGradient>
    </defs>
  </svg>
)

const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M15 3H3C2.17157 3 1.5 3.67157 1.5 4.5V13.5C1.5 14.3284 2.17157 15 3 15H15C15.8284 15 16.5 14.3284 16.5 13.5V4.5C16.5 3.67157 15.8284 3 15 3Z" stroke="#32687A" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16.5 5.25L9.7725 9.525C9.54095 9.67007 9.27324 9.74701 9 9.74701C8.72676 9.74701 8.45905 9.67007 8.2275 9.525L1.5 5.25" stroke="#32687A" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M17 9C16.7333 9 16.496 8.904 16.288 8.712C16.0793 8.52067 15.9583 8.28333 15.925 8C15.7083 6.45 15.0543 5.129 13.963 4.037C12.871 2.94567 11.55 2.29167 10 2.075C9.71667 2.04167 9.47933 1.925 9.288 1.725C9.096 1.525 9 1.28333 9 1C9 0.716667 9.1 0.479 9.3 0.287C9.5 0.0956666 9.73333 0.0166666 10 0.05C12.1 0.283333 13.8917 1.14167 15.375 2.625C16.8583 4.10833 17.7167 5.9 17.95 8C17.9833 8.26667 17.904 8.5 17.712 8.7C17.5207 8.9 17.2833 9 17 9ZM12.825 9C12.6083 9 12.4167 8.925 12.25 8.775C12.0833 8.625 11.9583 8.425 11.875 8.175C11.7417 7.69167 11.4877 7.26233 11.113 6.887C10.7377 6.51233 10.3083 6.25833 9.825 6.125C9.575 6.04167 9.375 5.91667 9.225 5.75C9.075 5.58333 9 5.38333 9 5.15C9 4.81667 9.11667 4.54567 9.35 4.337C9.58333 4.129 9.84167 4.05833 10.125 4.125C11.0583 4.34167 11.8627 4.78733 12.538 5.462C13.2127 6.13733 13.6583 6.94167 13.875 7.875C13.9417 8.15833 13.8667 8.41667 13.65 8.65C13.4333 8.88333 13.1583 9 12.825 9ZM16.95 18C14.8 18 12.7043 17.5207 10.663 16.562C8.621 15.604 6.81267 14.3373 5.238 12.762C3.66267 11.1873 2.396 9.379 1.438 7.337C0.479334 5.29567 0 3.2 0 1.05C0 0.75 0.0999999 0.5 0.3 0.3C0.5 0.0999999 0.75 0 1.05 0H5.1C5.33333 0 5.54167 0.0749999 5.725 0.225C5.90833 0.375 6.01667 0.566667 6.05 0.8L6.7 4.3C6.73333 4.53333 6.72933 4.74567 6.688 4.937C6.646 5.129 6.55 5.3 6.4 5.45L4 7.9C4.7 9.1 5.575 10.225 6.625 11.275C7.675 12.325 8.83333 13.2333 10.1 14L12.45 11.65C12.6 11.5 12.796 11.3873 13.038 11.312C13.2793 11.2373 13.5167 11.2167 13.75 11.25L17.2 11.95C17.4333 12 17.625 12.1123 17.775 12.287C17.925 12.4623 18 12.6667 18 12.9V16.95C18 17.25 17.9 17.5 17.7 17.7C17.5 17.9 17.25 18 16.95 18Z" fill="#32687A" />
  </svg>
)

const CalendarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M6 1.5V4.5" stroke="#32687A" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 1.5V4.5" stroke="#32687A" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14.25 3H3.75C2.92157 3 2.25 3.67157 2.25 4.5V15C2.25 15.8284 2.92157 16.5 3.75 16.5H14.25C15.0784 16.5 15.75 15.8284 15.75 15V4.5C15.75 3.67157 15.0784 3 14.25 3Z" stroke="#32687A" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2.25 7.5H15.75" stroke="#32687A" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const TotalInteractionsIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M0 10C0 4.47715 4.47715 0 10 0H38C43.5229 0 48 4.47715 48 10V38C48 43.5229 43.5229 48 38 48H10C4.47715 48 0 43.5229 0 38V10Z" fill="#DBEAFE" />
    <path d="M33 27C33 27.5304 32.7893 28.0391 32.4142 28.4142C32.0391 28.7893 31.5304 29 31 29H19L15 33V17C15 16.4696 15.2107 15.9609 15.5858 15.5858C15.9609 15.2107 16.4696 15 17 15H31C31.5304 15 32.0391 15.2107 32.4142 15.5858C32.7893 15.9609 33 16.4696 33 17V27Z" stroke="#155DFC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const Last30DaysIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M0 10C0 4.47715 4.47715 0 10 0H38C43.5229 0 48 4.47715 48 10V38C48 43.5229 43.5229 48 38 48H10C4.47715 48 0 43.5229 0 38V10Z" fill="#CEFAFE" />
    <path d="M34 19L25.5 27.5L20.5 22.5L14 29" stroke="#0092B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M28 19H34V25" stroke="#0092B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const CompletionRateIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M0 10C0 4.47715 4.47715 0 10 0H38C43.5229 0 48 4.47715 48 10V38C48 43.5229 43.5229 48 38 48H10C4.47715 48 0 43.5229 0 38V10Z" fill="#D0FAE5" />
    <path d="M34 24H31.52C31.083 23.9991 30.6577 24.1413 30.3091 24.405C29.9606 24.6686 29.708 25.0392 29.59 25.46L27.24 33.82C27.2249 33.8719 27.1933 33.9175 27.15 33.95C27.1067 33.9825 27.0541 34 27 34C26.9459 34 26.8933 33.9825 26.85 33.95C26.8067 33.9175 26.7751 33.8719 26.76 33.82L21.24 14.18C21.2249 14.1281 21.1933 14.0825 21.15 14.05C21.1067 14.0175 21.0541 14 21 14C20.9459 14 20.8933 14.0175 20.85 14.05C20.8067 14.0825 20.7751 14.1281 20.76 14.18L18.41 22.54C18.2925 22.9592 18.0414 23.3285 17.6949 23.592C17.3483 23.8555 16.9253 23.9988 16.49 24H14" stroke="#009966" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const FilterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M3.54182 4.67498C5.22515 6.83331 8.33348 10.8333 8.33348 10.8333V15.8333C8.33348 16.2916 8.70848 16.6666 9.16681 16.6666H10.8335C11.2918 16.6666 11.6668 16.2916 11.6668 15.8333V10.8333C11.6668 10.8333 14.7668 6.83331 16.4501 4.67498C16.8751 4.12498 16.4835 3.33331 15.7918 3.33331H4.20015C3.50848 3.33331 3.11682 4.12498 3.54182 4.67498Z" fill="#32687A" />
  </svg>
)

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const MOCK_TOTAL_INTERACTIONS = 45
const MOCK_LAST_30_DAYS = 45
const MOCK_COMPLETION_RATE = '0%'
const MOCK_HISTORY_COUNT = 45

const FILTER_TYPES = [
  { value: '', label: 'Todos' },
  { value: 'call', label: 'Llamada' },
  { value: 'email', label: 'Correo' },
  { value: 'meeting', label: 'Reunión' },
  { value: 'note', label: 'Nota' },
  { value: 'system', label: 'Evento del sistema' },
]

const FILTER_STATUSES = [
  { value: '', label: 'Todos' },
  { value: 'resuelto', label: 'Resuelto' },
  { value: 'en_progreso', label: 'En progreso' },
  { value: 'cerrado', label: 'Cerrado' },
]

export const ClienteDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const { data: client, isLoading, isError, error } = useClientDetail(id ?? '')

  const [showFilters, setShowFilters] = useState(false)
  const [filterDateFrom, setFilterDateFrom] = useState('')
  const [filterDateTo, setFilterDateTo] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterAgent, setFilterAgent] = useState('')

  const hasActiveFilters = filterDateFrom || filterDateTo || filterType || filterStatus || filterAgent

  const handleClearFilters = () => {
    setFilterDateFrom('')
    setFilterDateTo('')
    setFilterType('')
    setFilterStatus('')
    setFilterAgent('')
  }

  return (
    <DashboardTemplate>
      <nav className={styles.breadcrumb} aria-label="Navegación de retorno">
        <Link to={ROUTES.DASHBOARD} className={styles.backLink}>
          <ArrowLeftIcon />
          Clientes
        </Link>
      </nav>

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
              'No se pudo cargar la información del cliente. Intenta de nuevo.'
            }
          />
        </div>
      )}

      {client && (
        <div className={styles.clientCard}>
          <div className={styles.clientAvatar}>
            <BuildingIcon />
          </div>
          <div className={styles.clientInfo}>
            <h1 className={styles.clientName}>{client.company}</h1>
            <span className={styles.clientMeta}>
              <MailIcon />
              {client.email}
            </span>
            <span className={styles.clientMeta}>
              <PhoneIcon />
              {client.phone ?? '—'}
            </span>
            <span className={styles.clientMeta}>
              <CalendarIcon />
              Cliente desde {formatDate(client.created_at)}
            </span>
          </div>
        </div>
      )}

      {client && (
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statContent}>
              <span className={styles.statLabel}>Total interacciones</span>
              <span className={styles.statValue}>{MOCK_TOTAL_INTERACTIONS}</span>
            </div>
            <TotalInteractionsIcon />
          </div>
          <div className={styles.statCard}>
            <div className={styles.statContent}>
              <span className={styles.statLabel}>Últimos 30 días</span>
              <span className={styles.statValue}>{MOCK_LAST_30_DAYS}</span>
            </div>
            <Last30DaysIcon />
          </div>
          <div className={styles.statCard}>
            <div className={styles.statContent}>
              <span className={styles.statLabel}>Tasa de completado</span>
              <span className={styles.statValue}>{MOCK_COMPLETION_RATE}</span>
            </div>
            <CompletionRateIcon />
          </div>
        </div>
      )}

      {client && (
        <div className={styles.historySection}>
          <div className={styles.historyHeader}>
            <div className={styles.historyTitleGroup}>
              <h2 className={styles.historyTitle}>Historial de interacciones</h2>
              <p className={styles.historyCount}>
                {MOCK_HISTORY_COUNT} interacciones encontradas
              </p>
            </div>
            <div className={styles.historyActions}>
              <button
                type="button"
                className={`${styles.filterBtn} ${hasActiveFilters ? styles.filterBtnActive : ''}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <FilterIcon />
                Filtros
              </button>
            </div>
          </div>

          {showFilters && (
            <div className={styles.filtersPanel}>
              <div className={styles.filtersGrid}>
                <div className={styles.filterField}>
                  <label className={styles.filterLabel}>Fecha desde</label>
                  <input
                    type="date"
                    className={styles.filterInput}
                    value={filterDateFrom}
                    onChange={(e) => setFilterDateFrom(e.target.value)}
                  />
                </div>
                <div className={styles.filterField}>
                  <label className={styles.filterLabel}>Fecha hasta</label>
                  <input
                    type="date"
                    className={styles.filterInput}
                    value={filterDateTo}
                    onChange={(e) => setFilterDateTo(e.target.value)}
                  />
                </div>
                <div className={styles.filterField}>
                  <label className={styles.filterLabel}>Tipo de interacción</label>
                  <select
                    className={styles.filterInput}
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    {FILTER_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.filterField}>
                  <label className={styles.filterLabel}>Estado</label>
                  <select
                    className={styles.filterInput}
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    {FILTER_STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.filterField}>
                  <label className={styles.filterLabel}>Agente</label>
                  <input
                    type="text"
                    className={styles.filterInput}
                    placeholder="Nombre del agente"
                    value={filterAgent}
                    onChange={(e) => setFilterAgent(e.target.value)}
                  />
                </div>
              </div>
              {hasActiveFilters && (
                <button
                  type="button"
                  className={styles.clearFiltersBtn}
                  onClick={handleClearFilters}
                >
                  <CloseIcon />
                  Limpiar filtros
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </DashboardTemplate>
  )
}

export default ClienteDetailPage
