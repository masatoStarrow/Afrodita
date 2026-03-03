import { useAuthStore } from '@store/auth.store'
import { ROLES } from '@constants/roles.constants'

export const useRole = () => {
  const user = useAuthStore((s) => s.user)
  return {
    role:        user?.role,
    isAdmin:     user?.role === ROLES.ADMIN,
    isSoporte:   user?.role === ROLES.SOPORTE,
    isComercial: user?.role === ROLES.COMERCIAL,
  }
}
