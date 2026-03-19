import { useQuery } from '@tanstack/react-query'
import { usersService } from '@services/users.service'

export const USER_KEYS = {
  agentMap: ['users', 'agentMap'] as const,
}

export const useAgentMap = () => {
  return useQuery({
    queryKey: USER_KEYS.agentMap,
    queryFn:  () => usersService.getAgentMap(),
    staleTime: 10 * 60 * 1000,
  })
}
