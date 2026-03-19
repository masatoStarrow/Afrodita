import { useQuery } from '@tanstack/react-query'
import { metricsService } from '@services/metrics.service'

export const METRICS_KEYS = {
  all:     ['metrics'] as const,
  global:  ['metrics', 'global'] as const,
}

export const useMetrics = () => {
  return useQuery({
    queryKey: METRICS_KEYS.global,
    queryFn:  () => metricsService.getMetrics(),
    staleTime: 2 * 60 * 1000,
  })
}
