export const ROUTES = {
  LOGIN:               '/login',
  DASHBOARD:           '/dashboard',
  CLIENT_DETAIL:       '/dashboard/clientes/:id',
  INTERACTION_DETAIL:  '/dashboard/clientes/:clientId/interacciones/:interactionId',
} as const

export const buildRoute = {
  clientDetail:      (id: string) => `/dashboard/clientes/${id}`,
  interactionDetail: (clientId: string, interactionId: string) =>
    `/dashboard/clientes/${clientId}/interacciones/${interactionId}`,
}
