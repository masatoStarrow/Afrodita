import { DashboardTemplate } from '@components/templates/DashboardTemplate'
import { Text } from '@components/atoms/Text'
import { useAuthStore } from '@store/auth.store'
import styles from './DashboardPage.module.css'

const DashboardPage = () => {
  const user = useAuthStore((s) => s.user)

  return (
    <DashboardTemplate>
      <div className={styles.welcome}>
        <Text variant="heading" as="h1">
          Bienvenido, {user?.full_name ?? 'Usuario'} 👋
        </Text>
        <Text variant="caption" as="p">
          Aquí verás un resumen de las actividades del CRM.
        </Text>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <Text variant="body" as="h2" className={styles.cardTitle}>Clientes activos</Text>
          <Text variant="heading" as="p" className={styles.cardValue}>—</Text>
        </div>
        <div className={styles.card}>
          <Text variant="body" as="h2" className={styles.cardTitle}>Interacciones hoy</Text>
          <Text variant="heading" as="p" className={styles.cardValue}>—</Text>
        </div>
        <div className={styles.card}>
          <Text variant="body" as="h2" className={styles.cardTitle}>Tickets abiertos</Text>
          <Text variant="heading" as="p" className={styles.cardValue}>—</Text>
        </div>
      </div>
    </DashboardTemplate>
  )
}

export default DashboardPage
