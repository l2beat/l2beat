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
import { useBackendTrpc } from '~/react-query/trpc'
import { formatDistanceFromNow, formatTimestamp } from './table/utils'

interface RelayStatusCardProps {
  autoRefresh: boolean
}

export function RelayStatusCard({ autoRefresh }: RelayStatusCardProps) {
  const trpc = useBackendTrpc()
  const { data, error, isError, isLoading, isFetching, refetch } = useQuery(
    trpc.interop.status.relay.queryOptions(undefined, {
      refetchInterval: autoRefresh ? 5_000 : false,
    }),
  )
  const syncedTo = data?.syncedTo

  return (
    <Card className="gap-4">
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div className="space-y-1">
          <CardTitle>Relay ingestion</CardTitle>
          <CardDescription>
            Global Relay API indexing progress from the persisted UIF
            checkpoint. Relay is not a per-chain capture plugin.
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
      <CardContent>
        {isLoading ? <LoadingState /> : null}
        {isError ? <ErrorState cause={error.message} /> : null}
        {!isLoading && !isError ? (
          syncedTo !== undefined ? (
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                Last completed window {formatTimestamp(syncedTo)} UTC
              </Badge>
              <Badge variant="secondary">
                {formatDistanceFromNow(syncedTo)} behind now
              </Badge>
            </div>
          ) : (
            <Badge variant="outline">No checkpoint observed</Badge>
          )
        ) : null}
      </CardContent>
    </Card>
  )
}
