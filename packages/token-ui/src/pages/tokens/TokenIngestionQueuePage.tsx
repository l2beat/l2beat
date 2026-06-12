import type { IngestionOutcome } from '@l2beat/token-backend'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DatabaseIcon,
  EyeIcon,
  ListChecksIcon,
  RotateCwIcon,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { ButtonWithSpinner } from '~/components/ButtonWithSpinner'
import { Badge } from '~/components/core/Badge'
import { Button } from '~/components/core/Button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/core/Card'
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/Tooltip'
import { ExplorerLink } from '~/components/ExplorerLink'
import {
  ConflictBadge,
  formatAbstractRef,
  IngestionPreviewDialog,
  type IngestionPreviewState,
} from '~/components/IngestionPreviewDialog'
import { LoadingState } from '~/components/LoadingState'
import { AppLayout } from '~/layouts/AppLayout'
import { useTRPC } from '~/react-query/trpc'

const PAGE_SIZE = 100

export function TokenIngestionQueuePage() {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const [approvingKey, setApprovingKey] = useState<string | undefined>()
  const [retryingKey, setRetryingKey] = useState<string | undefined>()
  const [preview, setPreview] = useState<IngestionPreviewState | undefined>()
  const [page, setPage] = useState(1)
  const { data: queuePage, isLoading } = useQuery(
    trpc.tokenIngestionQueue.getPage.queryOptions(
      { page, pageSize: PAGE_SIZE },
      { refetchInterval: 10_000 },
    ),
  )
  const { data: chains } = useQuery(trpc.chains.getAll.queryOptions())
  const rows = queuePage?.rows ?? []
  const totalCount = queuePage?.totalCount ?? 0
  const stagedEntries = rows
    .filter((row) => row.entry.state === 'staged')
    .map((row) => row.entry)
  const pageCount = queuePage
    ? Math.max(1, Math.ceil(queuePage.totalCount / PAGE_SIZE))
    : page
  const chainsByName = useMemo(
    () => new Map(chains?.map((chain) => [chain.name, chain])),
    [chains],
  )

  useEffect(() => {
    if (page > pageCount) {
      setPage(pageCount)
    }
  }, [page, pageCount])

  const approve = useMutation(
    trpc.tokenIngestionQueue.approve.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.tokenIngestionQueue.getPage.queryFilter(),
        )
        toast.success('Queue entry approved')
      },
      onError: (error) => toast.error(error.message),
      onSettled: () => setApprovingKey(undefined),
    }),
  )
  const approveMany = useMutation(
    trpc.tokenIngestionQueue.approveMany.mutationOptions({
      onSuccess: async ({ approved }) => {
        await queryClient.invalidateQueries(
          trpc.tokenIngestionQueue.getPage.queryFilter(),
        )
        toast.success(`Approved ${approved} queue entries`)
      },
      onError: (error) => toast.error(error.message),
    }),
  )
  const retry = useMutation(
    trpc.tokenIngestionQueue.retry.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.tokenIngestionQueue.getPage.queryFilter(),
        )
        toast.success('Queue entry queued for retry')
      },
      onError: (error) => toast.error(error.message),
      onSettled: () => setRetryingKey(undefined),
    }),
  )
  const previewMutation = useMutation(
    trpc.tokenIngestionQueue.preview.mutationOptions({
      onSuccess: (trace) => {
        setPreview((prev) =>
          prev ? { ...prev, trace, isLoading: false } : prev,
        )
      },
      onError: (error) => {
        setPreview((prev) =>
          prev ? { ...prev, error: error.message, isLoading: false } : prev,
        )
      },
    }),
  )

  function startPreview(entry: { chain: string; address: string }) {
    setPreview({
      chain: entry.chain,
      address: entry.address,
      trace: undefined,
      isLoading: true,
      error: undefined,
    })
    previewMutation.mutate({ chain: entry.chain, address: entry.address })
  }

  function approveAllOnPage() {
    if (stagedEntries.length === 0) {
      return
    }

    const confirmed = window.confirm(
      `Approve ${stagedEntries.length} staged queue entries on this page?`,
    )
    if (!confirmed) {
      return
    }

    approveMany.mutate(
      stagedEntries.map(({ chain, address }) => ({ chain, address })),
    )
  }

  return (
    <AppLayout>
      <Card className="flex h-[calc(100vh-16px)] flex-col">
        <CardHeader>
          <CardTitle>Token ingestion queue</CardTitle>
          {queuePage && (
            <CardDescription>
              {formatQueueRange(page, totalCount)}
            </CardDescription>
          )}
          {queuePage && (
            <CardAction>
              <div className="flex flex-wrap items-center justify-end gap-2">
                <ButtonWithSpinner
                  size="sm"
                  isLoading={approveMany.isPending}
                  disabled={stagedEntries.length === 0}
                  onClick={approveAllOnPage}
                >
                  <CheckIcon />
                  Approve all on this page
                </ButtonWithSpinner>
                {totalCount > PAGE_SIZE && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page <= 1}
                      onClick={() => setPage((page) => Math.max(1, page - 1))}
                    >
                      <ChevronLeftIcon />
                      Previous
                    </Button>
                    <div className="whitespace-nowrap text-muted-foreground text-sm tabular-nums">
                      Page {page} of {pageCount}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= pageCount}
                      onClick={() =>
                        setPage((page) => Math.min(pageCount, page + 1))
                      }
                    >
                      Next
                      <ChevronRightIcon />
                    </Button>
                  </>
                )}
              </div>
            </CardAction>
          )}
        </CardHeader>
        <CardContent className="min-h-0 flex-1 overflow-y-auto">
          {isLoading ? (
            <LoadingState className="h-full" />
          ) : rows.length === 0 ? (
            <Empty className="h-full">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <ListChecksIcon />
                </EmptyMedia>
                <EmptyTitle>No queue entries</EmptyTitle>
              </EmptyHeader>
            </Empty>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Chain</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Will do</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map(
                  ({ entry, predictedOutcome, deployedTokenExists }) => {
                    const key = getQueueEntryKey(entry)
                    const chain = chainsByName.get(entry.chain)

                    return (
                      <TableRow key={key}>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <QueueStateBadge state={entry.state} />
                            {deployedTokenExists && <DeployedTokenExistsIcon />}
                          </div>
                        </TableCell>
                        <TableCell>{entry.chain}</TableCell>
                        <TableCell className="font-mono text-xs">
                          {chain?.explorerUrl ? (
                            <ExplorerLink
                              explorerUrl={chain.explorerUrl}
                              value={entry.address}
                              type="address"
                            />
                          ) : (
                            entry.address
                          )}
                        </TableCell>
                        <TableCell className="max-w-[520px] whitespace-normal break-words text-muted-foreground">
                          {entry.message ?? '-'}
                        </TableCell>
                        <TableCell className="max-w-[420px] whitespace-normal break-words">
                          <PredictedOutcome outcome={predictedOutcome} />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                startPreview({
                                  chain: entry.chain,
                                  address: entry.address,
                                })
                              }
                            >
                              <EyeIcon />
                              Preview
                            </Button>
                            {entry.state === 'staged' && (
                              <ButtonWithSpinner
                                variant="outline"
                                size="sm"
                                className="border-green-600/40 text-green-700 hover:bg-green-50 hover:text-green-800 dark:border-green-500/40 dark:text-green-400 dark:hover:bg-green-950/30 dark:hover:text-green-300"
                                spinnerClassName="fill-green-700 dark:fill-green-400"
                                isLoading={
                                  approve.isPending && approvingKey === key
                                }
                                onClick={() => {
                                  setApprovingKey(key)
                                  approve.mutate({
                                    chain: entry.chain,
                                    address: entry.address,
                                  })
                                }}
                              >
                                <CheckIcon />
                                Approve
                              </ButtonWithSpinner>
                            )}
                            {(entry.state === 'conflict' ||
                              entry.state === 'error') && (
                              <ButtonWithSpinner
                                variant="outline"
                                size="sm"
                                isLoading={
                                  retry.isPending && retryingKey === key
                                }
                                onClick={() => {
                                  setRetryingKey(key)
                                  retry.mutate({
                                    chain: entry.chain,
                                    address: entry.address,
                                  })
                                }}
                              >
                                <RotateCwIcon />
                                Retry
                              </ButtonWithSpinner>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  },
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <IngestionPreviewDialog
        state={preview}
        onClose={() => setPreview(undefined)}
      />
    </AppLayout>
  )
}

function QueueStateBadge({
  state,
}: {
  state: 'staged' | 'pending' | 'conflict' | 'error'
}) {
  switch (state) {
    case 'staged':
      return <Badge variant="secondary">Staged</Badge>
    case 'pending':
      return <Badge>Pending</Badge>
    case 'conflict':
      return <ConflictBadge />
    case 'error':
      return <Badge variant="destructive">Error</Badge>
  }
}

function DeployedTokenExistsIcon() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <DatabaseIcon className="size-4 shrink-0 text-green-600 dark:text-green-400" />
      </TooltipTrigger>
      <TooltipContent>The deployed token is already in TokenDB.</TooltipContent>
    </Tooltip>
  )
}

function getQueueEntryKey(entry: { chain: string; address: string }) {
  return `${entry.chain}:${entry.address}`
}

function formatQueueRange(page: number, totalCount: number) {
  if (totalCount === 0) {
    return '0 entries'
  }

  const start = (page - 1) * PAGE_SIZE + 1
  const end = Math.min(page * PAGE_SIZE, totalCount)
  return `Showing ${start}-${end} of ${totalCount} entries`
}

function PredictedOutcome({ outcome }: { outcome: IngestionOutcome }) {
  switch (outcome.kind) {
    case 'skip':
      return (
        <span>
          <Badge variant="outline">Skip</Badge>
          <span className="ml-2 text-muted-foreground text-xs">
            {outcome.reason}
          </span>
        </span>
      )
    case 'conflict':
      return (
        <span>
          <ConflictBadge />
          <span className="ml-2 text-muted-foreground text-xs">
            {outcome.message}
          </span>
        </span>
      )
    case 'error':
      return (
        <span>
          <Badge variant="destructive">Error</Badge>
          <span className="ml-2 text-muted-foreground text-xs">
            {outcome.message}
          </span>
        </span>
      )
    case 'noop':
      return <Badge variant="secondary">No update</Badge>
    case 'write':
      return (
        <Badge>
          {outcome.deployedToken.type === 'insert' ? 'Add token' : 'Update'}
        </Badge>
      )
    case 'pending':
      return (
        <span>
          <Badge>
            {outcome.operation === 'insert' ? 'Add token' : 'Update'}
          </Badge>
          <span className="ml-2 text-muted-foreground text-xs">
            {outcome.abstract.kind === 'existing'
              ? `abstract ${formatAbstractRef(outcome.abstract.token)}`
              : `abstract from coingecko ${outcome.abstract.coingeckoId} (new)`}
          </span>
        </span>
      )
  }
}
