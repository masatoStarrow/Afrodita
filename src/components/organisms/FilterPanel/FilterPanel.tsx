/* eslint-disable react-refresh/only-export-components */
import { useCallback, useEffect } from 'react'
import type { InteractionType, InteractionStatus } from '@app-types/interaction.types'
import styles from './FilterPanel.module.css'

export interface FilterState {
  dateFrom:  string
  dateTo:    string
  types:     InteractionType[]
  statuses:  InteractionStatus[]
  agentIds:  string[]
}

export const INITIAL_FILTERS: FilterState = {
  dateFrom:  '',
  dateTo:    '',
  types:     [],
  statuses:  [],
  agentIds:  [],
}

export const hasActiveFilters = (f: FilterState): boolean =>
  !!(f.dateFrom || f.dateTo || f.types.length || f.statuses.length || f.agentIds.length)

interface FilterPanelProps {
  isOpen:    boolean
  onClose:   () => void
  filters:   FilterState
  onChange:  (filters: FilterState) => void
  agentMap:  Record<string, string>
}

const TYPE_OPTIONS: { value: InteractionType; label: string }[] = [
  { value: 'call',    label: 'Llamada' },
  { value: 'email',   label: 'Correo' },
  { value: 'ticket',  label: 'Mensaje' },
  { value: 'meeting', label: 'Reunión' },
  { value: 'note',    label: 'Nota' },
]

const STATUS_OPTIONS: { value: InteractionStatus; label: string }[] = [
  { value: 'open',        label: 'Abierto' },
  { value: 'in_progress', label: 'En progreso' },
  { value: 'resolved',    label: 'Resuelto' },
  { value: 'closed',      label: 'Cerrado' },
  { value: 'pending',     label: 'Pendiente' },
]

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

export const FilterPanel = ({ isOpen, onClose, filters, onChange, agentMap }: FilterPanelProps) => {
  const toggleType = useCallback((type: InteractionType) => {
    const next = filters.types.includes(type)
      ? filters.types.filter(t => t !== type)
      : [...filters.types, type]
    onChange({ ...filters, types: next })
  }, [filters, onChange])

  const toggleStatus = useCallback((status: InteractionStatus) => {
    const next = filters.statuses.includes(status)
      ? filters.statuses.filter(s => s !== status)
      : [...filters.statuses, status]
    onChange({ ...filters, statuses: next })
  }, [filters, onChange])

  const toggleAgent = useCallback((agentId: string) => {
    const next = filters.agentIds.includes(agentId)
      ? filters.agentIds.filter(a => a !== agentId)
      : [...filters.agentIds, agentId]
    onChange({ ...filters, agentIds: next })
  }, [filters, onChange])

  const handleClear = useCallback(() => {
    onChange(INITIAL_FILTERS)
  }, [onChange])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  const isActive = hasActiveFilters(filters)
  const agents   = Object.entries(agentMap)

  if (!isOpen) return null

  return (
    <div
      className={styles.panel}
      role="dialog"
      aria-modal="true"
      aria-label="Filtros avanzados"
    >
        <div className={styles.header}>
          <h3 className={styles.title}>Filtros Avanzados</h3>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Cerrar filtros"
          >
            <CloseIcon />
          </button>
        </div>

        <div className={styles.body}>
          <section className={styles.section}>
            <h4 className={styles.sectionTitle}>Rango de fecha</h4>
            <div className={styles.dateRow}>
              <div className={styles.dateField}>
                <label className={styles.dateLabel} htmlFor="filter-date-from">
                  Fecha de inicio
                </label>
                <input
                  id="filter-date-from"
                  type="date"
                  className={styles.dateInput}
                  value={filters.dateFrom}
                  max={filters.dateTo || undefined}
                  onChange={(e) => onChange({ ...filters, dateFrom: e.target.value })}
                />
              </div>
              <div className={styles.dateField}>
                <label className={styles.dateLabel} htmlFor="filter-date-to">
                  Fecha de Fin
                </label>
                <input
                  id="filter-date-to"
                  type="date"
                  className={styles.dateInput}
                  value={filters.dateTo}
                  min={filters.dateFrom || undefined}
                  onChange={(e) => onChange({ ...filters, dateTo: e.target.value })}
                />
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h4 className={styles.sectionTitle}>Tipos de interacción</h4>
            <ul className={styles.checkList}>
              {TYPE_OPTIONS.map(({ value, label }) => (
                <li key={value}>
                  <label className={styles.checkLabel}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={filters.types.includes(value)}
                      onChange={() => toggleType(value)}
                    />
                    {label}
                  </label>
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.section}>
            <h4 className={styles.sectionTitle}>Cambio de estado</h4>
            <ul className={styles.checkList}>
              {STATUS_OPTIONS.map(({ value, label }) => (
                <li key={value}>
                  <label className={styles.checkLabel}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={filters.statuses.includes(value)}
                      onChange={() => toggleStatus(value)}
                    />
                    {label}
                  </label>
                </li>
              ))}
            </ul>
          </section>

          {agents.length > 0 && (
            <section className={styles.section}>
              <h4 className={styles.sectionTitle}>Agente</h4>
              <ul className={styles.checkList}>
                {agents.map(([id, name]) => (
                  <li key={id}>
                    <label className={styles.checkLabel}>
                      <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={filters.agentIds.includes(id)}
                        onChange={() => toggleAgent(id)}
                      />
                      {name}
                    </label>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {isActive && (
          <div className={styles.footer}>
            <button type="button" className={styles.clearBtn} onClick={handleClear}>
              Limpiar filtros
            </button>
          </div>
        )}
    </div>
  )
}
