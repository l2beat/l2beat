import type { FilterState } from '../use-filter-state'

export function getFilterSearchParams(state: FilterState) {
  return encodeURIComponent(JSON.stringify(state))
}
