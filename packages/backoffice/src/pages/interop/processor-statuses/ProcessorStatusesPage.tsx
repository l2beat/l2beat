import { RefreshCwIcon } from 'lucide-react'
import { Badge } from '~/components/core/Badge'
import { Button } from '~/components/core/Button'
import { ErrorState } from '~/components/ErrorState'
import { LoadingState } from '~/components/LoadingState'
import { TablePageLayout } from '~/components/table/TablePageLayout'
import { useBackendApi } from '~/react-query/trpc'
import { ProcessorStatusesTable } from './table/ProcessorStatusesTable'
import type { ProcessorStatusRow } from './types'
import { formatProcessorTimestamp } from './utils'

export function ProcessorStatusesPage() {
  const api = useBackendApi()
  const { data, error, isError, isLoading, isFetching, refetch } =
    api.interop.status.processors.useQuery(undefined, {
      refetchInterval: 2_500,
    })

  const rows: ProcessorStatusRow[] = data ?? []
  const latestTimestamp = rows.reduce<number | undefined>(
    (latest, row) =>
      latest === undefined || row.timestamp > latest ? row.timestamp : latest,
    undefined,
  )

  return (
    <TablePageLayout
      title="Processor statuses"
      description="Latest processed block observed for each interop chain processor."
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
          <Badge variant="secondary">{rows.length} processors</Badge>
          <Badge variant="secondary">Auto-refresh every 2.5s</Badge>
          {latestTimestamp !== undefined ? (
            <Badge variant="secondary">
              Latest update {formatProcessorTimestamp(latestTimestamp)}
            </Badge>
          ) : null}
        </>
      }
    >
      {isLoading ? <LoadingState className="m-6" /> : null}
      {isError ? <ErrorState className="m-6" cause={error.message} /> : null}
      {!isLoading && !isError ? (
        <ProcessorStatusesTable data={rows} enableCsvExport />
      ) : null}
    </TablePageLayout>
  )
}
