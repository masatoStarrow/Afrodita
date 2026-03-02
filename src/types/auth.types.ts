export type Role = 'admin' | 'soporte' | 'comercial'

export interface User {
  id:        string
  email:     string
  full_name: string
  role:      Role
  is_active?: boolean
}

export interface LoginRequest {
  email:    string
  password: string
}

export interface LoginResponse {
  success: boolean
  data: {
    access_token: string
    token_type:   string
  }
  message: string
}

export interface MeResponse {
  success: boolean
  data:    User
  message: string
}
