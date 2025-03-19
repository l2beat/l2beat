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

        if (!filterable.some((f) => f.id === filter.id)) {
          return false
        }

        const matches = filterable.some(
          (f) => f.id === filter.id && filter.values.includes(f.value),
        )
        return filter.inversed ? !matches : matches
      })
    },
    [state],
  )

  return filter
}
