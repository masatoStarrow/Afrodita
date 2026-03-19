import type { ApiResponse } from './api.types'

export interface ClientMetric {
  client_id:             string
  interaction_count:     number
  last_interaction_date: string | null
}

export interface MetricsData {
  total_clients:              number
  total_interactions:         number
  avg_interactions_per_client: number
  per_client:                 ClientMetric[]
}

export type MetricsResponse = ApiResponse<MetricsData>
