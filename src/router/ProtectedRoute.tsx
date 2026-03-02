import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@store/auth.store'
import { ROUTES } from '@constants/routes.constants'

export const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated())
  return isAuthenticated ? <Outlet /> : <Navigate to={ROUTES.LOGIN} replace />
}
