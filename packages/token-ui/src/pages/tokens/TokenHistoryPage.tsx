import { formatAddress, UnixTime } from '@l2beat/shared-pure'
import type { RouterOutputs } from '@l2beat/token-backend'
import { useQuery } from '@tanstack/react-query'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  HistoryIcon,
  SearchIcon,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
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
import { Input } from '~/components/core/Input'
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
import { Diff, ObjectDiff } from '~/components/Diff'
import { IngestionLog } from '~/components/IngestionLog'
import { LoadingState } from '~/components/LoadingState'
import { useDebouncedValue } from '~/hooks/useDebouncedValue'
import { AppLayout } from '~/layouts/AppLayout'
import { useTRPC } from '~/react-query/trpc'
import { diff } from '~/utils/getDiff'

const PAGE_SIZE = 100
const FIELD_LIMIT = 4

type HistoryEntry =
  RouterOutputs['tokenDbHistory']['getPage']['entries'][number]

interface TokenInfo {
  primary: ReactNode
  secondary?: ReactNode
  iconUrl?: string
}

interface AbstractTokenInfo {
  symbol: string
  iconUrl: string | null
}

export function TokenHistoryPage() {
  const trpc = useTRPC()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search.trim(), 300)
  const [selectedEntry, setSelectedEntry] = useState<HistoryEntry>()
  const { data: historyPage, isLoading } = useQuery(
    trpc.tokenDbHistory.getPage.queryOptions(
      {
        page,
        pageSize: PAGE_SIZE,
        search: debouncedSearch || undefined,
      },
      {
        refetchInterval: 10_000,
        refetchOnMount: 'always',
        staleTime: 0,
      },
    ),
  )
  const { data: abstractTokens } = useQuery(
    trpc.abstractTokens.getAll.queryOptions(undefined, {
      refetchInterval: 10_000,
      refetchOnMount: 'always',
      staleTime: 0,
    }),
  )
  const abstractTokensById = useMemo(
    () =>
      new Map(
        abstractTokens?.map((token) => [
          token.id,
          { symbol: token.symbol, iconUrl: token.iconUrl },
        ]),
      ),
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
          <CardAction>
            <div className="flex flex-col items-end gap-2">
              <div className="relative w-64">
                <SearchIcon className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-2.5 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search by token data..."
                  className="h-8 pl-8"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setPage(1)
                  }}
                />
              </div>
              {historyPage && totalCount > PAGE_SIZE && (
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
              )}
            </div>
          </CardAction>
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
                <EmptyTitle>
                  {debouncedSearch
                    ? 'No entries match your search'
                    : 'No history entries'}
                </EmptyTitle>
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
                  const token = getTokenInfo(entry, abstractTokensById)

                  return (
                    <TableRow key={entry.id}>
                      <TableCell>
                        <Badge variant="outline">{entry.commandType}</Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap font-mono text-xs">
                        {formatTimestamp(entry.timestamp)}
                      </TableCell>
                      <TableCell className="max-w-[360px] whitespace-normal break-words">
                        <div className="flex items-center gap-2">
                          {token.iconUrl && (
                            <img
                              src={token.iconUrl}
                              alt=""
                              width={24}
                              height={24}
                              className="shrink-0 rounded-full"
                            />
                          )}
                          <div>
                            <div>{token.primary}</div>
                            {token.secondary && (
                              <div className="text-muted-foreground text-xs">
                                {token.secondary}
                              </div>
                            )}
                          </div>
                        </div>
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
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 pb-4">
              <CommandDiff entry={entry} />
              {entry.intent !== null && <IntentDetails intent={entry.intent} />}
              {entry.ingestionLog && <IngestionLog log={entry.ingestionLog} />}
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
      {entry.intent !== null && <Badge variant="outline">intent</Badge>}
      {entry.userEmail && (
        <div className="text-muted-foreground text-xs">{entry.userEmail}</div>
      )}
    </div>
  )
}

function IntentDetails({ intent }: { intent: unknown }) {
  return (
    <div className="space-y-2 rounded-md border p-3">
      <div className="font-medium text-sm">Intent</div>
      <pre className="overflow-x-auto rounded bg-muted p-2 text-xs">
        {JSON.stringify(intent, null, 2)}
      </pre>
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
  switch (entry.commandType) {
    case 'AddAbstractTokenCommand':
    case 'AddDeployedTokenCommand':
      return []
    case 'UpdateAbstractTokenCommand':
    case 'UpdateDeployedTokenCommand':
      return Array.from(
        new Set(
          (getCommandDifferences(entry) ?? []).map((difference) =>
            String(difference.path[0] ?? '?'),
          ),
        ),
      )
    case 'DeleteAbstractTokenCommand':
    case 'DeleteDeployedTokenCommand':
      return ['deleted']
    default:
      return []
  }
}

function getTokenInfo(
  entry: HistoryEntry,
  abstractTokensById: Map<string, AbstractTokenInfo>,
): TokenInfo {
  const command = asRecord(entry.command)
  switch (entry.commandType) {
    case 'AddDeployedTokenCommand':
      return deployedInfo(
        asRecord(command.record),
        undefined,
        abstractTokensById,
      )
    case 'UpdateDeployedTokenCommand':
      return deployedInfo(
        asRecord(command.existing),
        asRecord(command.update),
        abstractTokensById,
        asRecord(command.pk),
      )
    case 'DeleteDeployedTokenCommand':
      return deployedInfo(
        asRecord(command.existing),
        undefined,
        abstractTokensById,
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
  abstractTokensById: Map<string, AbstractTokenInfo>,
  pk: Record<string, unknown> = {},
): TokenInfo {
  const symbol =
    stringValue(update?.symbol) ?? stringValue(record.symbol) ?? '?'
  const chain = stringValue(pk.chain) ?? stringValue(record.chain) ?? '?'
  const address = stringValue(pk.address) ?? stringValue(record.address) ?? '?'
  const abstractTokenId = updatedValue(update, record, 'abstractTokenId')
  const abstractToken = abstractTokenRef(abstractTokenId, abstractTokensById)
  const abstractTokenIdValue = stringValue(abstractTokenId)
  const abstractTokenInfo = abstractTokenIdValue
    ? abstractTokensById.get(abstractTokenIdValue)
    : undefined

  return {
    iconUrl: abstractTokenInfo?.iconUrl ?? undefined,
    primary: (
      <>
        {symbol}{' '}
        <TokenLink
          to={`/tokens/${chain}/${address}`}
          label={shortAddress(address)}
        />
      </>
    ),
    secondary: [chain, abstractToken]
      .filter(Boolean)
      .reduce<ReactNode[]>((nodes, item, index) => {
        if (index > 0) nodes.push(' | ')
        nodes.push(item)
        return nodes
      }, []),
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
  const iconUrl = stringValue(updatedValue(update, record, 'iconUrl'))
  return {
    iconUrl,
    primary: <TokenLink to={`/tokens/${id}`} label={`${id}:${symbol}`} />,
  }
}

function TokenLink({ to, label }: { to: string; label: string }) {
  if (label.includes('?') || to.includes('?')) {
    return <>{label}</>
  }

  return (
    <Link to={to} className="underline underline-offset-2">
      {label}
    </Link>
  )
}

function CommandDiff({ entry }: { entry: HistoryEntry }) {
  const differences = getCommandDifferences(entry)
  if (differences) {
    return <Diff differences={differences} maxDepth={4} />
  }

  return <ObjectDiff left={{}} right={entry.command} maxDepth={4} />
}

function getCommandDifferences(entry: HistoryEntry) {
  const command = asRecord(entry.command)
  switch (entry.commandType) {
    case 'UpdateAbstractTokenCommand':
    case 'UpdateDeployedTokenCommand':
      return diff(asRecord(command.existing), {
        ...asRecord(command.existing),
        ...asRecord(command.update),
      })
    default:
      return undefined
  }
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

function abstractTokenRef(
  id: unknown,
  abstractTokensById: Map<string, AbstractTokenInfo>,
) {
  if (id === null) return undefined
  const value = stringValue(id)
  if (!value) return undefined
  const abstractToken = abstractTokensById.get(value)
  return (
    <TokenLink
      to={`/tokens/${value}`}
      label={`${value}:${abstractToken?.symbol ?? '?'}`}
    />
  )
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
