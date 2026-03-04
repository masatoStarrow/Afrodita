export const ROLES = {
  ADMIN:     'admin',
  SOPORTE:   'soporte',
  COMERCIAL: 'comercial',
} as const

export type Role = typeof ROLES[keyof typeof ROLES]

export const ROLE_LABELS: Record<Role, string> = {
  admin:     'Administrador',
  soporte:   'Soporte',
  comercial: 'Account Manager',
}
