import {
  type CompareChartState,
  DEFAULT_COMPARE_METRIC,
  DEFAULT_COMPARE_RANGE,
  DEFAULT_COMPARE_SCALE,
} from './compareChartState'

/**
 * Serializes compare page state into a URL, omitting defaults so clean
 * links stay short. The inverse of `parseCompareStateFromSearchParams`.
 */
export function buildCompareUrl(
  path: string,
  state: CompareChartState,
): string {
  const params = new URLSearchParams()
  if (state.metric !== DEFAULT_COMPARE_METRIC) {
    params.set('metric', state.metric)
  }
  if (state.projects.length > 0) {
    params.set('projects', state.projects.join(','))
  }
  if (typeof state.range !== 'string') {
    params.set('range', `${state.range.from}-${state.range.to}`)
  } else if (state.range !== DEFAULT_COMPARE_RANGE) {
    params.set('range', state.range)
  }
  if (state.scale !== DEFAULT_COMPARE_SCALE) {
    params.set('scale', 'log')
  }
  // Keep commas literal so shared links stay readable.
  const query = params.toString().replaceAll('%2C', ',')
  return query ? `${path}?${query}` : path
}
