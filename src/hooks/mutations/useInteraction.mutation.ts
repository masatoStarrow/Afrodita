import { useMutation, useQueryClient } from '@tanstack/react-query'
import { interactionsService } from '@services/interactions.service'
import { METRICS_KEYS } from '@hooks/queries/useMetrics.query'
import { INTERACTION_KEYS } from '@hooks/queries/useInteractions.query'
import type { CreateInteractionPayload, UpdateInteractionPayload } from '@app-types/interaction.types'

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

export const useUpdateInteraction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateInteractionPayload }) =>
      interactionsService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: METRICS_KEYS.all })
      queryClient.invalidateQueries({ queryKey: INTERACTION_KEYS.all })
    },
  })
}

export const useDeleteInteraction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => interactionsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: METRICS_KEYS.all })
      queryClient.invalidateQueries({ queryKey: INTERACTION_KEYS.all })
    },
  })
}
