import type { ElementType } from 'react'
import styles from './Text.module.css'

export type TextVariant = 'heading' | 'body' | 'caption' | 'error'

export interface TextProps {
  variant?: TextVariant
  children: React.ReactNode
  className?: string
  as?: ElementType
}

export const Text = ({
  variant = 'body',
  children,
  className,
  as: Tag = 'p',
}: TextProps) => {
  return (
    <Tag className={[styles.text, styles[variant], className].filter(Boolean).join(' ')}>
      {children}
    </Tag>
  )
}
