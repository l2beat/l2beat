import { useTableFilterContext } from './TableFilterContext'

export function TableFilterClearButton() {
  const { dispatch } = useTableFilterContext()
  return (
    <button
      className="h-8 shrink-0 text-secondary text-xs"
      onClick={() => dispatch({ type: 'clear' })}
    >
      Clear filters
    </button>
  )
}
