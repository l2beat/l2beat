import { cn } from '~/utils/cn'
import { linkVariants } from '../link/CustomLink'
import { useTableFilterReset } from './filters/TableFilterContext'

export function TableEmptyState() {
  const reset = useTableFilterReset()

  return (
    <div className="mt-2 flex flex-col items-center justify-center gap-1 rounded-lg bg-blue-700/10 px-4 py-6 text-center">
      <span className="font-medium text-label-value-15">No results</span>
      <span className="text-label-value-13 text-secondary">
        There are no results meeting the criteria
      </span>
      {reset && (
        <button
          onClick={reset}
          className={cn('mt-3', linkVariants({ variant: 'primary' }))}
        >
          Reset all filters
        </button>
      )}
    </div>
  )
}
