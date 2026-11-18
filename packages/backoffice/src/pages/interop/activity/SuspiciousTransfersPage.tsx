import { useQuery } from '@tanstack/react-query'
import { RefreshCwIcon } from 'lucide-react'
import { Badge } from '~/components/core/Badge'
import { Button } from '~/components/core/Button'
import { ErrorState } from '~/components/ErrorState'
import { LoadingState } from '~/components/LoadingState'
import { TablePageLayout } from '~/components/table/TablePageLayout'
import { useHashTarget } from '~/hooks/useHashTarget'
import { formatDollars } from '~/pages/interop/transfers/utils'
import { useBackendTrpc } from '~/react-query/trpc'
import { TransferDataRangeSelect } from '../TransferDataRangeSelect'
import { useTransferDataRange } from '../transferDataRange'
import { SuspiciousTransfersTable } from './table/SuspiciousTransfersTable'
import type {
  SuspiciousTransferRow,
  SuspiciousTransfersResponse,
} from './types'

export function SuspiciousTransfersPage() {
  const trpc = useBackendTrpc()
  const [range, setRange] = useTransferDataRange()
  const highlightTransferId = useHashTarget()
  const {
    data: suspiciousTransfersData,
    error: suspiciousTransfersError,
    isError: isSuspiciousTransfersError,
    isLoading: isSuspiciousTransfersLoading,
    isFetching: isSuspiciousTransfersFetching,
    refetch: refetchSuspiciousTransfers,
  } = useQuery(
    trpc.interop.activity.suspiciousTransfers.queryOptions({ range }),
  )

  const {
    data: chainsData,
    error: chainsError,
    isError: isChainsError,
    isFetching: isChainsFetching,
    refetch: refetchChains,
  } = useQuery(trpc.interop.chains.metadata.queryOptions())

  const response: SuspiciousTransfersResponse | undefined =
    suspiciousTransfersData
  const rows: SuspiciousTransferRow[] = response?.items ?? []
  const minimumLargerSideValueUsd = response?.minimumLargerSideValueUsd
  const minimumValueRatio = response?.minimumValueRatio
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
      description="Value-mismatch transfers that trigger the Discord suspicious-transfer alert."
      actions={
        <>
          <TransferDataRangeSelect
            value={range}
            onValueChange={setRange}
            disabled={isSuspiciousTransfersFetching}
          />
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
        </>
      }
      summary={
        <>
          <Badge variant="secondary">{rows.length} flagged transfers</Badge>
          <Badge variant="secondary">
            {'≥'} {formatDollars(minimumLargerSideValueUsd)} larger side
          </Badge>
          <Badge variant="secondary">
            {'≥'} {minimumValueRatio ?? '-'}x value ratio
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
          enableCsvExport
          highlightTransferId={highlightTransferId}
        />
      ) : null}
    </TablePageLayout>
  )
}
