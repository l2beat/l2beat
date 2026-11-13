import { formatCurrency } from '@l2beat/shared-pure'
import type { OssificationStats } from '~/server/features/projects/ossification/getOssificationStats'
import { OSSIFICATION_VALUE_LABELS } from './ossificationValueLabels'

/** The current and peak value over the timeline window, as one sentence. */
export function formatValueLine({
  timeline,
  valueSource,
}: Pick<OssificationStats, 'timeline' | 'valueSource'>): string {
  const current = timeline.values?.findLast((value) => value !== null) ?? null
  return current !== null && timeline.peak !== null && valueSource
    ? `${OSSIFICATION_VALUE_LABELS[valueSource].long} now ${formatCurrency(current, 'usd')}, peaking at ${formatCurrency(timeline.peak, 'usd')} over the past year.`
    : 'No value data.'
}
