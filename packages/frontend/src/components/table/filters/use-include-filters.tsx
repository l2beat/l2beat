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
        const filterableValue = filterable.find((f) => f.id === filter.id)
        if (!filterableValue) {
          return false
        }

        const valueMatches = filter.values.includes(filterableValue.value)
        return filter.reversed ? !valueMatches : valueMatches
      })
    },
    [state],
  )

  return filter
}
