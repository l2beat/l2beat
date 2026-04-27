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
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '~/components/core/Empty'
import { ErrorState } from '~/components/ErrorState'
import { LoadingState } from '~/components/LoadingState'
import { AppLayout } from '~/layouts/AppLayout'
import { formatDollars, formatTransferTimestamp } from '~/pages/transfers/utils'
import { api } from '~/react-query/trpc'
import { DurationSplitCoverageTable } from './table/DurationSplitCoverageTable'
import { NotIncludedByPluginTable } from './table/NotIncludedByPluginTable'
import { NotIncludedTransfersTable } from './table/NotIncludedTransfersTable'
import type { AggregatesResponse, ChainMetadata } from './types'

export function AggregatesPage() {
  const {
    data: aggregatesData,
    error: aggregatesError,
    isError: isAggregatesError,
    isLoading: isAggregatesLoading,
    isFetching: isAggregatesFetching,
    refetch: refetchAggregates,
  } = api.aggregates.latest.useQuery()

  const {
    data: chainsData,
    error: chainsError,
    isError: isChainsError,
    isFetching: isChainsFetching,
    refetch: refetchChains,
  } = api.chains.metadata.useQuery()

  const response: AggregatesResponse | undefined = aggregatesData
  const chains: ChainMetadata[] = chainsData ?? []
  const explorerUrlsByChain = new Map(
    chains.flatMap((chain) =>
      chain.explorerUrl ? [[chain.id, chain.explorerUrl] as const] : [],
    ),
  )

  const latestTimestamp = response?.latestTimestamp ?? null
  const aggregationConfigured = response?.aggregationConfigured ?? true
  const aggregationConfigsCount = response?.aggregationConfigsCount ?? 0
  const latestTransfersCount = response?.latestTransfersCount ?? 0
  const includedTransfersCount = response?.includedTransfersCount ?? 0
  const notIncludedTransfers = response?.notIncludedTransfers ?? []
  const notIncludedByPlugin = response?.notIncludedByPlugin ?? []
  const durationSplitCoverage = response?.durationSplitCoverage ?? []

  const pluginsWithGapsCount = new Set(
    notIncludedByPlugin.map((row) => row.plugin),
  ).size
  const totalNotIncludedValueUsd = notIncludedByPlugin.reduce(
    (sum, row) => sum + row.totalValueUsd,
    0,
  )
  const durationSplitGapCount = durationSplitCoverage.reduce(
    (sum, row) => sum + row.notIncludedTransferTypes.length,
    0,
  )
  const coverageProtocolsCount = new Set(
    durationSplitCoverage.map((row) => row.projectId),
  ).size

  const refetchAll = async () => {
    await Promise.all([refetchAggregates(), refetchChains()])
  }

  return (
    <AppLayout className="min-h-screen">
      <div className="flex flex-col gap-4 p-4">
        <Card className="gap-4">
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle>Aggregates</CardTitle>
              <CardDescription>
                Legacy aggregate coverage diagnostics for the latest daily
                snapshot. One-sided transfers with unknown bridge type bypass
                plugin bridge type matching.
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void refetchAll()}
              disabled={isAggregatesFetching || isChainsFetching}
            >
              <RefreshCwIcon
                className={
                  isAggregatesFetching || isChainsFetching ? 'animate-spin' : ''
                }
              />
              Refresh
            </Button>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {isAggregatesLoading ? (
              <Badge variant="secondary">
                Loading latest aggregate snapshot
              </Badge>
            ) : null}

            {isAggregatesError ? (
              <Badge variant="destructive">Failed to load aggregates</Badge>
            ) : null}

            {!isAggregatesLoading &&
            !isAggregatesError &&
            !aggregationConfigured ? (
              <Badge variant="destructive">
                Aggregation configs disabled in backend
              </Badge>
            ) : null}

            {!isAggregatesLoading &&
            !isAggregatesError &&
            aggregationConfigured &&
            latestTimestamp === null ? (
              <Badge variant="secondary">No aggregate snapshot available</Badge>
            ) : null}

            {!isAggregatesLoading &&
            !isAggregatesError &&
            aggregationConfigured &&
            latestTimestamp !== null ? (
              <>
                <Badge variant="secondary">
                  {aggregationConfigsCount} aggregate configs loaded
                </Badge>
                <Badge variant="secondary">
                  Window end: {formatTransferTimestamp(latestTimestamp)} UTC
                </Badge>
                <Badge variant="secondary">
                  {latestTransfersCount} latest-window transfers
                </Badge>
                <Badge variant="secondary">
                  {includedTransfersCount} included in aggregates
                </Badge>
                <Badge variant="secondary">
                  {notIncludedTransfers.length} not included
                </Badge>
                <Badge variant="secondary">
                  {pluginsWithGapsCount} plugins with gaps
                </Badge>
                <Badge variant="secondary">
                  {formatDollars(totalNotIncludedValueUsd)} uncovered value
                </Badge>
                <Badge variant="secondary">
                  {coverageProtocolsCount} protocols with duration splits
                </Badge>
                <Badge variant="secondary">
                  {durationSplitGapCount} duration split gaps
                </Badge>
              </>
            ) : null}
          </CardContent>
        </Card>

        {isAggregatesLoading ? (
          <Card className="gap-0 py-0">
            <CardContent className="px-0">
              <LoadingState className="m-6" />
            </CardContent>
          </Card>
        ) : null}

        {isAggregatesError ? (
          <Card className="gap-0 py-0">
            <CardContent className="px-0">
              <ErrorState className="m-6" cause={aggregatesError.message} />
            </CardContent>
          </Card>
        ) : null}

        {isChainsError && !isAggregatesLoading && !isAggregatesError ? (
          <div className="px-2 text-destructive text-sm">
            Failed to load chain metadata ({chainsError.message}). Tx hashes are
            shown without explorer links.
          </div>
        ) : null}

        {!isAggregatesLoading &&
        !isAggregatesError &&
        !aggregationConfigured ? (
          <Card>
            <CardContent className="p-6">
              <Empty className="border">
                <EmptyHeader>
                  <EmptyTitle>Aggregation disabled</EmptyTitle>
                  <EmptyDescription>
                    The backend is running without the `interop.aggregation`
                    feature flag, so this page cannot determine which transfers
                    are covered by aggregate configs.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            </CardContent>
          </Card>
        ) : null}

        {!isAggregatesLoading &&
        !isAggregatesError &&
        aggregationConfigured &&
        latestTimestamp === null ? (
          <Card>
            <CardContent className="p-6">
              <Empty className="border">
                <EmptyHeader>
                  <EmptyTitle>No aggregate snapshot</EmptyTitle>
                  <EmptyDescription>
                    Aggregated transfer history has not been generated yet.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            </CardContent>
          </Card>
        ) : null}

        {!isAggregatesLoading &&
        !isAggregatesError &&
        aggregationConfigured &&
        latestTimestamp !== null ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle>
                  Not included in latest aggregates by plugin
                </CardTitle>
                <CardDescription>
                  Latest-window transfers grouped by plugin and bridge type when
                  they are not covered by aggregate configs. One-sided transfers
                  with unknown observed bridge type are treated as covered even
                  if the plugin config expects a concrete bridge type.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-0">
                <NotIncludedByPluginTable
                  data={notIncludedByPlugin}
                  enableCsvExport
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Not included in latest aggregates</CardTitle>
                <CardDescription>
                  Raw transfer rows from the latest aggregate window that were
                  not matched by any aggregate config after one-sided transfers
                  with unknown bridge type bypass plugin bridge type matching.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-0">
                <NotIncludedTransfersTable
                  data={notIncludedTransfers}
                  getExplorerUrl={(chain) => explorerUrlsByChain.get(chain)}
                  enableCsvExport
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Transfer split coverage by protocol</CardTitle>
                <CardDescription>
                  Compares observed transfer types in the latest window against
                  configured duration split coverage.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-0">
                <DurationSplitCoverageTable
                  data={durationSplitCoverage}
                  enableCsvExport
                />
              </CardContent>
            </Card>
          </>
        ) : null}
      </div>
    </AppLayout>
  )
}
