import styles from './AlertMessage.module.css'
import { Text } from '@components/atoms/Text'

export type AlertVariant = 'error' | 'success' | 'warning'

export interface AlertMessageProps {
  variant: AlertVariant
  message: string
}

const ICONS: Record<AlertVariant, string> = {
  error:   '✕',
  success: '✓',
  warning: '⚠',
}

export const AlertMessage = ({ variant, message }: AlertMessageProps) => {
  return (
    <div
      className={[styles.alert, styles[variant]].join(' ')}
      role="alert"
      aria-live="polite"
    >
      <span className={styles.icon} aria-hidden="true">{ICONS[variant]}</span>
      <Text variant="body" as="span">{message}</Text>
    </div>
  )
}
