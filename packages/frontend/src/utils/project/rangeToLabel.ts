import { rangeToDays } from '~/utils/range/rangeToDays'
import type { ChartRange } from '../range/range'

export function rangeToLabel(
  range: ChartRange | '1d' | '7d' | '30d' | '90d' | '180d' | '1y' | 'max',
): string {
  // Handle old string format for backwards compatibility
  if (typeof range === 'string') {
    switch (range) {
      case '1d':
        return 'Past day'
      case '7d':
        return '7D'
      case '30d':
        return '30D'
      case '90d':
        return '90D'
      case '180d':
        return '180D'
      case '1y':
        return '1Y'
      case 'max':
        return 'All time'
    }
  }

  const days = rangeToDays(range)
  if (days === null) {
    return 'All time'
  }

  if (days === 1) return 'Past day'

  if (days < 365) {
    return `${days}D`
  }

  const years = Math.round(days / 365)
  return `${years}Y`
}
