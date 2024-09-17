import { EmptyStateIcon } from '~/icons/empty-state'
import { useChartContext } from './chart-context'
import { useChartLoading } from './chart-loading-context'

export function ChartNoDataState() {
  const { columns } = useChartContext()
  const isLoading = useChartLoading()
  if (columns.length > 1 || isLoading) return null

  return (
    <div className="absolute inset-0 z-30 flex select-none flex-col items-center justify-center gap-4 text-center duration-200 dark:from-neutral-900">
      <EmptyStateIcon className="fill-yellow-700 dark:fill-yellow-200" />
      <span className="text-2xl font-semibold leading-none text-yellow-700 dark:text-yellow-200">
        No data
      </span>
      <span className="text-sm">
        There&apos;s no data for the project and the selected criteria. Please
        try again later.
      </span>
    </div>
  )
}
