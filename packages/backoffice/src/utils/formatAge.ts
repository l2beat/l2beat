export function formatAge(seconds: number | undefined): string {
  if (seconds === undefined) {
    return 'n/a'
  }
  if (seconds < 60) {
    return '<1m'
  }

  const totalMinutes = Math.ceil(seconds / 60)
  const days = Math.floor(totalMinutes / 1_440)
  const hours = Math.floor((totalMinutes % 1_440) / 60)
  const minutes = totalMinutes % 60
  const parts: string[] = []

  if (days > 0) {
    parts.push(`${days}d`)
  }
  if (hours > 0) {
    parts.push(`${hours}h`)
  }
  if (minutes > 0 || parts.length === 0) {
    parts.push(`${minutes}m`)
  }

  return parts.join(' ')
}
