import type { ApiResponse } from './api.types'

export type InteractionType    = 'call' | 'email' | 'meeting' | 'ticket' | 'note'
export type InteractionChannel = 'phone' | 'email' | 'whatsapp' | 'in_person' | 'platform'
export type InteractionStatus  = 'open' | 'pending' | 'in_progress' | 'resolved' | 'closed'

export interface CreateInteractionPayload {
  client_id:         string
  type:              InteractionType
  channel:           InteractionChannel
  subject:           string
  status:            InteractionStatus
  interaction_date:  string
  notes?:            string
  internal_notes?:   string
  outcome?:          string
  follow_up_date?:   string
  duration_minutes?: number
}

export interface Interaction {
  id:                string
  client_id:         string
  agent_id:          string
  type:              InteractionType
  channel:           InteractionChannel
  subject:           string
  status:            InteractionStatus
  notes:             string | null
  internal_notes:    string | null
  outcome:           string | null
  interaction_date:  string
  follow_up_date:    string | null
  duration_minutes:  number | null
  is_deleted:        boolean
  last_edited_by:    string | null
  created_at:        string
  updated_at:        string
}

export type CreateInteractionResponse = ApiResponse<Interaction>

export interface InteractionListData {
  items:     Interaction[]
  total:     number
  page:      number
  page_size: number
  pages:     number
}

export interface InteractionListResponse {
  success: boolean
  data:    InteractionListData
}

export interface InteractionListParams {
  page?:      number
  page_size?: number
  type?:      string
  status?:    string
  date_from?: string
  date_to?:   string
  agent_id?:  string
  order_by?:  string
  order_dir?: 'asc' | 'desc'
}

export interface ClientSummary {
  client_id:                string
  total_interactions:       number
  interactions_last_30_days: number
  by_type:                  Record<string, number>
  by_status:                Record<string, number>
  completion_rate:          number
  last_interaction_date:    string | null
  next_follow_up_date:      string | null
  open_tickets:             number
}
