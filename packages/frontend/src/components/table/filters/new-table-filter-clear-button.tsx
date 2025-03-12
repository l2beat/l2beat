'use client'

import { useNewTableFilterContext } from './new-table-filter-context'

export function NewTableFilterClearButton() {
  const { dispatch } = useNewTableFilterContext()
  return (
    <button
      className="h-8 shrink-0 text-xs text-secondary"
      onClick={() => dispatch({ type: 'clear' })}
    >
      Clear filters
    </button>
  )
}
