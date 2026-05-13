import { apiClient } from './api.client'
import type { ApiResponse } from '@app-types/api.types'

interface UserItem {
  id:        string
  email:     string
  full_name: string
}

interface UsersListData {
  items: UserItem[]
  total: number
}

type UsersListResponse = ApiResponse<UsersListData>

export type AgentMap = Record<string, string>

export const usersService = {
  getAgentMap: async (): Promise<AgentMap> => {
    const { data } = await apiClient.get<UsersListResponse>('/users/', {
      params: { page_size: 100 },
    })
    const map: AgentMap = {}
    for (const user of data.data.items) {
      map[user.id] = user.full_name || user.email.split('@')[0]
    }
    return map
  },
}
