import { RefreshCwIcon } from 'lucide-react'
import { Badge } from '~/components/core/Badge'
import { Button } from '~/components/core/Button'
import { ErrorState } from '~/components/ErrorState'
import { LoadingState } from '~/components/LoadingState'
import { TablePageLayout } from '~/components/table/TablePageLayout'
import { formatDollars } from '~/pages/interop/transfers/utils'
import { useBackendApi } from '~/react-query/trpc'
import { SuspiciousTransfersTable } from './table/SuspiciousTransfersTable'
import type {
  SuspiciousTransferRow,
  SuspiciousTransfersResponse,
} from './types'

export function SuspiciousTransfersPage() {
  const api = useBackendApi()
  const {
    data: suspiciousTransfersData,
    error: suspiciousTransfersError,
    isError: isSuspiciousTransfersError,
    isLoading: isSuspiciousTransfersLoading,
    isFetching: isSuspiciousTransfersFetching,
    refetch: refetchSuspiciousTransfers,
  } = api.interop.anomalies.suspiciousTransfers.useQuery()

  const {
    data: chainsData,
    error: chainsError,
    isError: isChainsError,
    isFetching: isChainsFetching,
    refetch: refetchChains,
  } = api.interop.chains.metadata.useQuery()

  const response: SuspiciousTransfersResponse | undefined =
    suspiciousTransfersData
  const rows: SuspiciousTransferRow[] = response?.items ?? []
  const valueDiffThresholdPercent = response?.valueDiffThresholdPercent ?? 15
  const minimumSideValueUsdThreshold =
    response?.minimumSideValueUsdThreshold ?? 50
  const chains = chainsData ?? []
  const explorerUrlsByChain = new Map(
    chains.flatMap((chain) =>
      chain.explorerUrl ? [[chain.id, chain.explorerUrl] as const] : [],
    ),
  )

  const totalSrcValue = rows.reduce(
    (sum, row) => sum + (row.srcValueUsd ?? 0),
    0,
  )
  const totalDstValue = rows.reduce(
    (sum, row) => sum + (row.dstValueUsd ?? 0),
    0,
  )

  const refetchAll = async () => {
    await Promise.all([refetchSuspiciousTransfers(), refetchChains()])
  }

  return (
    <TablePageLayout
      title="Suspicious transfers"
      description="Value-mismatch transfers migrated from the legacy anomalies page."
      actions={
        <Button
          variant="outline"
          size="sm"
          onClick={() => void refetchAll()}
          disabled={isSuspiciousTransfersFetching || isChainsFetching}
        >
          <RefreshCwIcon
            className={
              isSuspiciousTransfersFetching || isChainsFetching
                ? 'animate-spin'
                : ''
            }
          />
          Refresh
        </Button>
      }
      summary={
        <>
          <Badge variant="secondary">{rows.length} flagged transfers</Badge>
          <Badge variant="secondary">
            {'>'} {valueDiffThresholdPercent.toFixed(2)}% diff
          </Badge>
          <Badge variant="secondary">
            {formatDollars(minimumSideValueUsdThreshold)} min side value
          </Badge>
          <Badge variant="secondary">
            {formatDollars(totalSrcValue)} total source value
          </Badge>
          <Badge variant="secondary">
            {formatDollars(totalDstValue)} total destination value
          </Badge>
        </>
      }
    >
      {isSuspiciousTransfersLoading ? <LoadingState className="m-6" /> : null}

      {isSuspiciousTransfersError ? (
        <ErrorState className="m-6" cause={suspiciousTransfersError.message} />
      ) : null}

      {isChainsError ? (
        <div className="px-6 py-4 text-destructive text-sm">
          Failed to load chain metadata ({chainsError.message}). Tx hashes are
          shown without explorer links.
        </div>
      ) : null}

      {!isSuspiciousTransfersLoading && !isSuspiciousTransfersError ? (
        <SuspiciousTransfersTable
          data={rows}
          getExplorerUrl={(chain) => explorerUrlsByChain.get(chain)}
          valueDiffThresholdPercent={valueDiffThresholdPercent}
          enableCsvExport
        />
      ) : null}
    </TablePageLayout>
  )
}
