import { apiClient } from './api.client'
import type { LoginRequest, LoginResponse, MeResponse, User } from '@app-types/auth.types'

export const authService = {
  login: async (credentials: LoginRequest): Promise<{ access_token: string; token_type: string }> => {
    const { data } = await apiClient.post<LoginResponse>('/auth/login', credentials)
    return data.data
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout')
  },

  getMe: async (token?: string): Promise<User> => {
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined
    const { data } = await apiClient.get<MeResponse>('/auth/me', { headers })
    return data.data
  },
}
