import styles from './Label.module.css'

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
}

export const Label = ({ children, required, className, ...props }: LabelProps) => {
  return (
    <label className={[styles.label, className].filter(Boolean).join(' ')} {...props}>
      {children}
      {required && <span className={styles.required} aria-hidden="true"> *</span>}
    </label>
  )
}
