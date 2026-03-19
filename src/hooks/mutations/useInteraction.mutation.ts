import { useMutation, useQueryClient } from '@tanstack/react-query'
import { interactionsService } from '@services/interactions.service'
import { METRICS_KEYS } from '@hooks/queries/useMetrics.query'
import { INTERACTION_KEYS } from '@hooks/queries/useInteractions.query'
import type { CreateInteractionPayload } from '@app-types/interaction.types'

export const useCreateInteraction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateInteractionPayload) =>
      interactionsService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: METRICS_KEYS.all })
      queryClient.invalidateQueries({ queryKey: INTERACTION_KEYS.all })
    },
  })
}
