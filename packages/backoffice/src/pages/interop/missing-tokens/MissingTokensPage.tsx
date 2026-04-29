import { RefreshCwIcon } from 'lucide-react'
import { toast } from 'sonner'
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
import { LoadingState } from '~/components/LoadingState'
import { AppLayout } from '~/layouts/AppLayout'
import { api } from '~/react-query/trpc'
import { MissingTokenStatusBadge } from './MissingTokenStatusBadge'
import { MissingTokenStatusGuide } from './MissingTokenStatusGuide'
import { MissingTokensTable } from './table/MissingTokensTable'
import type { ChainMetadata, MissingTokenRow } from './types'

export function MissingTokensPage() {
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
    <AppLayout className="min-h-screen">
      <div className="flex flex-col gap-4">
        <Card className="gap-4">
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle>Missing tokens</CardTitle>
              <CardDescription>
                Transfers missing financial attribution, grouped by chain and
                address and cross-checked against TokenDB.
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void refetchAll()}
              disabled={isMissingTokensFetching || isChainsFetching}
            >
              <RefreshCwIcon
                className={
                  isMissingTokensFetching || isChainsFetching
                    ? 'animate-spin'
                    : ''
                }
              />
              Refresh
            </Button>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-2">
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
          </CardContent>
        </Card>

        <Card className="gap-0 py-0">
          <CardContent className="px-0">
            {isMissingTokensLoading ? <LoadingState className="m-6" /> : null}

            {isMissingTokensError ? (
              <ErrorState className="m-6" cause={missingTokensError.message} />
            ) : null}

            {isChainsError ? (
              <div className="px-6 py-4 text-destructive text-sm">
                Failed to load chain metadata ({chainsError.message}). Address
                links are shown without explorer links.
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
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
