import { RefreshCwIcon } from 'lucide-react'
import { Badge } from '~/components/core/Badge'
import { Button } from '~/components/core/Button'
import { ErrorState } from '~/components/ErrorState'
import { LoadingState } from '~/components/LoadingState'
import { TablePageLayout } from '~/components/table/TablePageLayout'
import { api } from '~/react-query/trpc'
import { TrackedTxsStatusTable } from './table/TrackedTxsStatusTable'
import type { TrackedTxsStatusRow } from './types'

export function TrackedTxsStatusPage() {
  const { data, error, isError, isLoading, isFetching, refetch } =
    api.trackedTxs.status.configs.useQuery(undefined, {
      refetchInterval: 3600_000,
    })

  const rows: TrackedTxsStatusRow[] = data ?? []
  const missingCount = rows.filter((row) => row.status === 'missing').length
  const staleCount = rows.filter((row) => row.status === 'stale').length
  const freshCount = rows.filter((row) => row.status === 'fresh').length

  return (
    <TablePageLayout
      title="Tracked txs status"
      description="Active tracked transaction configs and their latest indexed data point."
      actions={
        <Button
          variant="outline"
          size="sm"
          onClick={() => void refetch()}
          disabled={isFetching}
        >
          <RefreshCwIcon className={isFetching ? 'animate-spin' : ''} />
          Refresh
        </Button>
      }
      summary={
        <>
          <Badge variant="secondary">{rows.length} rows</Badge>
          <Badge
            variant="secondary"
            className={
              missingCount > 0
                ? 'border-transparent bg-yellow-100 text-yellow-900 dark:bg-yellow-900/40 dark:text-yellow-100'
                : undefined
            }
          >
            {missingCount} missing
          </Badge>
          <Badge variant={staleCount > 0 ? 'destructive' : 'secondary'}>
            {staleCount} stale
          </Badge>
          <Badge variant="secondary">{freshCount} fresh</Badge>
        </>
      }
    >
      {isLoading ? <LoadingState className="m-6" /> : null}
      {isError ? <ErrorState className="m-6" cause={error.message} /> : null}
      {!isLoading && !isError ? (
        <TrackedTxsStatusTable data={rows} enableCsvExport />
      ) : null}
    </TablePageLayout>
  )
}
