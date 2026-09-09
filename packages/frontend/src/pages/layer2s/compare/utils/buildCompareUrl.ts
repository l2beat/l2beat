import { COMPARE_METRIC_DEFS } from '../metrics/compareMetricDefs'
import {
  type CompareChartConfig,
  type CompareChartState,
  DEFAULT_COMPARE_METRIC,
  DEFAULT_COMPARE_RANGE,
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
  // An empty array still emits `projects=`: it is an explicitly emptied
  // selection, distinct from the absent param that shows the defaults.
  if (state.projects !== undefined) {
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

/** The metric id plus the non-default controls of the metric's own codec. */
function buildChartToken(config: CompareChartConfig): string {
  const fields =
    COMPARE_METRIC_DEFS[config.metric].urlControls?.serialize(config) ?? {}
  return [
    config.metric,
    ...Object.entries(fields).map(([key, value]) => `${key}=${value}`),
  ].join(':')
}
