import type { StringWithAutocomplete } from '@l2beat/shared-pure'
import type { TimeRange } from './range'

export function rangeToDays(range: StringWithAutocomplete<TimeRange>) {
  if (range === 'max') return null
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
