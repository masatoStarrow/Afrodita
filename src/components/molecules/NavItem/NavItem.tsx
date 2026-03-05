import { NavLink } from 'react-router-dom'
import styles from './NavItem.module.css'

export interface NavItemProps {
  to: string
  label: string
  icon?: React.ReactNode
}

export const NavItem = ({ to, label, icon }: NavItemProps) => {
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <NavLink
      to={to}
      onClick={handleClick}
      className={({ isActive }) =>
        [styles.navItem, isActive ? styles.active : ''].filter(Boolean).join(' ')
      }
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      <span className={styles.label}>{label}</span>
    </NavLink>
  )
}
