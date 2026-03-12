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
import { LoadingState } from '~/components/LoadingState'
import { AppLayout } from '~/layouts/AppLayout'
import { api } from '~/react-query/trpc'
import { PluginStatusesTable } from './table/PluginStatusesTable'
import type { PluginStatus } from './table/types'

export function PluginStatusesPage() {
  const { data, isLoading, isError, error, refetch, isFetching } =
    api.plugin.status.useQuery(undefined, {
      refetchInterval: 5_000,
      refetchOnWindowFocus: true,
    })

  const rows: PluginStatus[] = data ?? []
  const rowsWithErrors = rows.filter((row) => row.lastError).length

  return (
    <AppLayout className="min-h-screen">
      <div className="flex flex-col gap-4 p-4">
        <Card className="gap-4">
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle>Plugin statuses</CardTitle>
              <CardDescription>
                Live sync state from the interop syncers (auto-refresh every 5
                seconds).
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void refetch()}
              disabled={isFetching}
            >
              <RefreshCwIcon className={isFetching ? 'animate-spin' : ''} />
              Refresh
            </Button>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Badge variant="secondary">{rows.length} rows</Badge>
            <Badge variant={rowsWithErrors > 0 ? 'destructive' : 'secondary'}>
              {rowsWithErrors} with errors
            </Badge>
          </CardContent>
        </Card>

        <Card className="gap-0">
          <CardContent className="px-0">
            {isLoading ? <LoadingState className="m-6" /> : null}
            {isError ? (
              <div className="px-6 py-4 text-destructive text-sm">
                Failed to load plugin statuses: {error.message}
              </div>
            ) : null}
            {!isLoading && !isError ? (
              <PluginStatusesTable data={rows} enableCsvExport />
            ) : null}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
