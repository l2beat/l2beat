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
import { EventsTable } from './table/EventsTable'
import type { EventStatsRow } from './types'

export function EventsPage() {
  const { data, error, isError, isLoading, isFetching, refetch } =
    api.interop.events.stats.useQuery()

  const rows: EventStatsRow[] = data ?? []
  const totalEvents = rows.reduce((sum, row) => sum + row.count, 0)
  const unmatchedEvents = rows.reduce((sum, row) => sum + row.unmatched, 0)

  return (
    <AppLayout>
      <div className="flex flex-col gap-4">
        <Card className="gap-4">
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle>Events</CardTitle>
              <CardDescription>
                Event type stats migrated from the legacy interop router.
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
            <Badge variant="secondary">{rows.length} event types</Badge>
            <Badge variant="secondary">{totalEvents} total events</Badge>
            <Badge variant={unmatchedEvents > 0 ? 'destructive' : 'secondary'}>
              {unmatchedEvents} unmatched
            </Badge>
          </CardContent>
        </Card>

        <Card className="gap-0 py-0">
          <CardContent className="px-0">
            {isLoading ? <LoadingState className="m-6" /> : null}
            {isError ? (
              <ErrorState className="m-6" cause={error.message} />
            ) : null}
            {!isLoading && !isError ? (
              <EventsTable data={rows} enableCsvExport />
            ) : null}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
