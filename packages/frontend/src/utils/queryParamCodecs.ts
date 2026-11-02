import type { ColumnSort, SortingState } from '@tanstack/react-table'
import {
  type ChartRangeOptionValue,
  rangeToOption,
} from '~/components/core/chart/utils/rangeToOption'
import {
  type ChartRange,
  type ChartRangePredefinedOption,
  optionToRange,
} from './range/range'

/**
 * Turns a piece of view state into a URL search param and back. `parse`
 * returns `undefined` for anything it doesn't recognize, so a hand-edited or
 * outdated link falls back to the default instead of breaking the page.
 */
export interface QueryParamCodec<T> {
  /** A function, because a range default depends on the current time. */
  getDefault: () => T
  parse: (param: string) => T | undefined
  serialize: (value: T) => string
}

export function oneOfCodec<T extends string>(
  options: readonly T[],
  defaultValue: T,
): QueryParamCodec<T> {
  return {
    getDefault: () => defaultValue,
    parse: (param) => options.find((option) => option === param),
    serialize: (value) => value,
  }
}

const RANGE_OPTIONS: readonly ChartRangePredefinedOption[] = [
  '1d',
  '3d',
  '7d',
  '30d',
  '90d',
  '180d',
  '1y',
  'max',
]
const HIGHLIGHTABLE_RANGE_OPTIONS = RANGE_OPTIONS.filter(
  (option): option is ChartRangeOptionValue => option !== '3d',
)

/**
 * A predefined range is stored as its name (`30d`), so a shared link shows
 * the last 30 days whenever it's opened. A calendar range is stored as unix
 * seconds (`1704067200-1719705600`), the format the compare page uses.
 */
export function chartRangeCodec(
  defaultOption: ChartRangePredefinedOption,
): QueryParamCodec<ChartRange> {
  return {
    getDefault: () => optionToRange(defaultOption),
    parse: parseChartRange,
    serialize: serializeChartRange,
  }
}

function parseChartRange(param: string): ChartRange | undefined {
  const option = RANGE_OPTIONS.find((option) => option === param)
  if (option) return optionToRange(option)

  const match = /^(\d+)-(\d+)$/.exec(param)
  if (!match) return undefined
  const from = Number(match[1])
  const to = Number(match[2])
  return from < to ? [from, to] : undefined
}

function serializeChartRange(range: ChartRange): string {
  // Matched exactly first: for ~75 min after midnight UTC a fresh predefined
  // range ends yesterday, which `rangeToOption` reports as custom.
  const exact = RANGE_OPTIONS.find((option) =>
    isSameRange(optionToRange(option), range),
  )
  if (exact) return exact

  const option = rangeToOption(range, HIGHLIGHTABLE_RANGE_OPTIONS)
  if (option !== 'custom') return option

  const [from, to] = range
  return from === null ? 'max' : `${from}-${to}`
}

function isSameRange(a: ChartRange, b: ChartRange) {
  return a[0] === b[0] && a[1] === b[1]
}

/**
 * Stored as `column.desc`, comma-separated when sorted by several columns.
 * Column ids aren't checked here, since only the table knows its columns;
 * `useTable` drops unknown ones.
 */
export function sortingCodec(
  defaultSort: ColumnSort,
): QueryParamCodec<SortingState> {
  return {
    getDefault: () => [defaultSort],
    parse: parseSorting,
    serialize: (sorting) =>
      sorting.map(({ id, desc }) => `${id}.${desc ? 'desc' : 'asc'}`).join(','),
  }
}

function parseSorting(param: string): SortingState | undefined {
  const sorting: SortingState = []
  for (const part of param.split(',')) {
    const match = /^(.+)\.(asc|desc)$/.exec(part)
    if (!match?.[1]) return undefined
    sorting.push({ id: match[1], desc: match[2] === 'desc' })
  }
  return sorting
}
