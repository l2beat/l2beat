import { featureFlags } from '~/consts/featureFlags'
import type { ActivityMetric } from '~/pages/scaling/activity/components/ActivityMetricContext'
import type { ScalingActivityEntry } from '../getScalingActivityEntries'

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
    (b.data?.[metric].pastDayCount ?? -1) -
    (a.data?.[metric].pastDayCount ?? -1)
  if (diff !== 0) {
    return diff
  }
  return a.name.localeCompare(b.name)
}
