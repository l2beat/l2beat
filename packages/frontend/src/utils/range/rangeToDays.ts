import { type StringWithAutocomplete, UnixTime } from '@l2beat/shared-pure'
import type { TimeRange } from './range'

export function rangeToDays(
  range:
    | { type: StringWithAutocomplete<TimeRange> }
    | { type: 'custom'; from: number; to: number },
) {
  if (range.type === 'custom') {
    const { from, to } = range as { from: number; to: number }
    const days = to - from
    return UnixTime.toDays(days)
  }

  if (range.type === 'max') return null
  const count = parseInt(range.type.substring(0, range.type.length - 1))
  const unit = range.type.substring(range.type.length - 1)

  if (unit === 'd') {
    return count
  }

  if (unit === 'y') {
    return count * 365
  }

  throw new Error('Invalid range')
}
