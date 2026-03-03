import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FormField } from '@components/molecules/FormField'
import { AlertMessage } from '@components/molecules/AlertMessage'
import { Button } from '@components/atoms/Button'
import { Text } from '@components/atoms/Text'
import { useLoginMutation } from '@hooks/mutations/useAuth.mutation'
import { ROUTES } from '@constants/routes.constants'
import { loginSchema, type LoginFormValues } from './LoginForm.schema'
import styles from './LoginForm.module.css'

const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    const code   = error.response?.data?.error?.code

    if (status === 429 || code === 'RATE_LIMIT_EXCEEDED') {
      return 'Demasiados intentos fallidos. Espera un minuto antes de intentarlo de nuevo.'
    }
    if (status === 401) {
      return 'Correo o contraseña incorrectos.'
    }
    if (!error.response) {
      return 'No se pudo conectar con el servidor. Verifica tu conexión.'
    }
  }
  return 'Ha ocurrido un error inesperado. Intenta de nuevo.'
}

export const LoginForm = () => {
  const navigate = useNavigate()
  const { mutate: login, isPending, error, isError, reset: resetMutation } = useLoginMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (values: LoginFormValues) => {
    resetMutation()
    login(values, {
      onSuccess: () => navigate(ROUTES.DASHBOARD, { replace: true }),
    })
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className={styles.header}>
        <Text variant="heading" as="h1">Bienvenido de vuelta</Text>
        <Text variant="caption" as="p">Ingresa tus credenciales para acceder al sistema</Text>
      </div>

      {isError && error && (
        <AlertMessage variant="error" message={getErrorMessage(error)} />
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
