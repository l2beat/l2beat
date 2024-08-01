import { TimeRange } from './range'

export function rangeToDays(range: TimeRange) {
  if (range === 'max') return Infinity
  const count = parseInt(range.substring(0, range.length - 1))
  const unit = range.substring(range.length - 1)

  if (unit === 'd') {
    return count
  }

  if (unit === 'y') {
    return count * 365
  }

  throw new Error('Invalid range')
}
