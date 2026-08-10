import {
  type CompareChartState,
  DEFAULT_COMPARE_ACTIVITY_UNIT,
  DEFAULT_COMPARE_EXCLUDE_ASSOCIATED_TOKENS,
  DEFAULT_COMPARE_EXCLUDE_RWA_RESTRICTED_TOKENS,
  DEFAULT_COMPARE_METRIC,
  DEFAULT_COMPARE_RANGE,
  DEFAULT_COMPARE_SCALE,
  DEFAULT_COMPARE_TVS_FILTER,
  DEFAULT_COMPARE_TVS_UNIT,
  DEFAULT_COMPARE_VIEW_MODE,
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
  if (state.mode !== DEFAULT_COMPARE_VIEW_MODE) {
    params.set('mode', state.mode)
  }
  // The scale toggle is hidden in indexed mode, so its value is not encoded.
  if (state.mode === 'absolute' && state.scale !== DEFAULT_COMPARE_SCALE) {
    params.set('scale', 'log')
  }
  // Per-metric controls are only encoded for the metric they belong to.
  if (
    state.metric === 'activity' &&
    state.activityUnit !== DEFAULT_COMPARE_ACTIVITY_UNIT
  ) {
    params.set('unit', state.activityUnit)
  }
  if (state.metric === 'tvs') {
    if (state.tvsUnit !== DEFAULT_COMPARE_TVS_UNIT) {
      params.set('unit', state.tvsUnit)
    }
    if (state.tvsFilter !== DEFAULT_COMPARE_TVS_FILTER) {
      params.set('filter', state.tvsFilter)
    }
    if (
      state.excludeAssociatedTokens !==
      DEFAULT_COMPARE_EXCLUDE_ASSOCIATED_TOKENS
    ) {
      params.set('excludeAssociated', String(state.excludeAssociatedTokens))
    }
    if (
      state.excludeRwaRestrictedTokens !==
      DEFAULT_COMPARE_EXCLUDE_RWA_RESTRICTED_TOKENS
    ) {
      params.set('excludeRwa', String(state.excludeRwaRestrictedTokens))
    }
  }
  // Keep commas literal so shared links stay readable.
  const query = params.toString().replaceAll('%2C', ',')
  return query ? `${path}?${query}` : path
}
