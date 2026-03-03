import axios from 'axios'
import { API_URL } from '@constants/api.constants'
import { ROUTES } from '@constants/routes.constants'
import { useAuthStore } from '@store/auth.store'

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const requestUrl = error.config?.url ?? ''
      const isAuthEndpoint = requestUrl.includes('/auth/login') || requestUrl.includes('/auth/logout')
      if (!isAuthEndpoint) {
        useAuthStore.getState().clearAuth()
        window.location.href = ROUTES.LOGIN
      }
    }
    return Promise.reject(error)
  }
)
