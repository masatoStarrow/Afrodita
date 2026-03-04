import styles from './Icon.module.css'

export type IconSize = 'sm' | 'md' | 'lg'

export interface IconProps {
  children: React.ReactNode
  size?: IconSize
  className?: string
  label?: string
}

export const Icon = ({ children, size = 'md', className, label }: IconProps) => {
  return (
    <span
      className={[styles.icon, styles[size], className].filter(Boolean).join(' ')}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={!label}
    >
      {children}
    </span>
  )
}
