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
import { MessagesTable } from '../table/messages/MessagesTable'
import type { SummaryMessageRow } from '../table/types'

export function SummaryMessagesPage() {
  const { data, isLoading, isError, error, refetch, isFetching } =
    api.summary.messages.useQuery()

  const rows: SummaryMessageRow[] = data ?? []
  const totalMessages = rows.reduce((sum, row) => sum + row.count, 0)
  const knownAppMessages = rows.reduce((sum, row) => sum + row.knownAppCount, 0)
  const totalPairs = rows.reduce((sum, row) => sum + row.chains.length, 0)

  return (
    <AppLayout className="min-h-screen">
      <div className="flex flex-col gap-4 p-4">
        <SummarySubnav />

        <Card className="gap-4">
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle>Summary: Messages</CardTitle>
              <CardDescription>
                Master-detail replacement for the legacy src×dst matrix.
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
              {knownAppMessages} known-app messages
            </Badge>
            <Badge variant="secondary">{totalPairs} chain pairs</Badge>
          </CardContent>
        </Card>

        <Card className="gap-0 py-0">
          <CardContent className="px-0">
            {isLoading ? <LoadingState className="m-6" /> : null}
            {isError ? (
              <div className="px-6 py-4 text-destructive text-sm">
                Failed to load summary messages: {error.message}
              </div>
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
