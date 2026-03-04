import { Logo } from '@components/atoms/Logo'
import { NavItem } from '@components/molecules/NavItem'
import { useAuthStore } from '@store/auth.store'
import { useLogoutMutation } from '@hooks/mutations/useAuth.mutation'
import { ROUTES } from '@constants/routes.constants'
import { ROLE_LABELS } from '@constants/roles.constants'
import type { Role } from '@constants/roles.constants'
import styles from './Header.module.css'

export const Header = () => {
  const user = useAuthStore((s) => s.user)
  const { mutate: logout, isPending } = useLogoutMutation()

  if (!user) return null

  const roleLabel = ROLE_LABELS[user.role as Role] ?? user.role

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Logo size="sm" variant="light" />

        <nav className={styles.nav} aria-label="Navegación principal">
          <NavItem to={ROUTES.DASHBOARD} label="Clientes" />
        </nav>

        <div className={styles.right}>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user.full_name}</span>
            <span className={styles.userEmail}>{user.email}</span>
          </div>

          <span className={styles.roleBadge}>{roleLabel}</span>

          <button
            className={styles.logoutBtn}
            onClick={() => logout()}
            disabled={isPending}
            type="button"
            aria-label="Cerrar sesión"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Salir
          </button>
        </div>
      </div>
    </header>
  )
}
