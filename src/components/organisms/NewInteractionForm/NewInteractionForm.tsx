import { useState, type FormEvent } from 'react'
import { useCreateInteraction } from '@hooks/mutations/useInteraction.mutation'
import type { CreateInteractionPayload } from '@app-types/interaction.types'
import styles from './NewInteractionForm.module.css'

const INTERACTION_TYPES = [
  { value: 'call',    label: 'Llamada' },
  { value: 'email',   label: 'Correo' },
  { value: 'meeting', label: 'Reunión' },
  { value: 'ticket',  label: 'Mensaje' },
  { value: 'note',    label: 'Nota' },
  { value: 'note',    label: 'Cambio de estado', backendChannel: 'platform' as const },
] as const

const STATUSES = [
  { value: 'pending',     label: 'Abierto' },
  { value: 'in_progress', label: 'En progreso' },
  { value: 'resolved',    label: 'Resuelto' },
  { value: 'closed',      label: 'Cerrado' },
  { value: 'pending',     label: 'Pendiente' },
] as const

const CHANNEL_BY_TYPE: Record<string, string> = {
  call:    'phone',
  email:   'email',
  meeting: 'in_person',
  ticket:  'platform',
  note:    'platform',
}

interface NewInteractionFormProps {
  clientId: string
  onSuccess: () => void
  onCancel: () => void
}

export const NewInteractionForm = ({ clientId, onSuccess, onCancel }: NewInteractionFormProps) => {
  const { mutate, isPending, error } = useCreateInteraction()

  const [typeIndex, setTypeIndex]     = useState(0)
  const [statusIndex, setStatusIndex] = useState(0)
  const [subject, setSubject]         = useState('')
  const [description, setDescription] = useState('')
  const [internalNotes, setInternalNotes] = useState('')

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const validate = (): boolean => {
    const errors: Record<string, string> = {}
    if (!subject.trim()) errors.subject = 'El asunto es obligatorio'
    else if (subject.trim().length < 3) errors.subject = 'Mínimo 3 caracteres'
    if (!description.trim()) errors.description = 'La descripción es obligatoria'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const selectedType = INTERACTION_TYPES[typeIndex]
    const typeValue = selectedType.value
    const channel = ('backendChannel' in selectedType ? selectedType.backendChannel : CHANNEL_BY_TYPE[typeValue]) || 'platform'

    const payload: CreateInteractionPayload = {
      client_id:        clientId,
      type:             typeValue as CreateInteractionPayload['type'],
      channel:          channel as CreateInteractionPayload['channel'],
      subject:          subject.trim(),
      status:           STATUSES[statusIndex].value as CreateInteractionPayload['status'],
      interaction_date: new Date().toISOString(),
      notes:            description.trim(),
      ...(internalNotes.trim() && { internal_notes: internalNotes.trim() }),
    }

    mutate(payload, { onSuccess })
  }

  const serverError = error
    ? (error as { response?: { data?: { error?: { message?: string } } } })
        ?.response?.data?.error?.message ?? 'Error al crear la interacción'
    : null

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <p className={styles.subtitle}>Registra una nueva interacción con el cliente</p>

      {serverError && <div className={styles.serverError}>{serverError}</div>}

      <div className={styles.field}>
        <label className={styles.label}>
          Tipo de Interacción <span className={styles.required}>*</span>
        </label>
        <div className={styles.selectWrapper}>
          <select
            className={styles.select}
            value={typeIndex}
            onChange={(e) => setTypeIndex(Number(e.target.value))}
          >
            {INTERACTION_TYPES.map((t, i) => (
              <option key={i} value={i}>{t.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>
          Estado <span className={styles.required}>*</span>
        </label>
        <div className={styles.selectWrapper}>
          <select
            className={styles.select}
            value={statusIndex}
            onChange={(e) => setStatusIndex(Number(e.target.value))}
          >
            {STATUSES.map((s, i) => (
              <option key={i} value={i}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>
          Asunto <span className={styles.required}>*</span>
        </label>
        <input
          className={styles.input}
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        {fieldErrors.subject && <span className={styles.error}>{fieldErrors.subject}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>
          Descripción <span className={styles.required}>*</span>
        </label>
        <textarea
          className={styles.textarea}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {fieldErrors.description && <span className={styles.error}>{fieldErrors.description}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Notas Internas (Opcional)</label>
        <textarea
          className={styles.textarea}
          value={internalNotes}
          onChange={(e) => setInternalNotes(e.target.value)}
        />
        <span className={styles.helperText}>
          Estas notas solo son visibles para el equipo interno, no para los clientes
        </span>
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.cancelBtn} onClick={onCancel} disabled={isPending}>
          Cancelar
        </button>
        <button type="submit" className={styles.submitBtn} disabled={isPending}>
          {isPending ? 'Creando...' : 'Crear Interacción'}
        </button>
      </div>
    </form>
  )
}
