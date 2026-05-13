import { CheckIcon, EyeIcon, ListChecksIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { ButtonWithSpinner } from '~/components/ButtonWithSpinner'
import { Badge } from '~/components/core/Badge'
import { Button } from '~/components/core/Button'
import {
  Card,
  CardContent,
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
import { ExplorerLink } from '~/components/ExplorerLink'
import {
  IngestionPreviewDialog,
  type IngestionPreviewState,
} from '~/components/IngestionPreviewDialog'
import { LoadingState } from '~/components/LoadingState'
import { AppLayout } from '~/layouts/AppLayout'
import { api } from '~/react-query/trpc'

export function TokenIngestionQueuePage() {
  const utils = api.useUtils()
  const [approvingKey, setApprovingKey] = useState<string | undefined>()
  const [preview, setPreview] = useState<IngestionPreviewState | undefined>()
  const { data: queue, isLoading } = api.tokenIngestionQueue.getAll.useQuery(
    undefined,
    { refetchInterval: 10_000 },
  )
  const { data: chains } = api.chains.getAll.useQuery()
  const approve = api.tokenIngestionQueue.approve.useMutation({
    onSuccess: async () => {
      await utils.tokenIngestionQueue.getAll.invalidate()
      toast.success('Queue entry approved')
    },
    onError: (error) => toast.error(error.message),
    onSettled: () => setApprovingKey(undefined),
  })
  const previewMutation = api.tokenIngestionQueue.preview.useMutation({
    onSuccess: (trace) => {
      setPreview((prev) => (prev ? { ...prev, trace, isLoading: false } : prev))
    },
    onError: (error) => {
      setPreview((prev) =>
        prev ? { ...prev, error: error.message, isLoading: false } : prev,
      )
    },
  })

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

  return (
    <AppLayout>
      <Card className="flex h-[calc(100vh-16px)] flex-col">
        <CardHeader>
          <CardTitle>Token ingestion queue</CardTitle>
        </CardHeader>
        <CardContent className="min-h-0 flex-1 overflow-y-auto">
          {isLoading ? (
            <LoadingState className="h-full" />
          ) : queue?.length === 0 ? (
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
                  <TableHead>Updated</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {queue?.map((entry) => {
                  const key = getQueueEntryKey(entry)
                  const chain = chains?.find(
                    (chain) => chain.name === entry.chain,
                  )

                  return (
                    <TableRow key={key}>
                      <TableCell>
                        <QueueStateBadge state={entry.state} />
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
                      <TableCell>{formatTimestamp(entry.updatedAt)}</TableCell>
                      <TableCell>{formatTimestamp(entry.createdAt)}</TableCell>
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
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
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
      return <Badge variant="outline">Conflict</Badge>
    case 'error':
      return <Badge variant="destructive">Error</Badge>
  }
}

function getQueueEntryKey(entry: { chain: string; address: string }) {
  return `${entry.chain}:${entry.address}`
}

function formatTimestamp(timestamp: number) {
  return new Date(timestamp * 1000).toISOString().replace('T', ' ').slice(0, 16)
}
