import { formatCurrency } from '@l2beat/shared-pure'
import type { OssificationStats } from '~/server/features/projects/ossification/getOssificationStats'
import { OSSIFICATION_VALUE_LABELS } from './ossificationValueLabels'

/** The current and peak value over the timeline window, as one sentence. */
export function formatValueLine({
  timeline,
  valueSource,
}: Pick<OssificationStats, 'timeline' | 'valueSource'>): string {
  const known = timeline.values?.filter((value) => value !== null) ?? []
  const current = known.at(-1)
  return current !== undefined && valueSource
    ? `${OSSIFICATION_VALUE_LABELS[valueSource].long} now ${formatCurrency(current, 'usd')}, peaking at ${formatCurrency(Math.max(...known), 'usd')} over the past year.`
    : 'No value data.'
}
