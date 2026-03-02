import { useState } from 'react'
import { Avatar } from '@components/atoms/Avatar'
import { Text } from '@components/atoms/Text'
import { Button } from '@components/atoms/Button'
import styles from './UserMenu.module.css'
import type { User } from '@app-types/auth.types'

export interface UserMenuProps {
  user: User
  onLogout: () => void
  isLoggingOut?: boolean
}

export const UserMenu = ({ user, onLogout, isLoggingOut = false }: UserMenuProps) => {
  const [open, setOpen] = useState(false)

  return (
    <div className={styles.wrapper}>
      <button
        className={styles.trigger}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="menu"
        type="button"
      >
        <Avatar name={user.full_name} size="sm" />
        <div className={styles.info}>
          <Text variant="body" as="span" className={styles.name}>{user.full_name}</Text>
          <Text variant="caption" as="span" className={styles.role}>{user.role}</Text>
        </div>
        <span className={styles.chevron} aria-hidden="true">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className={styles.dropdown} role="menu">
          <Button
            variant="danger"
            loading={isLoggingOut}
            onClick={() => { setOpen(false); onLogout() }}
            className={styles.logoutBtn}
          >
            Cerrar sesión
          </Button>
        </div>
      )}
    </div>
  )
}
