import { rangeToDays } from '~/utils/range/rangeToDays'

export function rangeToLabel(
  range:
    | { from: number | null; to: number }
    | '1d'
    | '7d'
    | '30d'
    | '90d'
    | '180d'
    | '1y'
    | 'max',
): string {
  // Handle old string format for backwards compatibility
  if (typeof range === 'string') {
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
    }
  }

  // Handle new object format
  if (range.from === null) {
    return 'All time'
  }

  const days = rangeToDays(range)
  if (days === null) {
    return 'All time'
  }

  if (days === 1) return 'Past day'
  if (days === 7) return '7 days'
  if (days === 30) return '30 days'
  if (days === 90) return '90 days'
  if (days === 180) return '180 days'
  if (days === 365) return '1 year'
  if (days < 7) return '7 days'
  if (days < 30) return '30 days'
  if (days < 90) return '90 days'
  if (days < 180) return '180 days'
  if (days < 365) return '1 year'
  return 'All time'
}
