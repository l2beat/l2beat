import {
  COMPARE_METRIC_IDS,
  COMPARE_RANGE_OPTIONS,
  type CompareChartState,
  type CompareMetricId,
  type CompareRange,
  type CompareRangeOption,
  DEFAULT_COMPARE_METRIC,
  DEFAULT_COMPARE_RANGE,
  DEFAULT_COMPARE_SCALE,
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
  return {
    metric: parseMetric(searchParams.get('metric')),
    projects: parseProjects(searchParams.get('projects'), validSlugs),
    range: parseRange(searchParams.get('range')),
    scale:
      searchParams.get('scale') === 'log' ? 'symlog' : DEFAULT_COMPARE_SCALE,
  }
}

function parseMetric(value: string | null): CompareMetricId {
  const metric = COMPARE_METRIC_IDS.find((id) => id === value)
  return metric ?? DEFAULT_COMPARE_METRIC
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
