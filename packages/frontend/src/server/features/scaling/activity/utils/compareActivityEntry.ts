import type { ActivityMetric } from '~/pages/scaling/activity/components/ActivityMetricContext'
import type { ScalingActivityEntry } from '../getScalingActivityEntries'

export function compareActivityEntry(
  a: ScalingActivityEntry,
  b: ScalingActivityEntry,
  opts?: {
    metric?: ActivityMetric
  },
) {
  const metric = opts?.metric ?? 'uops'
  const diff =
    (b.data?.[metric].pastDayCount.value ?? -1) -
    (a.data?.[metric].pastDayCount.value ?? -1)
  if (diff !== 0) {
    return diff
  }
  return a.name.localeCompare(b.name)
}
