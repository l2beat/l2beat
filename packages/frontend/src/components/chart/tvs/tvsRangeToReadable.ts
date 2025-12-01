import { pluralize } from '@l2beat/shared-pure'
import type { ChartRange } from '~/utils/range/range'
import { rangeToDays } from '~/utils/range/rangeToDays'

export function tvsRangeToReadable(range: ChartRange) {
  if (range[0] === null) {
    return 'All time'
  }
  const days = rangeToDays(range)
  if (days === null) {
    return 'All time'
  }
  if (days < 365 || days % 365 !== 0) {
    return `${days} ${pluralize(days, 'day')}`
  }
  const years = days / 365
  return `${years} ${pluralize(years, 'year')}`
}
