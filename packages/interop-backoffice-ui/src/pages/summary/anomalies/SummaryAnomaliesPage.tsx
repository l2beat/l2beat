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
import { AnomaliesTable } from '../table/anomalies/AnomaliesTable'
import { SuspiciousTransfersTable } from '../table/anomalies/SuspiciousTransfersTable'
import type { SummaryChainMetadata } from '../table/types'

export function SummaryAnomaliesPage() {
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
  const hasAnomaliesData = anomaliesData !== null
  const rows = anomaliesData?.stats ?? []
  const suspiciousTransfers = anomaliesData?.suspiciousTransfers ?? []
  const highGapCount = rows.filter((row) => row.srcDstDiff.isHigh).length

  return (
    <AppLayout className="min-h-screen">
      <div className="flex flex-col gap-4 p-4">
        <SummarySubnav />

        <Card className="gap-4">
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle>Anomalies</CardTitle>
              <CardDescription>
                Aggregated transfer anomaly signals and suspicious raw
                transfers.
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
            <Badge variant="secondary">{rows.length} anomaly IDs</Badge>
            <Badge variant={highGapCount > 0 ? 'destructive' : 'secondary'}>
              {highGapCount} src/dst mismatch alerts
            </Badge>
            <Badge
              variant={
                suspiciousTransfers.length > 0 ? 'destructive' : 'secondary'
              }
            >
              {suspiciousTransfers.length} suspicious transfers
            </Badge>
          </CardContent>
        </Card>

        {isLoading ? <LoadingState className="m-6" /> : null}
        {isError ? (
          <div className="px-2 text-destructive text-sm">
            Failed to load anomalies: {error.message}
          </div>
        ) : null}
        {isChainsError ? (
          <div className="px-2 text-destructive text-sm">
            Failed to load chain metadata ({chainsError.message}). Tx hashes are
            shown without explorer links.
          </div>
        ) : null}

        {!isLoading && !isError && hasAnomaliesData ? (
          <>
            <Card className="gap-0">
              <CardHeader>
                <CardTitle>
                  Aggregated transfer anomalies (latest per ID)
                </CardTitle>
                <CardDescription>
                  Statistical signals by transfer ID with quick trend previews.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-0">
                <AnomaliesTable data={rows} enableCsvExport />
              </CardContent>
            </Card>

            <Card className="gap-0">
              <CardHeader>
                <CardTitle>
                  Suspicious raw transfers (src/dst mismatch)
                </CardTitle>
                <CardDescription>
                  Diff threshold:{' '}
                  {anomaliesData.valueDiffThresholdPercent.toFixed(2)}%, minimum
                  side value: ${anomaliesData.minimumSideValueUsdThreshold}.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-0">
                <SuspiciousTransfersTable
                  data={suspiciousTransfers}
                  valueDiffThresholdPercent={
                    anomaliesData.valueDiffThresholdPercent
                  }
                  getExplorerUrl={getExplorerUrl}
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
