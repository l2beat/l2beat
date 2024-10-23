import { NotSyncedIcon } from '~/components/badge/not-synced-badge'
import { Skeleton } from '~/components/core/skeleton'
import { formatRange } from '~/utils/dates'
import { useChartLoading } from './chart-loading-context'

interface Props {
  range: [number, number] | undefined
  syncStatus?: {
    isSynced: boolean
    syncedUntil?: number
  }
}

export function ChartTimeRange({ range }: Props) {
  const loading = useChartLoading()
  if (loading) {
    return <Skeleton className="h-5 w-44 lg:h-6 lg:w-52" />
  }

  return (
    <p className="flex items-center text-xs font-medium text-zinc-500 lg:text-base">
      {range ? formatRange(...range) : null}
    </p>
  )
}

export function ProjectChartTimeRange({ range, syncStatus }: Props) {
  const loading = useChartLoading()
  if (loading) {
    return <Skeleton className="h-8 w-44 lg:w-52" />
  }

  return (
    <div className="flex h-8 items-center gap-2 font-bold">
      {range ? formatRange(...range) : null}{' '}
      {syncStatus && !syncStatus.isSynced && (
        <NotSyncedIcon syncedUntil={syncStatus.syncedUntil} />
      )}
    </div>
  )
}
