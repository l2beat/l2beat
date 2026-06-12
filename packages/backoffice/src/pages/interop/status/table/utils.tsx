export function formatDistanceFromNow(timestamp: number): string {
  const nowMs = Date.now()
  const diffMs = Math.max(0, nowMs - timestamp * 1000)
  if (diffMs < 60_000) {
    return '<1m'
  }

  const totalMinutes = Math.ceil(diffMs / 60_000)
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

export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp * 1000).toISOString().slice(0, 19).replace('T', ' ')
}

export function compareOptionalBigIntStrings(
  left: string | undefined,
  right: string | undefined,
) {
  if (left === undefined && right === undefined) {
    return 0
  }
  if (left === undefined) {
    return 1
  }
  if (right === undefined) {
    return -1
  }

  const leftValue = BigInt(left)
  const rightValue = BigInt(right)

  if (leftValue < rightValue) {
    return -1
  }
  if (leftValue > rightValue) {
    return 1
  }
  return 0
}
