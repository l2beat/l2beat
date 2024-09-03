import { useOptionalScalingFilterValues } from '~/app/(new)/(other)/_components/scaling-filter-context'
import { linkVariants } from '../link/custom-link'
import { useOptionalBridgesFilterValues } from '~/app/(new)/(other)/bridges/_components/bridges-filter-context'

export function TableEmptyState() {
  const filterStates = [
    useOptionalScalingFilterValues(),
    useOptionalBridgesFilterValues(),
  ]

  const reset = () => {
    for (const filter of filterStates) {
      if (filter) {
        filter.reset()
      }
    }
  }

  return (
    <div className="mt-6 flex flex-col items-center justify-center rounded-b-lg bg-blue-700/15 py-10">
      <span className="mb-4 text-2xl font-semibold">No results</span>
      <span className="mb-6">There are no results meeting the criteria</span>
      <button onClick={reset} className={linkVariants({ variant: 'primary' })}>
        Reset all filters
      </button>
    </div>
  )
}
