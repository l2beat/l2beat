import type { ActivityMetric } from '~/app/(side-nav)/scaling/activity/_components/activity-metric-context'
import { featureFlags } from '~/consts/feature-flags'
import type { ScalingActivityEntry } from '../get-scaling-activity-entries'

export function compareActivityEntry(
  a: ScalingActivityEntry,
  b: ScalingActivityEntry,
  opts?: {
    metric?: ActivityMetric
  },
) {
  if (featureFlags.stageSorting) {
    const stageDiff = b.stageOrder - a.stageOrder
    if (stageDiff !== 0) {
      return stageDiff
    }
  }

  if (a.slug === 'ethereum') {
    return -1
  }
  if (b.slug === 'ethereum') {
    return 1
  }

  const metric = opts?.metric ?? 'uops'
  const diff =
    (b.data?.[metric].pastDayCount ?? 0) - (a.data?.[metric].pastDayCount ?? 0)
  if (diff !== 0) {
    return diff
  }
  return a.name.localeCompare(b.name)
}
