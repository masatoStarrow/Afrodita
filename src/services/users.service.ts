import { apiClient } from './api.client'
import type { ApiResponse } from '@app-types/api.types'

interface UserItem {
  id:         string
  email:      string
  first_name: string | null
  last_name:  string | null
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
      const name = [user.first_name, user.last_name].filter(Boolean).join(' ')
      map[user.id] = name || user.email.split('@')[0]
    }
    return map
  },
}
