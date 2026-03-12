import type { RouterOutputs } from '@l2beat/interop-backoffice'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/core/Table'
import { LoadingState } from '~/components/LoadingState'
import { AppLayout } from '~/layouts/AppLayout'
import { api } from '~/react-query/trpc'

type PluginStatus = RouterOutputs['plugin']['status'][number]

function formatDistanceFromNow(timestamp: number): string {
  const nowMs = Date.now()
  const timestampMs = timestamp * 1000
  const diffMs = Math.max(0, nowMs - timestampMs)
  if (diffMs < 60_000) {
    return '<1m'
  }

  const totalMinutes = Math.ceil(diffMs / 60_000)
  const days = Math.floor(totalMinutes / 1440)
  const hours = Math.floor((totalMinutes % 1440) / 60)
  const minutes = totalMinutes % 60
  const parts: string[] = []

  if (days) {
    parts.push(`${days}d`)
  }
  if (hours) {
    parts.push(`${hours}h`)
  }
  if (minutes || parts.length === 0) {
    parts.push(`${minutes}m`)
  }

  return parts.join(' ')
}

function getSyncModeBadgeVariant(syncMode?: string) {
  if (!syncMode) {
    return 'outline' as const
  }

  const normalized = syncMode.toLowerCase()
  if (normalized.includes('error')) {
    return 'destructive' as const
  }
  if (normalized.includes('synced')) {
    return 'default' as const
  }
  return 'secondary' as const
}

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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plugin</TableHead>
                    <TableHead>Chain</TableHead>
                    <TableHead>Sync mode</TableHead>
                    <TableHead>Distance from now</TableHead>
                    <TableHead>To block</TableHead>
                    <TableHead>Last error</TableHead>
                    <TableHead>Resync from</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="h-20 text-center text-muted-foreground"
                      >
                        No plugin statuses found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    rows.map((row) => (
                      <TableRow key={`${row.pluginName}-${row.chain}`}>
                        <TableCell>{row.pluginName}</TableCell>
                        <TableCell>{row.chain}</TableCell>
                        <TableCell>
                          <Badge
                            variant={getSyncModeBadgeVariant(row.syncMode)}
                          >
                            {row.syncMode ?? '?'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {row.toTimestamp !== undefined
                            ? formatDistanceFromNow(row.toTimestamp)
                            : 'n/a'}
                        </TableCell>
                        <TableCell>{row.toBlock ?? 'n/a'}</TableCell>
                        <TableCell className="max-w-[420px] whitespace-normal break-words">
                          {row.lastError ?? ''}
                        </TableCell>
                        <TableCell>
                          {row.resyncRequestedFrom !== undefined
                            ? formatDistanceFromNow(row.resyncRequestedFrom)
                            : ''}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
