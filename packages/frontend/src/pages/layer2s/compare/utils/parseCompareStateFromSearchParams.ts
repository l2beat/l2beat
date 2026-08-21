import { COMPARE_METRIC_DEFS } from '../metrics/compareMetricDefs'
import type { CompareUrlFields } from '../metrics/types'
import {
  COMPARE_METRIC_IDS,
  COMPARE_RANGE_OPTIONS,
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

/**
 * A chart token is the metric id followed by `:`-separated `key=value`
 * fields, decoded by the metric's own `urlControls` codec.
 */
function parseChartToken(token: string): CompareChartConfig | undefined {
  const [metricField, ...fieldTokens] = token.split(':')
  const metric = COMPARE_METRIC_IDS.find((id) => id === metricField)
  if (!metric) return undefined
  const fields: CompareUrlFields = Object.fromEntries(
    fieldTokens.map((fieldToken) => {
      const [key, value = ''] = fieldToken.split('=')
      return [key, value]
    }),
  )
  return {
    ...createDefaultChartConfig(metric),
    ...COMPARE_METRIC_DEFS[metric].urlControls?.parse(fields),
  }
}

function parseProjects(
  value: string | null,
  validSlugs: string[],
): string[] | undefined {
  // An absent param means the default selection; a present-but-empty one is
  // a deliberately emptied selection and must not fall back to the defaults.
  if (value === null) return undefined
  if (value === '') return []
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
