import type { ActivityMetric } from '~/pages/layer2s/activity/components/ActivityMetricContext'
import type { Layer2sActivityEntry } from '../getLayer2sActivityEntries'

export function compareActivityEntry(
  a: Layer2sActivityEntry,
  b: Layer2sActivityEntry,
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
