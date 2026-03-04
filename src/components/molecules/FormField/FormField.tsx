import { forwardRef } from 'react'
import { Label } from '@components/atoms/Label'
import { Input } from '@components/atoms/Input'
import { Text } from '@components/atoms/Text'
import styles from './FormField.module.css'
import type { InputProps } from '@components/atoms/Input'

export interface FormFieldProps extends InputProps {
  label: string
  fieldId: string
  errorMessage?: string
  required?: boolean
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, fieldId, errorMessage, required, ...inputProps }, ref) => {
    return (
      <div className={styles.wrapper}>
        <Label htmlFor={fieldId} required={required}>
          {label}
        </Label>
        <Input
          id={fieldId}
          ref={ref}
          hasError={!!errorMessage}
          aria-describedby={errorMessage ? `${fieldId}-error` : undefined}
          {...inputProps}
        />
        {errorMessage && (
          <Text variant="error" as="span" className={styles.errorText}>
            <span id={`${fieldId}-error`} role="alert">{errorMessage}</span>
          </Text>
        )}
      </div>
    )
  }
)

FormField.displayName = 'FormField'
