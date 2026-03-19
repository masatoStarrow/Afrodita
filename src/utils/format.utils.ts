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

export const formatRelativeDate = (date: string | Date): string => {
  const now = new Date()
  const d = new Date(date)
  const diffMs = now.getTime() - d.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'hoy'
  if (diffDays === 1) return 'hace 1 día'
  if (diffDays < 30) return `hace ${diffDays} días`
  if (diffDays < 60) return 'hace 1 mes'
  const months = Math.floor(diffDays / 30)
  if (months < 12) return `hace ${months} meses`
  return `hace más de 1 año`
}

export const formatTime = (date: string | Date): string =>
  new Intl.DateTimeFormat('es-ES', {
    hour: '2-digit', minute: '2-digit', hour12: false,
  }).format(new Date(date))

export const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}min` : `${h}h`
}
