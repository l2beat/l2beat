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

export function formatProcessorTimestamp(timestamp: number) {
  return new Date(timestamp * 1000).toUTCString()
}

export function toIsoTimestamp(timestamp: number) {
  return new Date(timestamp * 1000).toISOString()
}
