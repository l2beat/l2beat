import { RefreshCwIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
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
import { InternalLink } from '~/components/InternalLink'
import { LoadingState } from '~/components/LoadingState'
import { TablePageSummaryCard } from '~/components/table/TablePageSummaryCard'
import { AppLayout } from '~/layouts/AppLayout'
import { formatDollars } from '~/pages/interop/transfers/utils'
import { api } from '~/react-query/trpc'
import type { ChainSummaryResponse, ChainSummaryRow } from './types'

export function ChainsPage() {
  const { data, error, isError, isLoading, isFetching, refetch } =
    api.interop.chains.summary.useQuery()

  const response: ChainSummaryResponse | undefined = data
  const rows: ChainSummaryRow[] = response?.rows ?? []
  const captureEnabled = response?.captureEnabled ?? true
  const activeChainsCount = rows.filter(
    (row) => row.totalTransfersCount > 0,
  ).length
  const captureChainsCount = rows.filter((row) => row.isCaptureChain).length
  const oneSidedChainsCount = rows.filter((row) => row.isOneSided).length
  const unknownChainsCount = rows.filter((row) => !row.isKnownChain).length
  const totalOutgoingVolume = rows.reduce(
    (sum, row) => sum + row.outgoingValueUsd,
    0,
  )
  const totalIncomingVolume = rows.reduce(
    (sum, row) => sum + row.incomingValueUsd,
    0,
  )

  return (
    <AppLayout>
      <div className="flex flex-col gap-3">
        <TablePageSummaryCard
          title="Chain summary"
          description={
            <>
              Per-chain capture flags, one-sided flags and observed transfer
              volume. Use{' '}
              <Link className="underline" to="/interop">
                configuration
              </Link>{' '}
              for the underlying policy.
            </>
          }
          actions={
            <Button
              variant="outline"
              size="sm"
              onClick={() => void refetch()}
              disabled={isFetching}
            >
              <RefreshCwIcon className={isFetching ? 'animate-spin' : ''} />
              Refresh
            </Button>
          }
          summary={
            <>
              <Badge variant={captureEnabled ? 'secondary' : 'destructive'}>
                Capture {captureEnabled ? 'enabled' : 'disabled'}
              </Badge>
              <Badge variant="secondary">{rows.length} chains</Badge>
              <Badge variant="secondary">
                {activeChainsCount} active chains
              </Badge>
              <Badge variant="secondary">{captureChainsCount} captured</Badge>
              <Badge variant="secondary">{oneSidedChainsCount} one-sided</Badge>
              <Badge variant="secondary">
                {formatDollars(totalOutgoingVolume)} outgoing
              </Badge>
              <Badge variant="secondary">
                {formatDollars(totalIncomingVolume)} incoming
              </Badge>
              {unknownChainsCount > 0 ? (
                <Badge variant="destructive">
                  {unknownChainsCount} unknown chain ids observed
                </Badge>
              ) : null}
            </>
          }
        />

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

        {!isLoading && !isError ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {rows.map((row) => (
              <ChainCard key={row.id} row={row} />
            ))}
          </div>
        ) : null}
      </div>
    </AppLayout>
  )
}

function ChainCard({ row }: { row: ChainSummaryRow }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <InternalLink to={`/interop/chains/${encodeURIComponent(row.id)}`}>
            {row.name}
          </InternalLink>
        </CardTitle>
        <CardDescription className="font-mono">
          {row.id} · {row.display}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-1.5">
          <StatusBadge label="Known" active={row.isKnownChain} />
          <StatusBadge label="Captured" active={row.isCaptureChain} />
          <StatusBadge label="One-sided" active={row.isOneSided} warning />
        </div>
        <MetricRow
          label="Outgoing"
          count={row.outgoingTransfersCount}
          volume={row.outgoingValueUsd}
        />
        <MetricRow
          label="Incoming"
          count={row.incomingTransfersCount}
          volume={row.incomingValueUsd}
        />
        <div className="rounded border bg-muted/20 px-3 py-2">
          <div className="text-muted-foreground text-xs uppercase tracking-wide">
            Observed total
          </div>
          <div className="font-medium text-sm">
            {formatDollars(row.totalValueUsd)}
          </div>
          <div className="text-muted-foreground text-xs">
            {row.totalTransfersCount} transfers
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function MetricRow({
  label,
  count,
  volume,
}: {
  label: string
  count: number
  volume: number
}) {
  return (
    <div className="rounded border px-3 py-2">
      <div className="text-muted-foreground text-xs uppercase tracking-wide">
        {label}
      </div>
      <div className="font-medium text-sm">{formatDollars(volume)}</div>
      <div className="text-muted-foreground text-xs">{count} transfers</div>
    </div>
  )
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
