import type { Range, Resolution } from './types'

export function rangeToResolution(range: Range): Resolution {
  const days = rangeToDays(range)
  if (days && days <= 7) return 'hour'
  if (days && days < 180) return 'six hours'
  return 'day'
}

export function rangeToDays(range: Range) {
  if (range === 'max') return null
  const count = Number.parseInt(range.substring(0, range.length - 1))
  const unit = range.substring(range.length - 1)

  if (unit === 'd') {
    return count
  }

  if (unit === 'y') {
    return count * 365
  }

  throw new Error('Invalid range')
}
