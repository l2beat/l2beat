import type { FilterState } from '../UseFilterState'

export function getFilterSearchParams(state: FilterState) {
  return encodeURIComponent(JSON.stringify(state))
}
