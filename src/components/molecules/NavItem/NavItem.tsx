import { NavLink } from 'react-router-dom'
import { Icon } from '@components/atoms/Icon'
import { Text } from '@components/atoms/Text'
import styles from './NavItem.module.css'

export interface NavItemProps {
  to: string
  label: string
  icon?: React.ReactNode
}

export const NavItem = ({ to, label, icon }: NavItemProps) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [styles.navItem, isActive ? styles.active : ''].filter(Boolean).join(' ')
      }
    >
      {icon && <Icon size="sm">{icon}</Icon>}
      <Text variant="body" as="span">{label}</Text>
    </NavLink>
  )
}
