import { Logo } from '@components/atoms/Logo'
import styles from './AuthTemplate.module.css'

export interface AuthTemplateProps {
  children: React.ReactNode
}

export const AuthTemplate = ({ children }: AuthTemplateProps) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.logoWrapper}>
        <Logo size="lg" />
      </div>
      <main className={styles.card}>
        {children}
      </main>
    </div>
  )
}
