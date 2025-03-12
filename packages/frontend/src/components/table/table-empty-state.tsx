import { linkVariants } from '../link/custom-link'
import { useNewTableFilterContext } from './filters/new-table-filter-context'

export function TableEmptyState() {
  const { dispatch } = useNewTableFilterContext()

  const reset = () => {
    dispatch({ type: 'clear' })
  }

  return (
    <div className="mt-6 flex flex-col items-center justify-center rounded-b-lg bg-blue-700/15 py-10">
      <span className="mb-4 text-2xl font-medium">No results</span>
      <span className="mb-6">There are no results meeting the criteria</span>
      <button onClick={reset} className={linkVariants({ variant: 'primary' })}>
        Reset all filters
      </button>
    </div>
  )
}
