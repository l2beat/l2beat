import { useCallback } from 'react'
import type { FilterableEntry, FilterableValueId } from './filterable-value'
import { useTableFilterContext } from './table-filter-context'

export function useFilterEntries() {
  const { state } = useTableFilterContext()

  const filter = useCallback(
    ({ filterable }: FilterableEntry) => {
      if (filterable === undefined) {
        return true
      }

      for (const id in state) {
        const filter = state[id as FilterableValueId]!

        const matches = filterable.some(
          (f) => f.id === id && filter.values.includes(f.value),
        )
        const result = filter.inversed ? !matches : matches

        if (result === false) {
          return false
        }
      }
      return true
    },

    [state],
  )

  return filter
}
