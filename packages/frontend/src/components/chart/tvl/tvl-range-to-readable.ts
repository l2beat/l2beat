import { pluralize } from '@l2beat/shared-pure'
import { type TvlChartRange } from '~/server/features/scaling/tvl/utils/range'

export function tvlRangeToReadable(range: TvlChartRange) {
  if (range === 'max') {
    return 'All time'
  }
  const number = Number(range.slice(0, -1))
  if (range.endsWith('d')) {
    return `${number} ${pluralize(number, 'day')}`
  }
  if (range.endsWith('y')) {
    return `${number} ${pluralize(number, 'year')}`
  }
  throw new Error('Invalid range')
}
