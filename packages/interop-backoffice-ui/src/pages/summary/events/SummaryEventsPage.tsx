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
import { SummarySubnav } from '../components/SummarySubnav'
import { EventsTable } from '../table/EventsTable'
import type { SummaryEventRow } from '../table/types'

export function SummaryEventsPage() {
  const { data, isLoading, isError, error, refetch, isFetching } =
    api.summary.events.useQuery()

  const rows: SummaryEventRow[] = data ?? []
  const totalEvents = rows.reduce((sum, row) => sum + row.count, 0)
  const unmatchedEvents = rows.reduce((sum, row) => sum + row.unmatched, 0)

  return (
    <AppLayout className="min-h-screen">
      <div className="flex flex-col gap-4 p-4">
        <SummarySubnav />

        <Card className="gap-4">
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle>Summary: Events</CardTitle>
              <CardDescription>
                Event type stats migrated from legacy SSR.
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
              <div className="px-6 py-4 text-destructive text-sm">
                Failed to load summary events: {error.message}
              </div>
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
