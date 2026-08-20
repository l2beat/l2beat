import type { ActivityMetric } from '~/pages/layer2s/activity/components/ActivityMetricContext'
import type { L2ActivityEntry } from '../getL2ActivityEntries'

export function compareActivityEntry(
  a: L2ActivityEntry,
  b: L2ActivityEntry,
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
