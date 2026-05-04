import { RefreshCwIcon } from 'lucide-react'
import { Badge } from '~/components/core/Badge'
import { Button } from '~/components/core/Button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/core/Card'
import { ErrorState } from '~/components/ErrorState'
import { LoadingState } from '~/components/LoadingState'
import { AppLayout } from '~/layouts/AppLayout'
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
    <AppLayout>
      <div className="flex flex-col gap-3">
        <Card className="shrink-0 gap-0 py-4">
          <CardHeader className="space-y-0 px-6 pt-0 pb-0">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <CardTitle>Tracked Txs status</CardTitle>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">{rows.length} rows</Badge>
                    <Badge
                      variant={missingCount > 0 ? 'destructive' : 'secondary'}
                    >
                      {missingCount} missing
                    </Badge>
                    <Badge
                      variant={staleCount > 0 ? 'destructive' : 'secondary'}
                    >
                      {staleCount} stale
                    </Badge>
                    <Badge variant="secondary">{freshCount} fresh</Badge>
                  </div>
                </div>
                <CardDescription>
                  Active tracked transaction configs and their latest indexed
                  data point.
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="shrink-0"
                onClick={() => void refetch()}
                disabled={isFetching}
              >
                <RefreshCwIcon className={isFetching ? 'animate-spin' : ''} />
                Refresh
              </Button>
            </div>
          </CardHeader>
        </Card>

        <Card className="gap-0 py-0">
          <CardContent className="px-0 pb-6">
            {isLoading ? <LoadingState className="m-6" /> : null}
            {isError ? (
              <ErrorState className="m-6" cause={error.message} />
            ) : null}
            {!isLoading && !isError ? (
              <TrackedTxsStatusTable data={rows} enableCsvExport />
            ) : null}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
