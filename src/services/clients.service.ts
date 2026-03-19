import { apiClient } from './api.client'
import type { Client, ClientListData, ClientListParams, ClientListResponse, ClientDetailResponse } from '@app-types/client.types'

export const clientsService = {
  list: async (params?: ClientListParams): Promise<ClientListData> => {
    const { data } = await apiClient.get<ClientListResponse>('/clients/', { params })
    return data.data
  },

  getById: async (id: string): Promise<Client> => {
    const { data } = await apiClient.get<ClientDetailResponse>(`/clients/${id}`)
    return data.data
  },
}
