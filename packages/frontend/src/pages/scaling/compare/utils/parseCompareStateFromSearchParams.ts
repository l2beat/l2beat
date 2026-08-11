import {
  COMPARE_ACTIVITY_UNITS,
  COMPARE_COSTS_UNITS,
  COMPARE_METRIC_IDS,
  COMPARE_RANGE_OPTIONS,
  COMPARE_TVS_FILTERS,
  COMPARE_TVS_UNITS,
  type CompareChartState,
  type CompareRange,
  type CompareRangeOption,
  DEFAULT_COMPARE_ACTIVITY_UNIT,
  DEFAULT_COMPARE_COSTS_UNIT,
  DEFAULT_COMPARE_EXCLUDE_ASSOCIATED_TOKENS,
  DEFAULT_COMPARE_EXCLUDE_RWA_RESTRICTED_TOKENS,
  DEFAULT_COMPARE_METRIC,
  DEFAULT_COMPARE_RANGE,
  DEFAULT_COMPARE_SCALE,
  DEFAULT_COMPARE_TVS_FILTER,
  DEFAULT_COMPARE_TVS_UNIT,
  DEFAULT_COMPARE_VIEW_MODE,
  MAX_COMPARE_PROJECTS,
} from './compareChartState'

/**
 * Parses compare page state from URL search params. Tolerates garbage:
 * unknown slugs, invalid metrics, ranges and scales fall back to defaults.
 */
export function parseCompareStateFromSearchParams({
  searchParams,
  validSlugs,
}: {
  searchParams: URLSearchParams
  validSlugs: string[]
}): CompareChartState {
  const metric = parseOneOf(
    searchParams.get('metric'),
    COMPARE_METRIC_IDS,
    DEFAULT_COMPARE_METRIC,
  )
  const unit = searchParams.get('unit')
  return {
    metric,
    projects: parseProjects(searchParams.get('projects'), validSlugs),
    range: parseRange(searchParams.get('range')),
    scale:
      searchParams.get('scale') === 'log' ? 'symlog' : DEFAULT_COMPARE_SCALE,
    mode:
      searchParams.get('mode') === 'indexed'
        ? 'indexed'
        : DEFAULT_COMPARE_VIEW_MODE,
    // The `unit` param is shared between metrics and only encoded for the
    // active one, so it is only applied to the active metric here - the
    // value sets overlap (usd/eth), and without the gate a costs URL would
    // leak its unit into the TVS control.
    activityUnit:
      metric === 'activity'
        ? parseOneOf(
            unit,
            COMPARE_ACTIVITY_UNITS,
            DEFAULT_COMPARE_ACTIVITY_UNIT,
          )
        : DEFAULT_COMPARE_ACTIVITY_UNIT,
    tvsUnit:
      metric === 'tvs'
        ? parseOneOf(unit, COMPARE_TVS_UNITS, DEFAULT_COMPARE_TVS_UNIT)
        : DEFAULT_COMPARE_TVS_UNIT,
    tvsFilter:
      metric === 'tvs'
        ? parseOneOf(
            searchParams.get('filter'),
            COMPARE_TVS_FILTERS,
            DEFAULT_COMPARE_TVS_FILTER,
          )
        : DEFAULT_COMPARE_TVS_FILTER,
    costsUnit:
      metric === 'costs'
        ? parseOneOf(unit, COMPARE_COSTS_UNITS, DEFAULT_COMPARE_COSTS_UNIT)
        : DEFAULT_COMPARE_COSTS_UNIT,
    excludeAssociatedTokens: parseBoolean(
      searchParams.get('excludeAssociated'),
      DEFAULT_COMPARE_EXCLUDE_ASSOCIATED_TOKENS,
    ),
    excludeRwaRestrictedTokens: parseBoolean(
      searchParams.get('excludeRwa'),
      DEFAULT_COMPARE_EXCLUDE_RWA_RESTRICTED_TOKENS,
    ),
  }
}

function parseOneOf<T extends string>(
  value: string | null,
  options: readonly T[],
  fallback: T,
): T {
  return options.find((option) => option === value) ?? fallback
}

function parseBoolean(value: string | null, defaultValue: boolean): boolean {
  if (value === 'true') return true
  if (value === 'false') return false
  return defaultValue
}

function parseProjects(value: string | null, validSlugs: string[]): string[] {
  if (!value) return []
  const slugSet = new Set(validSlugs)
  const unique = [...new Set(value.split(','))]
  return unique
    .filter((slug) => slugSet.has(slug))
    .slice(0, MAX_COMPARE_PROJECTS)
}

function parseRange(value: string | null): CompareRange {
  if (!value) return DEFAULT_COMPARE_RANGE
  const option = COMPARE_RANGE_OPTIONS.find(
    (option): option is CompareRangeOption => option === value,
  )
  if (option) return option
  const match = /^(\d+)-(\d+)$/.exec(value)
  if (match) {
    const from = Number(match[1])
    const to = Number(match[2])
    if (from < to) return { from, to }
  }
  return DEFAULT_COMPARE_RANGE
}
