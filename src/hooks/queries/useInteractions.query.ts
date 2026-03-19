import { useQuery } from '@tanstack/react-query'
import { interactionsService } from '@services/interactions.service'
import type { InteractionListParams } from '@app-types/interaction.types'

export const INTERACTION_KEYS = {
  all:      ['interactions'] as const,
  summary:  (clientId: string) => ['interactions', 'summary', clientId] as const,
  byClient: (clientId: string, params?: InteractionListParams) =>
    ['interactions', 'client', clientId, params] as const,
}

export const useClientInteractions = (clientId: string, params?: InteractionListParams) => {
  return useQuery({
    queryKey: INTERACTION_KEYS.byClient(clientId, params),
    queryFn:  () => interactionsService.listByClient(clientId, params),
    enabled:  !!clientId,
    staleTime: 1 * 60 * 1000,
  })
}

export const useClientSummary = (clientId: string) => {
  return useQuery({
    queryKey: INTERACTION_KEYS.summary(clientId),
    queryFn:  () => interactionsService.getClientSummary(clientId),
    enabled:  !!clientId,
    staleTime: 2 * 60 * 1000,
  })
}
