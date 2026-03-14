export function formatDistanceFromNow(timestamp: number): string {
  const nowMs = Date.now()
  const timestampMs = timestamp * 1000
  const diffMs = Math.max(0, nowMs - timestampMs)
  if (diffMs < 60_000) {
    return '<1m'
  }

  const totalMinutes = Math.ceil(diffMs / 60_000)
  const days = Math.floor(totalMinutes / 1440)
  const hours = Math.floor((totalMinutes % 1440) / 60)
  const minutes = totalMinutes % 60
  const parts: string[] = []

  if (days) {
    parts.push(`${days}d`)
  }
  if (hours) {
    parts.push(`${hours}h`)
  }
  if (minutes || parts.length === 0) {
    parts.push(`${minutes}m`)
  }

  return parts.join(' ')
}

export function getDistanceFromNow(timestamp?: number) {
  if (timestamp === undefined) {
    return 'n/a'
  }

  return formatDistanceFromNow(timestamp)
}

export function getResyncFrom(timestamp?: number) {
  if (timestamp === undefined) {
    return ''
  }

  return formatDistanceFromNow(timestamp)
}

export function getSyncModeBadgeVariant(syncMode?: string) {
  if (!syncMode) {
    return 'outline' as const
  }

  const normalized = syncMode.toLowerCase()
  if (normalized.includes('error')) {
    return 'destructive' as const
  }
  if (normalized.includes('synced')) {
    return 'default' as const
  }
  return 'secondary' as const
}
