import { type TvlChartRange } from '~/server/features/scaling/tvl/utils/range'

export function tvlRangeToReadable(range: TvlChartRange) {
  if (range === 'max') {
    return 'All time'
  }
  const number = range.slice(0, -1)
  const plural = number !== '1'
  if (range.endsWith('d')) {
    return `${number} ${plural ? 'days' : 'day'}`
  }
  if (range.endsWith('y')) {
    return `${number} ${plural ? 'years' : 'year'}`
  }
  throw new Error('Invalid range')
}
