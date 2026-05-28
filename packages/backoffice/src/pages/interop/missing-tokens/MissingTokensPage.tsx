import { RefreshCwIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '~/components/core/Badge'
import { Button } from '~/components/core/Button'
import { ErrorState } from '~/components/ErrorState'
import { LoadingState } from '~/components/LoadingState'
import { TablePageLayout } from '~/components/table/TablePageLayout'
import { useBackendApi } from '~/react-query/trpc'
import { MissingTokenStatusBadge } from './MissingTokenStatusBadge'
import { MissingTokenStatusGuide } from './MissingTokenStatusGuide'
import { MissingTokensTable } from './table/MissingTokensTable'
import type { ChainMetadata, MissingTokenRow } from './types'

export function MissingTokensPage() {
  const api = useBackendApi()
  const {
    data: missingTokensData,
    error: missingTokensError,
    isError: isMissingTokensError,
    isLoading: isMissingTokensLoading,
    isFetching: isMissingTokensFetching,
    refetch: refetchMissingTokens,
  } = api.interop.missingTokens.list.useQuery()

  const {
    data: chainsData,
    error: chainsError,
    isError: isChainsError,
    isFetching: isChainsFetching,
    refetch: refetchChains,
  } = api.interop.chains.metadata.useQuery()

  const rows: MissingTokenRow[] = missingTokensData ?? []
  const chains: ChainMetadata[] = chainsData ?? []
  const explorerUrlsByChain = new Map(
    chains.flatMap((chain) =>
      chain.explorerUrl ? [[chain.id, chain.explorerUrl] as const] : [],
    ),
  )

  const totalOccurrences = rows.reduce((sum, row) => sum + row.count, 0)
  const statusCounts = rows.reduce(
    (acc, row) => {
      acc[row.tokenDbStatus]++
      return acc
    },
    {
      missing: 0,
      incomplete: 0,
      ready: 0,
      unsupported: 0,
    },
  )

  const requeueMissingTokens = api.interop.missingTokens.requeue.useMutation()

  const refetchAll = async () => {
    await Promise.all([refetchMissingTokens(), refetchChains()])
  }

  const handleRequeue = async (
    tokens: { chain: string; tokenAddress: string }[],
  ) => {
    try {
      const result = await requeueMissingTokens.mutateAsync(tokens)

      toast.success('Missing-token requeue requested', {
        description: `${result.requestedTokenCount} tokens requeued, ${result.skippedTokenCount} skipped, ${result.updatedTransfers} transfers marked as unprocessed.`,
      })

      return true
    } catch (error) {
      toast.error('Missing-token requeue failed', {
        description: error instanceof Error ? error.message : 'Unknown error',
      })

      return false
    }
  }

  return (
    <TablePageLayout
      title="Missing tokens"
      description="Transfers missing financial attribution, grouped by chain and address and cross-checked against TokenDB."
      actions={
        <Button
          variant="outline"
          size="sm"
          onClick={() => void refetchAll()}
          disabled={isMissingTokensFetching || isChainsFetching}
        >
          <RefreshCwIcon
            className={
              isMissingTokensFetching || isChainsFetching ? 'animate-spin' : ''
            }
          />
          Refresh
        </Button>
      }
      summary={
        <>
          <Badge variant="secondary">{rows.length} queue rows</Badge>
          <Badge variant="secondary">{totalOccurrences} occurrences</Badge>
          <MissingTokenStatusBadge status="missing">
            {statusCounts.missing} missing
          </MissingTokenStatusBadge>
          <MissingTokenStatusBadge status="incomplete">
            {statusCounts.incomplete} incomplete
          </MissingTokenStatusBadge>
          <MissingTokenStatusBadge status="ready">
            {statusCounts.ready} ready
          </MissingTokenStatusBadge>
          <MissingTokenStatusBadge status="unsupported">
            {statusCounts.unsupported} unsupported
          </MissingTokenStatusBadge>
          <div className="ml-auto">
            <MissingTokenStatusGuide />
          </div>
        </>
      }
    >
      {isMissingTokensLoading ? <LoadingState className="m-6" /> : null}

      {isMissingTokensError ? (
        <ErrorState className="m-6" cause={missingTokensError.message} />
      ) : null}

      {isChainsError ? (
        <div className="px-6 py-4 text-destructive text-sm">
          Failed to load chain metadata ({chainsError.message}). Address links
          are shown without explorer links.
        </div>
      ) : null}

      {!isMissingTokensLoading && !isMissingTokensError ? (
        <MissingTokensTable
          data={rows}
          getExplorerUrl={(chain) => explorerUrlsByChain.get(chain)}
          enableCsvExport
          isRequeuePending={requeueMissingTokens.isPending}
          onRequeue={handleRequeue}
        />
      ) : null}
    </TablePageLayout>
  )
}
