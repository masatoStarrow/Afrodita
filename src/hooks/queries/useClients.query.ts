import { useQuery } from '@tanstack/react-query'
import { clientsService } from '@services/clients.service'
import type { ClientListParams } from '@app-types/client.types'

export const CLIENT_KEYS = {
  all:    ['clients'] as const,
  list:   (params?: ClientListParams) => ['clients', 'list', params] as const,
  detail: (id: string) => ['clients', 'detail', id] as const,
}

export const useClients = (params?: ClientListParams) => {
  return useQuery({
    queryKey: CLIENT_KEYS.list(params),
    queryFn:  () => clientsService.list(params),
    staleTime: 2 * 60 * 1000,
  })
}

export const useClientDetail = (id: string) => {
  return useQuery({
    queryKey: CLIENT_KEYS.detail(id),
    queryFn:  () => clientsService.getById(id),
    enabled:  !!id,
    staleTime: 2 * 60 * 1000,
  })
}
