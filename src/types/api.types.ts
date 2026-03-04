export interface ApiResponse<T> {
  success: boolean
  data:    T
  message?: string
}

export interface ApiError {
  success: false
  error: {
    code:    string
    message: string
  }
}

export interface PaginatedResponse<T> {
  items:     T[]
  total:     number
  page:      number
  page_size: number
  pages:     number
}
