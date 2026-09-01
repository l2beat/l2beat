import { useQuery } from '@tanstack/react-query'
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
import { useBackendTrpc } from '~/react-query/trpc'
import { DaTrackingStatusTable } from './table/DaTrackingStatusTable'
import type { DaTrackingStatusRow } from './types'

export function DaTrackingStatusPage() {
  const trpc = useBackendTrpc()
  const { data, error, isError, isLoading, isFetching, refetch } = useQuery(
    trpc.dataAvailability.status.configs.queryOptions(undefined, {
      refetchInterval: 3600_000,
    }),
  )

  const rows: DaTrackingStatusRow[] = data ?? []
  const missingCount = rows.filter((row) => row.status === 'missing').length
  const staleCount = rows.filter((row) => row.status === 'stale').length
  const freshCount = rows.filter((row) => row.status === 'fresh').length

  return (
    <AppLayout className="h-[calc(100svh-var(--spacing-environment-banner))] overflow-hidden">
      <div className="flex min-h-0 flex-1 flex-col gap-3">
        <Card className="shrink-0 gap-0 py-4">
          <CardHeader className="space-y-0 px-6 pt-0 pb-0">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <CardTitle>DA tracking status</CardTitle>
                  <div className="flex flex-wrap items-center gap-2">
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
                    <Badge
                      variant={staleCount > 0 ? 'destructive' : 'secondary'}
                    >
                      {staleCount} stale
                    </Badge>
                    <Badge variant="secondary">{freshCount} fresh</Badge>
                  </div>
                </div>
                <CardDescription>
                  Active DA tracking configs and their latest indexed data
                  point.
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

        <Card className="min-h-0 flex-1 gap-0 py-0">
          <CardContent className="flex min-h-0 flex-1 flex-col px-0 pb-6">
            {isLoading ? <LoadingState className="m-6" /> : null}
            {isError ? (
              <ErrorState className="m-6" cause={error.message} />
            ) : null}
            {!isLoading && !isError ? (
              <DaTrackingStatusTable
                data={rows}
                className="min-h-0 flex-1"
                scrollViewportClassName="min-h-0 flex-1 max-h-none"
                enableCsvExport
              />
            ) : null}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
