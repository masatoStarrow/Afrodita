import { Header } from '@components/organisms/Header'
import { Footer } from '@components/organisms/Footer'
import styles from './DashboardTemplate.module.css'

export interface DashboardTemplateProps {
  children: React.ReactNode
}

export const DashboardTemplate = ({ children }: DashboardTemplateProps) => {
  return (
    <div className={styles.wrapper}>
      <Header />
      <main className={styles.main}>
        <div className={styles.content}>
          {children}
        </div>
      </main>
      <Footer />
    </div>
  )
}
