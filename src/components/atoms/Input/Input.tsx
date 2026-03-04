import { forwardRef } from 'react'
import styles from './Input.module.css'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
  hasError?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, hasError, className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={[
          styles.input,
          (error || hasError) ? styles.inputError : '',
          className,
        ].filter(Boolean).join(' ')}
        aria-invalid={!!(error || hasError)}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'
