import { useState, type FormEvent } from 'react'
import { useUpdateInteraction } from '@hooks/mutations/useInteraction.mutation'
import type { Interaction, UpdateInteractionPayload, InteractionType, InteractionChannel, InteractionStatus } from '@app-types/interaction.types'
import styles from '../NewInteractionForm/NewInteractionForm.module.css'

const SUBJECT_MAX_LENGTH = 200

const INTERACTION_TYPES = [
  { value: 'call',    label: 'Llamada' },
  { value: 'email',   label: 'Correo' },
  { value: 'meeting', label: 'Reunión' },
  { value: 'ticket',  label: 'Mensaje' },
  { value: 'note',    label: 'Nota' },
] as const

const STATUSES = [
  { value: 'pending',     label: 'Pendiente' },
  { value: 'in_progress', label: 'En progreso' },
  { value: 'resolved',    label: 'Resuelto' },
  { value: 'closed',      label: 'Cerrado' },
] as const

const CHANNEL_BY_TYPE: Record<string, InteractionChannel> = {
  call:    'phone',
  email:   'email',
  meeting: 'in_person',
  ticket:  'platform',
  note:    'platform',
}

interface EditInteractionFormProps {
  interaction: Interaction
  onSuccess:   () => void
  onCancel:    () => void
}

export const EditInteractionForm = ({ interaction, onSuccess, onCancel }: EditInteractionFormProps) => {
  const { mutate, isPending, error } = useUpdateInteraction()

  const initialTypeIndex   = INTERACTION_TYPES.findIndex(t => t.value === interaction.type)
  const initialStatusIndex = STATUSES.findIndex(s => s.value === interaction.status)

  const [typeIndex, setTypeIndex]         = useState(initialTypeIndex >= 0 ? initialTypeIndex : 0)
  const [statusIndex, setStatusIndex]     = useState(initialStatusIndex >= 0 ? initialStatusIndex : 0)
  const [subject, setSubject]             = useState(interaction.subject)
  const [description, setDescription]     = useState(interaction.notes ?? '')
  const [internalNotes, setInternalNotes] = useState(interaction.internal_notes ?? '')

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const validate = (): boolean => {
    const errors: Record<string, string> = {}
    if (!subject.trim()) errors.subject = 'El asunto es obligatorio'
    else if (subject.trim().length < 3) errors.subject = 'Mínimo 3 caracteres'
    else if (subject.length > SUBJECT_MAX_LENGTH) errors.subject = `Máximo ${SUBJECT_MAX_LENGTH} caracteres`
    if (!description.trim()) errors.description = 'La descripción es obligatoria'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const selectedType = INTERACTION_TYPES[typeIndex].value as InteractionType
    const channel = CHANNEL_BY_TYPE[selectedType] ?? 'platform'

    const payload: UpdateInteractionPayload = {
      type:    selectedType,
      channel,
      subject: subject.trim(),
      status:  STATUSES[statusIndex].value as InteractionStatus,
      notes:   description.trim() || null,
      internal_notes: internalNotes.trim() || null,
    }

    mutate({ id: interaction.id, payload }, { onSuccess })
  }

  const serverError = error
    ? (error as { response?: { data?: { error?: { message?: string } } } })
        ?.response?.data?.error?.message ?? 'Error al actualizar la interacción'
    : null

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <p className={styles.subtitle}>Modifica los campos de la interacción</p>

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
          maxLength={SUBJECT_MAX_LENGTH}
        />
        <div className={styles.charCounterRow}>
          {fieldErrors.subject && <span className={styles.error}>{fieldErrors.subject}</span>}
          <span className={`${styles.charCounter} ${subject.length > 180 ? styles.charWarning : ''}`}>
            {subject.length}/{SUBJECT_MAX_LENGTH}
          </span>
        </div>
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
          {isPending ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>
    </form>
  )
}
