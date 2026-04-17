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
import { ProcessorStatusesTable } from './table/ProcessorStatusesTable'
import type { ProcessorStatusRow } from './types'
import { formatProcessorTimestamp } from './utils'

export function ProcessorStatusesPage() {
  const { data, error, isError, isLoading, isFetching, refetch } =
    api.status.processors.useQuery(undefined, {
      refetchInterval: 2_500,
    })

  const rows: ProcessorStatusRow[] = data ?? []
  const latestTimestamp = rows.reduce<number | undefined>(
    (latest, row) =>
      latest === undefined || row.timestamp > latest ? row.timestamp : latest,
    undefined,
  )

  return (
    <AppLayout className="min-h-screen">
      <div className="flex flex-col gap-4">
        <Card className="gap-4">
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle>Processor statuses</CardTitle>
              <CardDescription>
                Latest processed block observed for each interop chain
                processor.
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
            <Badge variant="secondary">{rows.length} processors</Badge>
            <Badge variant="secondary">Auto-refresh every 2.5s</Badge>
            {latestTimestamp !== undefined ? (
              <Badge variant="secondary">
                Latest update {formatProcessorTimestamp(latestTimestamp)}
              </Badge>
            ) : null}
          </CardContent>
        </Card>

        <Card className="gap-0 py-0">
          <CardContent className="px-0">
            {isLoading ? <LoadingState className="m-6" /> : null}
            {isError ? (
              <ErrorState className="m-6" cause={error.message} />
            ) : null}
            {!isLoading && !isError ? (
              <ProcessorStatusesTable data={rows} enableCsvExport />
            ) : null}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
