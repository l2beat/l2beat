import {
  type CompareChartConfig,
  type CompareChartState,
  DEFAULT_COMPARE_ACTIVITY_UNIT,
  DEFAULT_COMPARE_COSTS_UNIT,
  DEFAULT_COMPARE_EXCLUDE_ASSOCIATED_TOKENS,
  DEFAULT_COMPARE_EXCLUDE_RWA_RESTRICTED_TOKENS,
  DEFAULT_COMPARE_METRIC,
  DEFAULT_COMPARE_RANGE,
  DEFAULT_COMPARE_TVS_FILTER,
  DEFAULT_COMPARE_TVS_UNIT,
} from './compareChartState'

/**
 * Serializes compare page state into a URL, omitting defaults so clean
 * links stay short. The inverse of `parseCompareStateFromSearchParams`.
 *
 * Chart cards are packed into a single `charts` param: chart tokens joined
 * by `,`, each token a metric id followed by `:`-separated `key=value`
 * fields for its non-default controls, e.g.
 * `charts=tvs:unit=eth:filter=stablecoin,activity:unit=tps`.
 */
export function buildCompareUrl(
  path: string,
  state: CompareChartState,
): string {
  const params = new URLSearchParams()
  if (state.projects.length > 0) {
    params.set('projects', state.projects.join(','))
  }
  if (typeof state.range !== 'string') {
    params.set('range', `${state.range.from}-${state.range.to}`)
  } else if (state.range !== DEFAULT_COMPARE_RANGE) {
    params.set('range', state.range)
  }
  const chartTokens = state.charts.map(buildChartToken)
  const isDefaultCharts =
    chartTokens.length === 1 && chartTokens[0] === DEFAULT_COMPARE_METRIC
  if (chartTokens.length > 0 && !isDefaultCharts) {
    params.set('charts', chartTokens.join(','))
  }
  // Keep the separators literal so shared links stay readable. All three are
  // legal unencoded in a query string and never appear in slugs or values.
  const query = params
    .toString()
    .replaceAll('%2C', ',')
    .replaceAll('%3A', ':')
    .replaceAll('%3D', '=')
  return query ? `${path}?${query}` : path
}

function buildChartToken(config: CompareChartConfig): string {
  const fields: string[] = [config.metric]
  // Per-metric controls are only encoded for the metric they belong to.
  if (
    config.metric === 'activity' &&
    config.activityUnit !== DEFAULT_COMPARE_ACTIVITY_UNIT
  ) {
    fields.push(`unit=${config.activityUnit}`)
  }
  if (
    config.metric === 'costs' &&
    config.costsUnit !== DEFAULT_COMPARE_COSTS_UNIT
  ) {
    fields.push(`unit=${config.costsUnit}`)
  }
  if (config.metric === 'tvs') {
    if (config.tvsUnit !== DEFAULT_COMPARE_TVS_UNIT) {
      fields.push(`unit=${config.tvsUnit}`)
    }
    if (config.tvsFilter !== DEFAULT_COMPARE_TVS_FILTER) {
      fields.push(`filter=${config.tvsFilter}`)
    }
    if (
      config.excludeAssociatedTokens !==
      DEFAULT_COMPARE_EXCLUDE_ASSOCIATED_TOKENS
    ) {
      fields.push(`excludeAssociated=${config.excludeAssociatedTokens}`)
    }
    // The exclude-restricted-RWA toggle is disabled and overridden while
    // the Restricted RWAs filter is active, so its value is not encoded.
    if (
      config.tvsFilter !== 'rwaRestricted' &&
      config.excludeRwaRestrictedTokens !==
        DEFAULT_COMPARE_EXCLUDE_RWA_RESTRICTED_TOKENS
    ) {
      fields.push(`excludeRwa=${config.excludeRwaRestrictedTokens}`)
    }
  }
  return fields.join(':')
}
