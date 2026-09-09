import { UnixTime } from '@l2beat/shared-pure'
import { type ChartRange, optionToDays } from '~/utils/range/range'
import { rangeToDays } from '~/utils/range/rangeToDays'

export type ChartRangeOptionValue =
  | '1d'
  | '7d'
  | '30d'
  | '90d'
  | '180d'
  | '1y'
  | 'max'

/**
 * Detects whether a resolved chart range matches one of the predefined
 * options. Shared with URL serializers so a serialized range always agrees
 * with the highlighted control. Lives outside `ChartRangeControls.tsx` so
 * server-side code can use it without pulling a component into the server
 * bundle.
 */
export function rangeToOption<T extends ChartRangeOptionValue>(
  [from, to]: ChartRange,
  values: readonly T[],
): T | 'max' | 'custom' {
  if (
    UnixTime.toStartOf(to, 'day') !== UnixTime.toStartOf(UnixTime.now(), 'day')
  ) {
    return 'custom'
  }
  if (from === null) return 'max'
  const days = rangeToDays([from, to])
  return values.find((value) => optionToDays(value) === days) ?? 'custom'
}
