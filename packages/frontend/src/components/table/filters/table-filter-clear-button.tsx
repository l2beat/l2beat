'use client'

import { useTableFilterContext } from './table-filter-context'

export function TableFilterClearButton() {
  const { dispatch } = useTableFilterContext()
  return (
    <button
      className="h-8 shrink-0 text-xs text-secondary"
      onClick={() => dispatch({ type: 'clear' })}
    >
      Clear filters
    </button>
  )
}
