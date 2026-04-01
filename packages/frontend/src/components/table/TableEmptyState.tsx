import { linkVariants } from '../link/CustomLink'
import { useTableFilterReset } from './filters/TableFilterContext'

export function TableEmptyState() {
  const reset = useTableFilterReset()

  return (
    <div className="mt-2 flex flex-col items-center justify-center rounded-lg bg-blue-700/15 py-10">
      <span className="mb-4 font-medium text-2xl">No results</span>
      <span className="mb-6">There are no results meeting the criteria</span>
      {reset && (
        <button
          onClick={reset}
          className={linkVariants({ variant: 'primary' })}
        >
          Reset all filters
        </button>
      )}
    </div>
  )
}
