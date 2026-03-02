import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { FormField } from '@components/molecules/FormField'
import { AlertMessage } from '@components/molecules/AlertMessage'
import { Button } from '@components/atoms/Button'
import { Text } from '@components/atoms/Text'
import { useLoginMutation } from '@hooks/mutations/useAuth.mutation'
import { ROUTES } from '@constants/routes.constants'
import { loginSchema, type LoginFormValues } from './LoginForm.schema'
import styles from './LoginForm.module.css'

export const LoginForm = () => {
  const navigate = useNavigate()
  const { mutate: login, isPending, error, isError } = useLoginMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (values: LoginFormValues) => {
    login(values, {
      onSuccess: () => navigate(ROUTES.DASHBOARD, { replace: true }),
    })
  }

  const serverError = isError
    ? 'Credenciales inválidas. Verifica tu email y contraseña.'
    : null

  if (error) {
    console.error(error)
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className={styles.header}>
        <Text variant="heading" as="h1">Bienvenido de vuelta</Text>
        <Text variant="caption" as="p">Ingresa tus credenciales para acceder al sistema</Text>
      </div>

      {serverError && (
        <AlertMessage variant="error" message={serverError} />
      )}

      <div className={styles.fields}>
        <FormField
          label="Correo electrónico"
          fieldId="email"
          type="email"
          placeholder="tu@empresa.com"
          autoComplete="email"
          errorMessage={errors.email?.message}
          {...register('email')}
        />

        <FormField
          label="Contraseña"
          fieldId="password"
          type="password"
          placeholder="••••••••••"
          autoComplete="current-password"
          errorMessage={errors.password?.message}
          {...register('password')}
        />
      </div>

      <Button type="submit" variant="primary" loading={isPending}>
        Iniciar sesión
      </Button>
    </form>
  )
}
