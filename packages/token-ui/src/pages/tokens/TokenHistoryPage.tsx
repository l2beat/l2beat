import { formatAddress, UnixTime } from '@l2beat/shared-pure'
import type { RouterOutputs } from '@l2beat/token-backend'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  HistoryIcon,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '~/components/core/Sheet'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/core/Table'
import { ObjectDiff } from '~/components/Diff'
import { LoadingState } from '~/components/LoadingState'
import { AppLayout } from '~/layouts/AppLayout'
import { api } from '~/react-query/trpc'

const PAGE_SIZE = 100
const FIELD_LIMIT = 4

type HistoryEntry =
  RouterOutputs['tokenDbHistory']['getPage']['entries'][number]

interface TokenInfo {
  primary: string
  secondary?: string
}

export function TokenHistoryPage() {
  const [page, setPage] = useState(1)
  const [selectedEntry, setSelectedEntry] = useState<HistoryEntry>()
  const { data: historyPage, isLoading } = api.tokenDbHistory.getPage.useQuery(
    { page, pageSize: PAGE_SIZE },
    {
      refetchInterval: 10_000,
      refetchOnMount: 'always',
      staleTime: 0,
    },
  )
  const { data: abstractTokens } = api.abstractTokens.getAll.useQuery()
  const abstractSymbols = useMemo(
    () => new Map(abstractTokens?.map((token) => [token.id, token.symbol])),
    [abstractTokens],
  )

  const entries = historyPage?.entries ?? []
  const totalCount = historyPage?.totalCount ?? 0
  const pageCount = historyPage
    ? Math.max(1, Math.ceil(historyPage.totalCount / PAGE_SIZE))
    : page

  useEffect(() => {
    if (page > pageCount) {
      setPage(pageCount)
    }
  }, [page, pageCount])

  return (
    <AppLayout>
      <Card className="flex h-[calc(100vh-16px)] flex-col">
        <CardHeader>
          <CardTitle>Token DB history</CardTitle>
          {historyPage && (
            <CardDescription>
              {formatHistoryRange(page, totalCount)}
            </CardDescription>
          )}
          {historyPage && totalCount > PAGE_SIZE && (
            <CardAction>
              <div className="flex items-center gap-2">
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
              </div>
            </CardAction>
          )}
        </CardHeader>
        <CardContent className="min-h-0 flex-1 overflow-y-auto">
          {isLoading ? (
            <LoadingState className="h-full" />
          ) : entries.length === 0 ? (
            <Empty className="h-full">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <HistoryIcon />
                </EmptyMedia>
                <EmptyTitle>No history entries</EmptyTitle>
              </EmptyHeader>
            </Empty>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Command</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Token</TableHead>
                  <TableHead>Fields</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => {
                  const token = getTokenInfo(entry, abstractSymbols)

                  return (
                    <TableRow key={entry.id}>
                      <TableCell>
                        <Badge variant="outline">{entry.commandType}</Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap font-mono text-xs">
                        {formatTimestamp(entry.timestamp)}
                      </TableCell>
                      <TableCell className="max-w-[360px] whitespace-normal break-words">
                        <div>{token.primary}</div>
                        {token.secondary && (
                          <div className="text-muted-foreground text-xs">
                            {token.secondary}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="max-w-[360px] whitespace-normal">
                        <ChangedFields entry={entry} />
                      </TableCell>
                      <TableCell>
                        <SourceLabel entry={entry} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedEntry(entry)}
                        >
                          <EyeIcon />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <HistoryDetails
        entry={selectedEntry}
        onClose={() => setSelectedEntry(undefined)}
      />
    </AppLayout>
  )
}

function HistoryDetails({
  entry,
  onClose,
}: {
  entry: HistoryEntry | undefined
  onClose: () => void
}) {
  return (
    <Sheet
      open={entry !== undefined}
      onOpenChange={(open) => !open && onClose()}
    >
      <SheetContent
        side="right"
        className="w-[min(90vw,900px)] gap-0 sm:max-w-3xl"
      >
        {entry && (
          <>
            <SheetHeader>
              <SheetTitle>{entry.commandType}</SheetTitle>
              <SheetDescription>
                {formatTimestamp(entry.timestamp)} | {formatSource(entry)}
              </SheetDescription>
            </SheetHeader>
            <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
              <ObjectDiff left={{}} right={entry.command} maxDepth={4} />
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

function SourceLabel({ entry }: { entry: HistoryEntry }) {
  return (
    <div className="space-y-1">
      <Badge variant={entry.source === 'manual' ? 'secondary' : 'default'}>
        {entry.source}
      </Badge>
      {entry.userEmail && (
        <div className="text-muted-foreground text-xs">{entry.userEmail}</div>
      )}
    </div>
  )
}

function ChangedFields({ entry }: { entry: HistoryEntry }) {
  const fields = getChangedFields(entry)
  if (fields.length === 0) {
    return <span className="text-muted-foreground">-</span>
  }

  const visible = fields.slice(0, FIELD_LIMIT)
  return (
    <div className="flex flex-wrap gap-1">
      {visible.map((field) => (
        <Badge key={field} variant="secondary">
          {field}
        </Badge>
      ))}
      {fields.length > visible.length && (
        <Badge variant="outline">+{fields.length - visible.length}</Badge>
      )}
    </div>
  )
}

function getChangedFields(entry: HistoryEntry) {
  const command = asRecord(entry.command)
  switch (entry.commandType) {
    case 'AddAbstractTokenCommand':
    case 'AddDeployedTokenCommand':
      return Object.keys(asRecord(command.record))
    case 'UpdateAbstractTokenCommand':
    case 'UpdateDeployedTokenCommand':
      return Object.keys(asRecord(command.update))
    case 'DeleteAbstractTokenCommand':
    case 'DeleteDeployedTokenCommand':
      return ['deleted']
    default:
      return []
  }
}

function getTokenInfo(
  entry: HistoryEntry,
  abstractSymbols: Map<string, string>,
): TokenInfo {
  const command = asRecord(entry.command)
  switch (entry.commandType) {
    case 'AddDeployedTokenCommand':
      return deployedInfo(asRecord(command.record), undefined, abstractSymbols)
    case 'UpdateDeployedTokenCommand':
      return deployedInfo(
        asRecord(command.existing),
        asRecord(command.update),
        abstractSymbols,
        asRecord(command.pk),
      )
    case 'DeleteDeployedTokenCommand':
      return deployedInfo(
        asRecord(command.existing),
        undefined,
        abstractSymbols,
      )
    case 'AddAbstractTokenCommand':
      return abstractInfo(asRecord(command.record))
    case 'UpdateAbstractTokenCommand':
      return abstractInfo(
        asRecord(command.existing),
        asRecord(command.update),
        {
          id: command.id,
        },
      )
    case 'DeleteAbstractTokenCommand':
      return abstractInfo(asRecord(command.existing), undefined, {
        id: command.id,
      })
    default:
      return { primary: '?' }
  }
}

function deployedInfo(
  record: Record<string, unknown>,
  update: Record<string, unknown> | undefined,
  abstractSymbols: Map<string, string>,
  pk: Record<string, unknown> = {},
): TokenInfo {
  const symbol =
    stringValue(update?.symbol) ?? stringValue(record.symbol) ?? '?'
  const chain = stringValue(pk.chain) ?? stringValue(record.chain) ?? '?'
  const address = stringValue(pk.address) ?? stringValue(record.address) ?? '?'
  const abstractTokenId = updatedValue(update, record, 'abstractTokenId')
  const abstractToken = abstractTokenRef(abstractTokenId, abstractSymbols)

  return {
    primary: `${symbol} ${shortAddress(address)}`,
    secondary: [chain, abstractToken && `abstract ${abstractToken}`]
      .filter(Boolean)
      .join(' | '),
  }
}

function abstractInfo(
  record: Record<string, unknown>,
  update?: Record<string, unknown>,
  fallback: Record<string, unknown> = {},
): TokenInfo {
  const id = stringValue(record.id) ?? stringValue(fallback.id) ?? '?'
  const symbol =
    stringValue(update?.symbol) ?? stringValue(record.symbol) ?? '?'
  return { primary: `${id}:${symbol}` }
}

function updatedValue(
  update: Record<string, unknown> | undefined,
  record: Record<string, unknown>,
  key: string,
) {
  if (update && Object.hasOwn(update, key)) {
    return update[key]
  }
  return record[key]
}

function abstractTokenRef(id: unknown, abstractSymbols: Map<string, string>) {
  if (id === null) return undefined
  const value = stringValue(id)
  if (!value) return undefined
  return `${value}:${abstractSymbols.get(value) ?? '?'}`
}

function shortAddress(address: string) {
  if (address === '?') return '?'
  return formatAddress(address)
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

function stringValue(value: unknown) {
  return typeof value === 'string' && value.length > 0 ? value : undefined
}

function formatTimestamp(timestamp: number) {
  return `${UnixTime.toDate(timestamp).toISOString().slice(0, 19).replace('T', ' ')} UTC`
}

function formatSource(entry: HistoryEntry) {
  return entry.userEmail ? `${entry.source} (${entry.userEmail})` : entry.source
}

function formatHistoryRange(page: number, totalCount: number) {
  if (totalCount === 0) {
    return '0 entries'
  }

  const start = (page - 1) * PAGE_SIZE + 1
  const end = Math.min(page * PAGE_SIZE, totalCount)
  return `Showing ${start}-${end} of ${totalCount} entries`
}
