import { useCallback } from 'react'
import { useNewTableFilterContext } from './new-table-filter-context'
import type { FilterableValue } from './new-types'

export function useIncludeFilters() {
  const { state } = useNewTableFilterContext()

  const filter = useCallback(
    ({ filterable }: { filterable: FilterableValue[] }) => {
      return state.every((filter) => {
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
