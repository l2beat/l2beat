import { useContext } from 'react'
import { type FilterableValueId, filterIdToLabel } from './filterableValue'
import { TableFilterContext } from './TableFilterContext'
import type { FilterState, FilterValue } from './UseFilterState'

/**
 * Tables outside a filter provider are never filtered, so they get no
 * description rather than an error.
 */
export function useActiveFiltersDescription(): string | undefined {
  const context = useContext(TableFilterContext)
  return context ? describeActiveFilters(context.state) : undefined
}

/** Worded like the filter chips so the caption matches what sighted users see. */
export function describeActiveFilters(state: FilterState): string | undefined {
  const descriptions = Object.entries(state).flatMap(([id, filter]) =>
    filter && filter.values.length > 0
      ? [
          `${filterIdToLabel[id as FilterableValueId]} ${getFilterOperatorLabel(filter)} ${filter.values.join(', ')}`,
        ]
      : [],
  )
  return descriptions.length > 0
    ? `Filtered by ${descriptions.join('; ')}`
    : undefined
}

export function getFilterOperatorLabel(filter: FilterValue) {
  if (filter.inversed) {
    return 'is not'
  }

  return filter.values.length > 1 ? 'is any of' : 'is'
}
