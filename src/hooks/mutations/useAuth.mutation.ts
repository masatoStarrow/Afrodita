import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authService } from '@services/auth.service'
import { useAuthStore } from '@store/auth.store'
import type { LoginRequest } from '@app-types/auth.types'

export const useLoginMutation = () => {
  const setAuth = useAuthStore((s) => s.setAuth)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const { access_token, token_type } = await authService.login(credentials)
      const user = await authService.getMe(access_token)
      return { access_token, token_type, user }
    },
    onSuccess: ({ access_token, user }) => {
      queryClient.clear()
      setAuth(access_token, user)
    },
  })
}

export const useLogoutMutation = () => {
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => {
      queryClient.clear()
      clearAuth()
    },
  })
}
