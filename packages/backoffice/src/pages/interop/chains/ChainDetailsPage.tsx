import { ChevronLeftIcon, RefreshCwIcon } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Badge } from '~/components/core/Badge'
import { Button } from '~/components/core/Button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '~/components/core/Card'
import { ErrorState } from '~/components/ErrorState'
import { LoadingState } from '~/components/LoadingState'
import { TablePageSummaryCard } from '~/components/table/TablePageSummaryCard'
import { AppLayout } from '~/layouts/AppLayout'
import type {
  TransferPairRow,
  TransferStatsRow,
} from '~/pages/interop/transfers/types'
import {
  decodeRouteParam,
  formatDollars,
} from '~/pages/interop/transfers/utils'
import { api } from '~/react-query/trpc'
import type { ChainSummaryRow } from './types'

type Direction = 'outgoing' | 'incoming'

type PathRow = {
  counterpartyId: string
  counterpartyLabel: string
  transfersCount: number
  volumeUsd: number
  transferTypesCount: number
}

export function ChainDetailsPage() {
  const params = useParams<{ id: string }>()
  const chainId = decodeRouteParam(params.id)
  const hasValidRoute = chainId !== undefined

  const {
    data: summaryData,
    error: summaryError,
    isError: isSummaryError,
    isLoading: isSummaryLoading,
    isFetching: isSummaryFetching,
    refetch: refetchSummary,
  } = api.interop.chains.summary.useQuery(undefined, {
    enabled: hasValidRoute,
  })
  const {
    data: transferStatsData,
    error: transferStatsError,
    isError: isTransferStatsError,
    isLoading: isTransferStatsLoading,
    isFetching: isTransferStatsFetching,
    refetch: refetchTransferStats,
  } = api.interop.transfers.stats.useQuery(undefined, {
    enabled: hasValidRoute,
  })

  const chainRows = summaryData?.rows ?? []
  const chainById = new Map(chainRows.map((row) => [row.id, row]))
  const selectedChain = chainId ? chainById.get(chainId) : undefined
  const hasKnownChain = selectedChain !== undefined

  const transferStats = transferStatsData ?? []
  const outgoingPaths =
    chainId && hasKnownChain
      ? buildPathRows(transferStats, selectedChain.id, 'outgoing', chainById)
      : []
  const incomingPaths =
    chainId && hasKnownChain
      ? buildPathRows(transferStats, selectedChain.id, 'incoming', chainById)
      : []

  const refetchAll = async () => {
    await Promise.all([refetchSummary(), refetchTransferStats()])
  }

  return (
    <AppLayout>
      <div className="flex flex-col gap-3">
        <TablePageSummaryCard
          title={
            selectedChain
              ? `${selectedChain.name} - chain detail`
              : 'Chain detail'
          }
          description="Chain-level capture and one-sided status with outgoing and incoming path breakdown."
          actions={
            <>
              <Button asChild variant="outline" size="sm">
                <Link to="/interop/chains">
                  <ChevronLeftIcon />
                  Back to chain summary
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => void refetchAll()}
                disabled={
                  !hasValidRoute || isSummaryFetching || isTransferStatsFetching
                }
              >
                <RefreshCwIcon
                  className={
                    isSummaryFetching || isTransferStatsFetching
                      ? 'animate-spin'
                      : ''
                  }
                />
                Refresh
              </Button>
            </>
          }
          summary={
            selectedChain ? (
              <>
                <Badge variant="secondary">{selectedChain.name}</Badge>
                <StatusBadge
                  label="Captured"
                  active={selectedChain.isCaptureChain}
                />
                <StatusBadge
                  label="One-sided"
                  active={selectedChain.isOneSided}
                  warning
                />
                <Badge variant="secondary">
                  {formatDollars(selectedChain.outgoingValueUsd)} outgoing
                </Badge>
                <Badge variant="secondary">
                  {formatDollars(selectedChain.incomingValueUsd)} incoming
                </Badge>
              </>
            ) : null
          }
        />

        {!hasValidRoute ? (
          <Card className="gap-0 py-0">
            <CardContent className="px-0">
              <ErrorState
                className="m-6"
                cause="Invalid route. Expected /interop/chains/:id."
              />
            </CardContent>
          </Card>
        ) : null}

        {hasValidRoute && (isSummaryLoading || isTransferStatsLoading) ? (
          <Card className="gap-0 py-0">
            <CardContent className="px-0">
              <LoadingState className="m-6" />
            </CardContent>
          </Card>
        ) : null}

        {hasValidRoute && (isSummaryError || isTransferStatsError) ? (
          <Card className="gap-0 py-0">
            <CardContent className="px-0">
              <ErrorState
                className="m-6"
                cause={summaryError?.message ?? transferStatsError?.message}
              />
            </CardContent>
          </Card>
        ) : null}

        {hasValidRoute &&
        !isSummaryLoading &&
        !isTransferStatsLoading &&
        !isSummaryError &&
        !isTransferStatsError &&
        !hasKnownChain ? (
          <Card className="gap-0 py-0">
            <CardContent className="px-0">
              <ErrorState
                className="m-6"
                cause={`Chain "${chainId}" was not found in the current summary dataset.`}
              />
            </CardContent>
          </Card>
        ) : null}

        {selectedChain ? (
          <>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              <MetricCard
                label="Outgoing"
                count={selectedChain.outgoingTransfersCount}
                volumeUsd={selectedChain.outgoingValueUsd}
              />
              <MetricCard
                label="Incoming"
                count={selectedChain.incomingTransfersCount}
                volumeUsd={selectedChain.incomingValueUsd}
              />
              <MetricCard
                label="Observed total"
                count={selectedChain.totalTransfersCount}
                volumeUsd={selectedChain.totalValueUsd}
              />
            </div>

            <div className="grid gap-3 xl:grid-cols-2">
              <PathBreakdownCard direction="outgoing" rows={outgoingPaths} />
              <PathBreakdownCard direction="incoming" rows={incomingPaths} />
            </div>
          </>
        ) : null}
      </div>
    </AppLayout>
  )
}

function buildPathRows(
  transferStats: TransferStatsRow[],
  chainId: string,
  direction: Direction,
  chainById: Map<string, ChainSummaryRow>,
): PathRow[] {
  const byCounterparty = new Map<
    string,
    PathRow & { transferTypes: Set<string> }
  >()

  for (const stat of transferStats) {
    for (const pair of stat.chains) {
      const match = getPathMatch(pair, chainId, direction)
      if (!match) continue

      const current = byCounterparty.get(match.counterpartyId)
      if (current) {
        current.transfersCount += pair.count
        current.volumeUsd += match.volumeUsd
        current.transferTypes.add(stat.type)
      } else {
        byCounterparty.set(match.counterpartyId, {
          counterpartyId: match.counterpartyId,
          counterpartyLabel:
            chainById.get(match.counterpartyId)?.name ?? match.counterpartyId,
          transfersCount: pair.count,
          volumeUsd: match.volumeUsd,
          transferTypes: new Set([stat.type]),
          transferTypesCount: 1,
        })
      }
    }
  }

  const rows = [...byCounterparty.values()]
    .map((row) => ({
      counterpartyId: row.counterpartyId,
      counterpartyLabel: row.counterpartyLabel,
      transfersCount: row.transfersCount,
      volumeUsd: row.volumeUsd,
      transferTypesCount: row.transferTypes.size,
    }))
    .sort((a, b) => {
      if (a.volumeUsd !== b.volumeUsd) {
        return b.volumeUsd - a.volumeUsd
      }
      return a.counterpartyId.localeCompare(b.counterpartyId, 'en', {
        sensitivity: 'base',
      })
    })

  return rows
}

function getPathMatch(
  pair: TransferPairRow,
  chainId: string,
  direction: Direction,
): { counterpartyId: string; volumeUsd: number } | undefined {
  if (direction === 'outgoing' && pair.srcChain === chainId) {
    return {
      counterpartyId: pair.dstChain,
      volumeUsd: pair.srcValueSum,
    }
  }

  if (direction === 'incoming' && pair.dstChain === chainId) {
    return {
      counterpartyId: pair.srcChain,
      volumeUsd: pair.dstValueSum,
    }
  }

  return undefined
}

function MetricCard({
  label,
  count,
  volumeUsd,
}: {
  label: string
  count: number
  volumeUsd: number
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{label}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        <div className="font-medium text-lg">{formatDollars(volumeUsd)}</div>
        <div className="text-muted-foreground text-sm">{count} transfers</div>
      </CardContent>
    </Card>
  )
}

function PathBreakdownCard({
  direction,
  rows,
}: {
  direction: Direction
  rows: PathRow[]
}) {
  const totalPathTransfersCount = rows.reduce(
    (sum, row) => sum + row.transfersCount,
    0,
  )
  const totalPathVolumeUsd = rows.reduce((sum, row) => sum + row.volumeUsd, 0)
  const chartRows = rows.slice(0, 8).map((row) => ({
    ...row,
    label: row.counterpartyLabel,
  }))

  return (
    <Card className="gap-4">
      <CardHeader className="space-y-1">
        <CardTitle>
          {direction === 'outgoing' ? 'Outgoing paths' : 'Incoming paths'}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="secondary">{rows.length} counterparties</Badge>
          <Badge variant="secondary">
            {formatDollars(totalPathVolumeUsd)} path volume
          </Badge>
          <Badge variant="secondary">
            {totalPathTransfersCount} path transfers
          </Badge>
        </div>

        <div className="h-72">
          {chartRows.length === 0 ? (
            <div className="flex h-full items-center justify-center rounded-lg border border-dashed text-muted-foreground text-sm">
              No detailed paths found for this direction.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartRows}
                layout="vertical"
                margin={{ top: 8, right: 16, bottom: 8, left: 16 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  tickFormatter={(value) => formatCompactDollars(Number(value))}
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={96}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip content={<PathTooltip />} />
                <Bar
                  dataKey="volumeUsd"
                  fill={
                    direction === 'outgoing'
                      ? 'rgb(37 99 235)'
                      : 'rgb(5 150 105)'
                  }
                  radius={[0, 4, 4, 0]}
                  isAnimationActive={false}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="space-y-2">
          {rows.map((row) => (
            <div
              key={`${direction}-${row.counterpartyId}`}
              className="flex items-start justify-between gap-4 rounded border px-3 py-2"
            >
              <div className="min-w-0">
                <div className="font-medium text-sm">
                  {row.counterpartyLabel}
                </div>
              </div>
              <div className="shrink-0 text-right text-sm">
                <div>{formatDollars(row.volumeUsd)}</div>
                <div className="text-muted-foreground text-xs">
                  {row.transfersCount} transfers • {row.transferTypesCount}{' '}
                  types
                </div>
              </div>
            </div>
          ))}
          {totalPathVolumeUsd > 0 ? (
            <div className="text-muted-foreground text-xs">
              Total {direction} path volume shown here:{' '}
              {formatDollars(totalPathVolumeUsd)}
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}

function PathTooltip(props: {
  active?: boolean
  payload?: Array<{ payload: PathRow }>
}) {
  const row = props.payload?.[0]?.payload
  if (!props.active || !row) return null

  return (
    <div className="rounded-lg border bg-background p-3 shadow-sm">
      <p className="font-medium text-sm">{row.counterpartyLabel}</p>
      <p className="mt-1 text-muted-foreground text-xs">
        {formatDollars(row.volumeUsd)} • {row.transfersCount} transfers
      </p>
      <p className="mt-1 text-muted-foreground text-xs">
        {row.transferTypesCount} transfer types
      </p>
    </div>
  )
}

function formatCompactDollars(value: number): string {
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`
  return `$${Math.round(value)}`
}

function StatusBadge({
  label,
  active,
  warning = false,
}: {
  label: string
  active: boolean
  warning?: boolean
}) {
  return (
    <Badge
      variant="outline"
      className={
        active
          ? warning
            ? 'border-amber-200 bg-amber-50 text-amber-700'
            : 'border-emerald-200 bg-emerald-50 text-emerald-700'
          : 'border-slate-200 text-slate-600'
      }
    >
      {label}: {active ? 'yes' : 'no'}
    </Badge>
  )
}
