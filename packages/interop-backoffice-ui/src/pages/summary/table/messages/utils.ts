import { formatSeconds } from '@l2beat/shared-pure'

export function formatDuration(seconds: number | undefined) {
  if (!seconds || Number.isNaN(seconds)) {
    return '-'
  }

  return formatSeconds(seconds)
}

export function getKnownAppsRatio(knownAppCount: number, count: number) {
  if (count <= 0) {
    return 0
  }

  return (knownAppCount / count) * 100
}

export function formatKnownAppsRatio(knownAppCount: number, count: number) {
  return `${getKnownAppsRatio(knownAppCount, count).toFixed(1)}%`
}
