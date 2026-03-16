import { apiClient } from './api.client'
import type { ApiResponse, PaginatedResponse } from '@app-types/api.types'
import type {
  InteractionsMetrics,
  ClientSummary,
  InteractionListParams,
} from '@app-types/interaction.types'

export const interactionsService = {
  getMetrics: async (): Promise<InteractionsMetrics> => {
    const { data } = await apiClient.get<ApiResponse<InteractionsMetrics>>('/interactions/metrics/')
    return data.data
  },

  getClientSummary: async (clientId: string): Promise<ClientSummary> => {
    const { data } = await apiClient.get<ApiResponse<ClientSummary>>(`/interactions/client/${clientId}/summary/`)
    return data.data
  },

  listByClient: async (clientId: string, params?: InteractionListParams): Promise<PaginatedResponse<unknown>> => {
    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<unknown>>>(`/interactions/client/${clientId}/`, {
      params,
    })
    return data.data
  },
}