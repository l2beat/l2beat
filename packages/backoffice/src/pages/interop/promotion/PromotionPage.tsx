import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CheckIcon, RefreshCwIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
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
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '~/components/core/Empty'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/core/Table'
import { ErrorState } from '~/components/ErrorState'
import { LoadingState } from '~/components/LoadingState'
import { useHashTarget } from '~/hooks/useHashTarget'
import { AppLayout } from '~/layouts/AppLayout'
import { formatTransferTimestamp } from '~/pages/interop/transfers/utils'
import { useBackendTrpc } from '~/react-query/trpc'

export function PromotionPage() {
  const trpc = useBackendTrpc()
  const queryClient = useQueryClient()
  const [pendingTimestamp, setPendingTimestamp] = useState<number | null>(null)
  const highlightTimestamp = useHashTarget()

  const { data, error, isError, isLoading, isFetching, refetch } = useQuery(
    trpc.interop.promotion.listRecent.queryOptions(),
  )

  const rows = data ?? []
  const blockedCount = rows.filter((row) => row.status === 'blocked').length

  // Scroll to and highlight a deep-linked snapshot row once the list has loaded.
  const scrolledToRef = useRef<string | undefined>(undefined)
  // biome-ignore lint/correctness/useExhaustiveDependencies: `rows` re-triggers this effect after the list loads
  useEffect(() => {
    if (!highlightTimestamp || scrolledToRef.current === highlightTimestamp) {
      return
    }
    const element = document.getElementById(
      `promotion-snapshot-${highlightTimestamp}`,
    )
    if (element) {
      scrolledToRef.current = highlightTimestamp
      element.scrollIntoView({ block: 'center' })
    }
  }, [highlightTimestamp, rows])

  const promote = useMutation(
    trpc.interop.promotion.promote.mutationOptions({
      onSuccess: (result) => {
        if (result.promoted) {
          toast.success('Snapshot promoted', {
            description: `Window end ${formatTransferTimestamp(result.timestamp)} UTC is now promoted.`,
          })
        } else {
          toast.info('No change', {
            description:
              'This snapshot was no longer blocked; the list refreshed.',
          })
        }
        void queryClient.invalidateQueries(
          trpc.interop.promotion.listRecent.queryFilter(),
        )
      },
      onError: (mutationError) => {
        toast.error('Promote failed', { description: mutationError.message })
      },
      onSettled: () => {
        setPendingTimestamp(null)
      },
    }),
  )

  return (
    <AppLayout>
      <div className="flex flex-col gap-4">
        <Card className="gap-4">
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle>Promotion</CardTitle>
              <CardDescription>
                Per-snapshot promotion verdicts from the aggregate gate. Promote
                a blocked snapshot to accept it; the manual verdict is sticky
                and the engine will not revert it.
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
            {isLoading ? (
              <Badge variant="secondary">Loading snapshots</Badge>
            ) : null}
            {isError ? (
              <Badge variant="destructive">Failed to load snapshots</Badge>
            ) : null}
            {!isLoading && !isError ? (
              <>
                <Badge variant="secondary">{rows.length} snapshots</Badge>
                <Badge variant={blockedCount > 0 ? 'destructive' : 'secondary'}>
                  {blockedCount} blocked
                </Badge>
              </>
            ) : null}
          </CardContent>
        </Card>

        {isLoading ? (
          <Card className="gap-0 py-0">
            <CardContent className="px-0">
              <LoadingState className="m-6" />
            </CardContent>
          </Card>
        ) : null}

        {isError ? (
          <Card className="gap-0 py-0">
            <CardContent className="px-0">
              <ErrorState className="m-6" cause={error.message} />
            </CardContent>
          </Card>
        ) : null}

        {!isLoading && !isError && rows.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <Empty className="border">
                <EmptyHeader>
                  <EmptyTitle>No snapshots</EmptyTitle>
                  <EmptyDescription>
                    No aggregate promotion status rows have been recorded yet.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            </CardContent>
          </Card>
        ) : null}

        {!isLoading && !isError && rows.length > 0 ? (
          <Card className="gap-0 py-0">
            <CardContent className="px-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Window end (UTC)</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Promoted by</TableHead>
                    <TableHead>Reasons</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row) => {
                    const isBlocked = row.status === 'blocked'
                    const isPending =
                      promote.isPending && pendingTimestamp === row.timestamp
                    const isHighlighted =
                      String(row.timestamp) === highlightTimestamp
                    return (
                      <TableRow
                        key={row.timestamp}
                        id={`promotion-snapshot-${row.timestamp}`}
                        className={
                          isHighlighted
                            ? '!bg-blue-100 dark:!bg-blue-900/40'
                            : undefined
                        }
                      >
                        <TableCell className="whitespace-nowrap font-mono text-xs">
                          {formatTransferTimestamp(row.timestamp)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={isBlocked ? 'destructive' : 'secondary'}
                          >
                            {row.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-xs">
                          {row.promotedBy ?? '-'}
                        </TableCell>
                        <TableCell className="text-xs">
                          {row.reasons.length > 0 ? (
                            <div className="flex flex-col gap-1">
                              {row.reasons.map((reason, index) => (
                                <span
                                  key={`${row.timestamp}-${reason.rule}-${reason.scope}-${index}`}
                                >
                                  {reason.message ||
                                    `${reason.rule} (${reason.scope})`}
                                </span>
                              ))}
                            </div>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {isBlocked ? (
                            <Button
                              size="sm"
                              onClick={() => {
                                setPendingTimestamp(row.timestamp)
                                promote.mutate({ timestamp: row.timestamp })
                              }}
                              disabled={promote.isPending}
                            >
                              <CheckIcon
                                className={isPending ? 'animate-spin' : ''}
                              />
                              {isPending ? 'Promoting...' : 'Promote'}
                            </Button>
                          ) : null}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </AppLayout>
  )
}
