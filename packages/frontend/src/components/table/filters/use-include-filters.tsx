import { useCallback } from 'react'
import { useTableFilterContext } from './table-filter-context'
import type { FilterableEntry } from './types'

export function useIncludeFilters() {
  const { state } = useTableFilterContext()

  const filter = useCallback(
    ({ filterable }: FilterableEntry) => {
      return state.every((filter) => {
        // If filterable is undefined, it means that the entry is not filterable
        if (filterable === undefined) {
          return true
        }
        // You can have multiple filterable values with the same id, e.g. purpose
        const filterableValues = filterable.filter((f) => f.id === filter.id)
        if (filterableValues.length === 0) {
          return false
        }

        const valueMatches = filterableValues.some((f) =>
          filter.values.includes(f.value),
        )
        return filter.inversed ? !valueMatches : valueMatches
      })
    },
    [state],
  )

  return filter
}
