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
import { MessagesTable } from './table/MessagesTable'
import type { MessageStatsRow } from './types'
import { formatKnownAppCoverage } from './utils'

export function MessagesPage() {
  const { data, error, isError, isLoading, isFetching, refetch } =
    api.interop.messages.stats.useQuery()

  const rows: MessageStatsRow[] = data ?? []
  const totalMessages = rows.reduce((sum, row) => sum + row.count, 0)
  const totalKnownMessages = rows.reduce(
    (sum, row) => sum + row.knownAppCount,
    0,
  )
  const totalPairs = rows.reduce((sum, row) => sum + row.chains.length, 0)
  const knownCoverage = formatKnownAppCoverage(
    totalMessages,
    totalKnownMessages,
  )

  return (
    <AppLayout>
      <div className="flex flex-col gap-4">
        <Card className="gap-4">
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle>Messages</CardTitle>
              <CardDescription>
                Message type stats and chain-pair drill-down migrated from the
                legacy interop router.
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
            <Badge variant="secondary">{rows.length} message types</Badge>
            <Badge variant="secondary">{totalMessages} total messages</Badge>
            <Badge variant="secondary">
              {totalKnownMessages} messages with known app
            </Badge>
            <Badge variant="secondary">
              {knownCoverage} known app coverage
            </Badge>
            <Badge variant="secondary">{totalPairs} chain pairs</Badge>
          </CardContent>
        </Card>

        <Card className="gap-0 py-0">
          <CardContent className="px-0">
            {isLoading ? <LoadingState className="m-6" /> : null}
            {isError ? (
              <ErrorState className="m-6" cause={error.message} />
            ) : null}
            {!isLoading && !isError ? (
              <MessagesTable data={rows} enableCsvExport enablePairsCsvExport />
            ) : null}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
