import styles from './Spinner.module.css'

export type SpinnerSize = 'sm' | 'md' | 'lg'

export interface SpinnerProps {
  size?: SpinnerSize
  color?: string
}

export const Spinner = ({ size = 'md' }: SpinnerProps) => {
  return (
    <span
      className={[styles.spinner, styles[size]].join(' ')}
      role="status"
      aria-label="Cargando"
    />
  )
}
