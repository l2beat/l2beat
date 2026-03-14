import { RefreshCwIcon } from 'lucide-react'
import { useCallback, useMemo } from 'react'
import { Badge } from '~/components/core/Badge'
import { Button } from '~/components/core/Button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/core/Card'
import { LoadingState } from '~/components/LoadingState'
import { AppLayout } from '~/layouts/AppLayout'
import { api } from '~/react-query/trpc'
import { SummarySubnav } from '../components/SummarySubnav'
import { DurationSplitCoverageTable } from '../table/aggregates/DurationSplitCoverageTable'
import { NotIncludedByPluginTable } from '../table/aggregates/NotIncludedByPluginTable'
import { TransferDetailsTable } from '../table/transfers-details/TransferDetailsTable'
import type { SummaryChainMetadata } from '../table/types'

function formatTimestamp(timestamp: number) {
  return new Date(timestamp * 1000).toLocaleString()
}

export function SummaryAggregatesPage() {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch: refetchAggregates,
    isFetching: isAggregatesFetching,
  } = api.summary.aggregates.useQuery()

  const {
    data: chainsData,
    isError: isChainsError,
    error: chainsError,
    refetch: refetchChains,
    isFetching: isChainsFetching,
  } = api.chains.metadata.useQuery()

  const chains: SummaryChainMetadata[] = chainsData ?? []

  const explorerUrlsByChain = useMemo(() => {
    const map = new Map<string, string>()
    for (const chain of chains) {
      if (chain.explorerUrl) {
        map.set(chain.id, chain.explorerUrl)
      }
    }
    return map
  }, [chains])

  const getExplorerUrl = useCallback(
    (chain: string) => explorerUrlsByChain.get(chain),
    [explorerUrlsByChain],
  )

  const refetch = async () => {
    await Promise.all([refetchAggregates(), refetchChains()])
  }

  const aggregatesData = data ?? null
  const hasAggregatesData = aggregatesData !== null

  const windowDurationHours = hasAggregatesData
    ? (aggregatesData.toTimestamp - aggregatesData.fromTimestamp) / 3600
    : undefined

  return (
    <AppLayout className="min-h-screen">
      <div className="flex flex-col gap-4 p-4">
        <SummarySubnav />

        <Card className="gap-4">
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle>Summary: Aggregates</CardTitle>
              <CardDescription>
                Uncovered transfers and duration-split coverage for the latest
                aggregation window.
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void refetch()}
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
            <Badge variant="secondary">
              {aggregatesData?.latestTransfersCount ?? 0} latest transfers
            </Badge>
            <Badge variant="secondary">
              {aggregatesData?.unconsumedTransfers.length ?? 0} not included in
              aggregates
            </Badge>
            <Badge variant="secondary">
              {aggregatesData?.configCount ?? 0} aggregation configs
            </Badge>
            <Badge variant="secondary">
              {aggregatesData?.durationSplitCoverage.length ?? 0} duration split
              rows
            </Badge>
            {hasAggregatesData && windowDurationHours !== undefined ? (
              <Badge variant="secondary">
                {windowDurationHours}h window (
                {formatTimestamp(aggregatesData.fromTimestamp)} -{' '}
                {formatTimestamp(aggregatesData.toTimestamp)})
              </Badge>
            ) : null}
          </CardContent>
        </Card>

        {isLoading ? <LoadingState className="m-6" /> : null}
        {isError ? (
          <div className="px-2 text-destructive text-sm">
            Failed to load aggregates: {error.message}
          </div>
        ) : null}
        {isChainsError ? (
          <div className="px-2 text-destructive text-sm">
            Failed to load chain metadata ({chainsError.message}). Tx hashes are
            shown without explorer links.
          </div>
        ) : null}
        {!isLoading && !isError && !hasAggregatesData ? (
          <div className="px-2 text-muted-foreground text-sm">
            No latest aggregate timestamp found.
          </div>
        ) : null}

        {!isLoading && !isError && hasAggregatesData ? (
          <>
            <Card className="gap-0">
              <CardHeader>
                <CardTitle>
                  Not included in latest aggregates by plugins
                </CardTitle>
                <CardDescription>
                  Grouped by plugin and inferred bridge type.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-0">
                <NotIncludedByPluginTable
                  data={aggregatesData.notIncludedByPlugin}
                  enableCsvExport
                />
              </CardContent>
            </Card>

            <Card className="gap-0">
              <CardHeader>
                <CardTitle>Not included in latest aggregates</CardTitle>
                <CardDescription>
                  Detailed transfer rows missing in the current aggregates.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-0">
                <TransferDetailsTable
                  data={aggregatesData.unconsumedTransfers}
                  getExplorerUrl={getExplorerUrl}
                  enableCsvExport
                />
              </CardContent>
            </Card>

            <Card className="gap-0">
              <CardHeader>
                <CardTitle>Transfer split coverage by protocol</CardTitle>
                <CardDescription>
                  Highlights transfer types missing from duration split config.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-0">
                <DurationSplitCoverageTable
                  data={aggregatesData.durationSplitCoverage}
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
