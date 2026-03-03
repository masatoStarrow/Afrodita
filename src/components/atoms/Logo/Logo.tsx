import starLogo from '@assets/star-logo.svg'
import styles from './Logo.module.css'

export type LogoSize    = 'sm' | 'md' | 'lg'
export type LogoVariant = 'default' | 'light'

export interface LogoProps {
  size?:    LogoSize
  variant?: LogoVariant
  className?: string
}

export const Logo = ({ size = 'md', variant = 'default', className }: LogoProps) => {
  return (
    <div className={[styles.logo, styles[size], styles[variant], className].filter(Boolean).join(' ')}>
      <img src={starLogo} alt="" className={styles.star} aria-hidden="true" />
      <span className={styles.text}>
        <span className={styles.starrow}>Starrow</span>
        <span className={styles.crm}>CRM</span>
      </span>
    </div>
  )
}
