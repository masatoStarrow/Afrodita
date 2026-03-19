import { apiClient } from './api.client'
import type { ApiResponse } from '@app-types/api.types'
import type {
  Interaction,
  CreateInteractionPayload,
  CreateInteractionResponse,
  InteractionListData,
  InteractionListResponse,
  InteractionListParams,
  ClientSummary,
} from '@app-types/interaction.types'

export const interactionsService = {
  create: async (payload: CreateInteractionPayload): Promise<Interaction> => {
    const { data } = await apiClient.post<CreateInteractionResponse>('/interactions/', payload)
    return data.data
  },

  listByClient: async (clientId: string, params?: InteractionListParams): Promise<InteractionListData> => {
    const { data } = await apiClient.get<InteractionListResponse>(
      `/interactions/client/${clientId}/`,
      { params },
    )
    return data.data
  },

  getClientSummary: async (clientId: string): Promise<ClientSummary> => {
    const { data } = await apiClient.get<ApiResponse<ClientSummary>>(
      `/interactions/client/${clientId}/summary/`,
    )
    return data.data
  },
}
