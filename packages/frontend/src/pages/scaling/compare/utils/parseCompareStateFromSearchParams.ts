import {
  COMPARE_ACTIVITY_UNITS,
  COMPARE_COSTS_UNITS,
  COMPARE_METRIC_IDS,
  COMPARE_RANGE_OPTIONS,
  COMPARE_TVS_FILTERS,
  COMPARE_TVS_UNITS,
  type CompareChartConfig,
  type CompareChartState,
  type CompareRange,
  type CompareRangeOption,
  createDefaultChartConfig,
  DEFAULT_COMPARE_RANGE,
  MAX_COMPARE_CHARTS,
} from './compareChartState'

/**
 * Parses compare page state from URL search params. Tolerates garbage:
 * unknown slugs, invalid metrics, chart fields and ranges fall back to
 * defaults; chart tokens with an unknown metric are dropped entirely.
 */
export function parseCompareStateFromSearchParams({
  searchParams,
  validSlugs,
}: {
  searchParams: URLSearchParams
  validSlugs: string[]
}): CompareChartState {
  return {
    projects: parseProjects(searchParams.get('projects'), validSlugs),
    range: parseRange(searchParams.get('range')),
    charts: parseCharts(searchParams.get('charts')),
  }
}

function parseCharts(value: string | null): CompareChartConfig[] {
  if (!value) return [createDefaultChartConfig()]
  const charts = value
    .split(',')
    .flatMap((token) => parseChartToken(token) ?? [])
    .slice(0, MAX_COMPARE_CHARTS)
  return charts.length > 0 ? charts : [createDefaultChartConfig()]
}

function parseChartToken(token: string): CompareChartConfig | undefined {
  const [metricField, ...fields] = token.split(':')
  const metric = COMPARE_METRIC_IDS.find((id) => id === metricField)
  if (!metric) return undefined
  const config = createDefaultChartConfig(metric)
  for (const field of fields) {
    const [key, value = null] = field.split('=')
    switch (key) {
      // The `unit` key is shared between metrics, so it is only applied to
      // the token's own metric - the value sets overlap (usd/eth), and
      // without the gate a costs unit would leak into the TVS control.
      case 'unit':
        if (metric === 'activity') {
          config.activityUnit = parseOneOf(
            value,
            COMPARE_ACTIVITY_UNITS,
            config.activityUnit,
          )
        } else if (metric === 'tvs') {
          config.tvsUnit = parseOneOf(value, COMPARE_TVS_UNITS, config.tvsUnit)
        } else if (metric === 'costs') {
          config.costsUnit = parseOneOf(
            value,
            COMPARE_COSTS_UNITS,
            config.costsUnit,
          )
        }
        break
      case 'filter':
        config.tvsFilter = parseOneOf(
          value,
          COMPARE_TVS_FILTERS,
          config.tvsFilter,
        )
        break
      case 'excludeAssociated':
        config.excludeAssociatedTokens = parseBoolean(
          value,
          config.excludeAssociatedTokens,
        )
        break
      case 'excludeRwa':
        config.excludeRwaRestrictedTokens = parseBoolean(
          value,
          config.excludeRwaRestrictedTokens,
        )
        break
    }
  }
  return config
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
  return unique.filter((slug) => slugSet.has(slug))
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
