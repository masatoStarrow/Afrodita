export type ClientStatus = 'active' | 'inactive'

export interface Client {
  id:         string
  company:    string
  email:      string
  phone:      string | null
  status:     ClientStatus
  created_at: string
  updated_at: string
}

export interface ClientListData {
  items:     Client[]
  total:     number
  page:      number
  page_size: number
  pages:     number
}

export interface ClientListResponse {
  success: boolean
  data:    ClientListData
}

export interface ClientDetailResponse {
  success: boolean
  data:    Client
  message: string
}

export interface ClientListParams {
  status?:    ClientStatus
  page?:      number
  page_size?: number
}
