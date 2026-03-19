import { apiClient } from './api.client'
import type { MetricsData, MetricsResponse } from '@app-types/metrics.types'

export const metricsService = {
  getMetrics: async (): Promise<MetricsData> => {
    const { data } = await apiClient.get<MetricsResponse>('/interactions/metrics/')
    return data.data
  },
}
