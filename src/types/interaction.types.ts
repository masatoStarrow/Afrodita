export type InteractionType = 'call' | 'email' | 'meeting' | 'ticket' | 'note'
export type InteractionStatus = 'pending' | 'in_progress' | 'resolved' | 'closed'

export interface ClientMetricItem {
  client_id: string
  interaction_count: number
  last_interaction_date: string | null
}

export interface InteractionsMetrics {
  total_clients: number
  total_interactions: number
  avg_interactions_per_client: number
  per_client: ClientMetricItem[]
}

export interface ClientSummary {
  client_id: string
  total_interactions: number
  interactions_last_30_days: number
  by_type: Record<string, number>
  by_status: Record<string, number>
  completion_rate: number
  last_interaction_date: string | null
  next_follow_up_date: string | null
  open_tickets: number
}

export interface InteractionListParams {
  type?: string
  status?: string
  agent_id?: string
  date_from?: string
  date_to?: string
  page?: number
  page_size?: number
}

export interface ClientInteractionsList {
  items: unknown[]
  total: number
  page: number
  page_size: number
  pages: number
}