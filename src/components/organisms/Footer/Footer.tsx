import { Logo } from '@components/atoms/Logo'
import styles from './Footer.module.css'

export const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Logo size="sm" variant="light" />
          <p className={styles.description}>
            Sistema de gestión de interacciones con clientes diseñado
            para equipos comerciales, soporte y account managers.
          </p>
        </div>

        <p className={styles.copyright}>
          © {year} Starrow CRM. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}
