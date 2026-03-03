import { apiClient } from './api.client'
import type { ClientListData, ClientListParams, ClientListResponse } from '@app-types/client.types'

export const clientsService = {
  list: async (params?: ClientListParams): Promise<ClientListData> => {
    const { data } = await apiClient.get<ClientListResponse>('/clients/', { params })
    return data.data
  },
}
