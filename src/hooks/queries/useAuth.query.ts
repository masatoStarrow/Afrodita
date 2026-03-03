import { useQuery } from '@tanstack/react-query'
import { authService } from '@services/auth.service'
import { useAuthStore } from '@store/auth.store'

export const useMe = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated())

  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => authService.getMe(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  })
}
