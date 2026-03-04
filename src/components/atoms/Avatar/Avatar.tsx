import styles from './Avatar.module.css'
import { formatInitials } from '@utils/format.utils'

export interface AvatarProps {
  name: string
  src?: string
  size?: 'sm' | 'md' | 'lg'
}

export const Avatar = ({ name, src, size = 'md' }: AvatarProps) => {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={[styles.avatar, styles[size]].join(' ')}
      />
    )
  }

  return (
    <span
      className={[styles.avatar, styles.initials, styles[size]].join(' ')}
      aria-label={name}
    >
      {formatInitials(name)}
    </span>
  )
}
