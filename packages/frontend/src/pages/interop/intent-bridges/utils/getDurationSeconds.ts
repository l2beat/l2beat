import type { AverageDuration } from '~/server/features/scaling/interop/types'

export function getDurationSeconds(
  averageDuration: AverageDuration | null | undefined,
): number | null {
  if (!averageDuration || averageDuration.type === 'unknown') {
    return null
  }
  if (averageDuration.type === 'single') {
    return averageDuration.duration
  }
  const durations = averageDuration.splits
    .map((split) => split.duration)
    .filter((duration) => duration !== null)
  return durations.length > 0 ? Math.min(...durations) : null
}
