import { assertUnreachable } from '@l2beat/shared-pure'

export function rangeToLabel(
  range: '1d' | '7d' | '30d' | '90d' | '180d' | '1y' | 'max',
) {
  switch (range) {
    case '1d':
      return 'Past day'
    case '7d':
      return '7 days'
    case '30d':
      return '30 days'
    case '90d':
      return '90 days'
    case '180d':
      return '180 days'
    case '1y':
      return '1 year'
    case 'max':
      return 'All time'
    default:
      assertUnreachable(range)
  }
}
