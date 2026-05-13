import axios from 'axios'
import { API_URL } from '@constants/api.constants'
import { ROUTES } from '@constants/routes.constants'
import { useAuthStore } from '@store/auth.store'

// Si API_URL es undefined (porque Vite no leyó .env en tiempo de build Docker), usamos la ruta relativa
const safeApiUrl = API_URL ? (API_URL.endsWith('/') ? API_URL : `${API_URL}/`) : '/api/v1/'

export const apiClient = axios.create({
  baseURL: safeApiUrl,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

apiClient.interceptors.request.use((config) => {
  // Fijar rutas absolutas de Axios quitando el '/' inicial
  if (config.url && config.url.startsWith('/')) {
    config.url = config.url.substring(1)
  }
  // Obligar trailing slash para evitar redirecciones 301 de Django
  if (config.url && !config.url.includes('?') && !config.url.endsWith('/')) {
    config.url = `${config.url}/`
  } else if (config.url && config.url.includes('?')) {
    const [path, query] = config.url.split('?')
    if (!path.endsWith('/')) {
      config.url = `${path}/?${query}`
    }
  }

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
