export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp * 1000).toISOString().slice(0, 19).replace('T', ' ')
}

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

export function statusRank(status: 'missing' | 'stale' | 'fresh') {
  switch (status) {
    case 'missing':
      return 0
    case 'stale':
      return 1
    case 'fresh':
      return 2
  }
}
