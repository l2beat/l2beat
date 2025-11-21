import { pluralize } from '@l2beat/shared-pure'
import type { TvsChartRange } from '~/server/features/scaling/tvs/utils/range'
import { rangeToDays } from '~/utils/range/rangeToDays'

export function tvsRangeToReadable(range: TvsChartRange) {
  if (range[0] === null) {
    return 'All time'
  }
  const days = rangeToDays(range)
  if (days === null) {
    return 'All time'
  }
  if (days < 365) {
    return `${days} ${pluralize(days, 'day')}`
  }
  const years = Math.round(days / 365)
  return `${years} ${pluralize(years, 'year')}`
}
