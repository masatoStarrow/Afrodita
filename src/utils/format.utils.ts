export const formatFullName = (name: string): string =>
  name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')

export const formatDate = (date: string | Date): string =>
  new Intl.DateTimeFormat('es-ES', {
    year: 'numeric', month: 'long', day: 'numeric',
  }).format(new Date(date))

export const formatInitials = (name: string): string =>
  name
    .split(' ')
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('')
