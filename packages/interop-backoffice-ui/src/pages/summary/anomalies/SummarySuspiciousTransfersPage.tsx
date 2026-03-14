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
import { SuspiciousTransfersTable } from '../table/anomalies/SuspiciousTransfersTable'
import type { SummaryChainMetadata } from '../table/types'

export function SummarySuspiciousTransfersPage() {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch: refetchAnomalies,
    isFetching: isAnomaliesFetching,
  } = api.summary.anomalies.useQuery()
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
    await Promise.all([refetchAnomalies(), refetchChains()])
  }

  const anomaliesData = data ?? null
  const hasData = anomaliesData !== null
  const rows = anomaliesData?.suspiciousTransfers ?? []

  return (
    <AppLayout className="min-h-screen">
      <div className="flex flex-col gap-4 p-4">
        <SummarySubnav />

        <Card className="gap-4">
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle>Suspicious transfers</CardTitle>
              <CardDescription>
                Raw transfers with high source/destination USD mismatch.
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void refetch()}
              disabled={isAnomaliesFetching || isChainsFetching}
            >
              <RefreshCwIcon
                className={
                  isAnomaliesFetching || isChainsFetching ? 'animate-spin' : ''
                }
              />
              Refresh
            </Button>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Badge variant={rows.length > 0 ? 'destructive' : 'secondary'}>
              {rows.length} suspicious transfers
            </Badge>
            {hasData ? (
              <Badge variant="secondary">
                Diff threshold:{' '}
                {anomaliesData.valueDiffThresholdPercent.toFixed(2)}%
              </Badge>
            ) : null}
            {hasData ? (
              <Badge variant="secondary">
                Min side value: ${anomaliesData.minimumSideValueUsdThreshold}
              </Badge>
            ) : null}
          </CardContent>
        </Card>

        {isLoading ? <LoadingState className="m-6" /> : null}
        {isError ? (
          <div className="px-2 text-destructive text-sm">
            Failed to load suspicious transfers: {error.message}
          </div>
        ) : null}
        {isChainsError ? (
          <div className="px-2 text-destructive text-sm">
            Failed to load chain metadata ({chainsError.message}). Tx hashes are
            shown without explorer links.
          </div>
        ) : null}

        {!isLoading && !isError && hasData ? (
          <Card className="gap-0 py-0">
            <CardContent className="px-0">
              <SuspiciousTransfersTable
                data={rows}
                valueDiffThresholdPercent={
                  anomaliesData.valueDiffThresholdPercent
                }
                getExplorerUrl={getExplorerUrl}
                enableCsvExport
              />
            </CardContent>
          </Card>
        ) : null}
      </div>
    </AppLayout>
  )
}
