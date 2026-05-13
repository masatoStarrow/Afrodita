import { useQuery } from '@tanstack/react-query'
import { usersService, type AgentMap } from '@services/users.service'
import { useAuthStore } from '@store/auth.store'

export const USER_KEYS = {
  agentMap: ['users', 'agentMap'] as const,
}

export const useAgentMap = () => {
  const user = useAuthStore((s) => s.user)

  const query = useQuery({
    queryKey: USER_KEYS.agentMap,
    queryFn:  () => usersService.getAgentMap(),
    staleTime: 10 * 60 * 1000,
    retry: false,
  })

  const fallbackMap: AgentMap = {}
  if (user) {
    fallbackMap[user.id] = user.full_name || user.email.split('@')[0]
  }

  return {
    ...query,
    data: { ...fallbackMap, ...(query.data ?? {}) },
  }
}
