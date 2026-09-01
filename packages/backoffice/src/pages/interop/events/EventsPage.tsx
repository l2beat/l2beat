import { useQuery } from '@tanstack/react-query'
import { RefreshCwIcon } from 'lucide-react'
import { Badge } from '~/components/core/Badge'
import { Button } from '~/components/core/Button'
import { ErrorState } from '~/components/ErrorState'
import { LoadingState } from '~/components/LoadingState'
import { TablePageLayout } from '~/components/table/TablePageLayout'
import { useBackendTrpc } from '~/react-query/trpc'
import { EventsTable } from './table/EventsTable'
import type { EventStatsRow } from './types'

export function EventsPage() {
  const trpc = useBackendTrpc()
  const { data, error, isError, isLoading, isFetching, refetch } = useQuery(
    trpc.interop.events.stats.queryOptions(),
  )

  const rows: EventStatsRow[] = data ?? []
  const totalEvents = rows.reduce((sum, row) => sum + row.count, 0)
  const unmatchedEvents = rows.reduce((sum, row) => sum + row.unmatched, 0)

  return (
    <TablePageLayout
      title="Events"
      description="Event type stats migrated from the legacy interop router."
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
          <Badge variant="secondary">{rows.length} event types</Badge>
          <Badge variant="secondary">{totalEvents} total events</Badge>
          <Badge variant={unmatchedEvents > 0 ? 'destructive' : 'secondary'}>
            {unmatchedEvents} unmatched
          </Badge>
        </>
      }
    >
      {isLoading ? <LoadingState className="m-6" /> : null}
      {isError ? <ErrorState className="m-6" cause={error.message} /> : null}
      {!isLoading && !isError ? (
        <EventsTable data={rows} enableCsvExport />
      ) : null}
    </TablePageLayout>
  )
}
