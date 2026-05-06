const locale = 'en-US'

export function formatDate(dateString: string, loc = locale): string {
  const date = new Date(dateString)
  return date.toLocaleDateString(loc, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatDateShort(dateString: string, loc = locale): string {
  const date = new Date(dateString)
  return date.toLocaleDateString(loc, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}