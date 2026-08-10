import {
  COMPARE_ACTIVITY_UNITS,
  COMPARE_METRIC_IDS,
  COMPARE_RANGE_OPTIONS,
  COMPARE_TVS_UNITS,
  type CompareActivityUnit,
  type CompareChartState,
  type CompareMetricId,
  type CompareRange,
  type CompareRangeOption,
  type CompareTvsUnit,
  DEFAULT_COMPARE_ACTIVITY_UNIT,
  DEFAULT_COMPARE_EXCLUDE_ASSOCIATED_TOKENS,
  DEFAULT_COMPARE_EXCLUDE_RWA_RESTRICTED_TOKENS,
  DEFAULT_COMPARE_METRIC,
  DEFAULT_COMPARE_RANGE,
  DEFAULT_COMPARE_SCALE,
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
  return {
    metric: parseMetric(searchParams.get('metric')),
    projects: parseProjects(searchParams.get('projects'), validSlugs),
    range: parseRange(searchParams.get('range')),
    scale:
      searchParams.get('scale') === 'log' ? 'symlog' : DEFAULT_COMPARE_SCALE,
    mode:
      searchParams.get('mode') === 'indexed'
        ? 'indexed'
        : DEFAULT_COMPARE_VIEW_MODE,
    // The `unit` param is shared between metrics; the value sets are
    // disjoint, so each metric picks up only its own units.
    activityUnit: parseActivityUnit(searchParams.get('unit')),
    tvsUnit: parseTvsUnit(searchParams.get('unit')),
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

function parseMetric(value: string | null): CompareMetricId {
  const metric = COMPARE_METRIC_IDS.find((id) => id === value)
  return metric ?? DEFAULT_COMPARE_METRIC
}

function parseActivityUnit(value: string | null): CompareActivityUnit {
  const unit = COMPARE_ACTIVITY_UNITS.find((unit) => unit === value)
  return unit ?? DEFAULT_COMPARE_ACTIVITY_UNIT
}

function parseTvsUnit(value: string | null): CompareTvsUnit {
  const unit = COMPARE_TVS_UNITS.find((unit) => unit === value)
  return unit ?? DEFAULT_COMPARE_TVS_UNIT
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
