import { assertUnreachable, UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { rangeToDays } from './rangeToDays'

export type ChartRange = v.infer<typeof ChartRange>
export const ChartRange = v.tuple([v.union([v.number(), v.null()]), v.number()])

export type ChartRangePredefinedOption =
  | '1d'
  | '7d'
  | '30d'
  | '90d'
  | '180d'
  | '1y'
  | 'max'

export function optionToRange(
  option: ChartRangePredefinedOption,
  opts?: { offset?: UnixTime },
): ChartRange {
  // Default offset is 75 minutes, cuz this is more or less how much time we need to wait for the data to be fully synced.
  const offset = opts?.offset ?? -1 * (UnixTime.HOUR + 15 * UnixTime.MINUTE)
  const days = optionToDays(option)

  return [
    days === null
      ? null
      : UnixTime.toStartOf(UnixTime.now(), 'day') -
        days * UnixTime.DAY +
        offset,
    UnixTime.toStartOf(UnixTime.now(), 'hour') + offset,
  ]
}

export function rangeToOption(
  [from, to]: ChartRange,
  options: { value: ChartRangePredefinedOption }[],
  offset: UnixTime,
): ChartRangePredefinedOption | 'custom' {
  if (
    UnixTime.toStartOf(to, 'day') !==
    UnixTime.toStartOf(UnixTime.now() + offset, 'day')
  ) {
    return 'custom'
  }
  if (from === null) return 'max'
  const days = rangeToDays([from, to])
  const option = options.find((option) => optionToDays(option.value) === days)
  if (option) return option.value

  return 'custom'
}

function optionToDays(option: 'max'): null
function optionToDays(
  option: Exclude<ChartRangePredefinedOption, 'max'>,
): number
function optionToDays(option: ChartRangePredefinedOption): number | null
function optionToDays(option: ChartRangePredefinedOption): number | null {
  switch (option) {
    case '1d':
      return 1
    case '7d':
      return 7
    case '30d':
      return 30
    case '90d':
      return 90
    case '180d':
      return 180
    case '1y':
      return 365
    case 'max':
      return null
    default:
      return assertUnreachable(option)
  }
}
