import type { CompiledReview } from '../../../types'

/**
 * Returns the ISO timestamp of the most recent event in `review.activity`,
 * or `null` when the review has no activity events.
 */
export function getLatestActivityTimestamp(
  review: Pick<CompiledReview, 'activity'>,
): string | null {
  const events = review.activity
  if (!events || events.length === 0) return null
  let newest = events[0]!.timestamp
  for (let i = 1; i < events.length; i++) {
    const t = events[i]!.timestamp
    if (t.localeCompare(newest) > 0) newest = t
  }
  return newest
}
