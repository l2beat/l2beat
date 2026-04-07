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
import { ErrorState } from '~/components/ErrorState'
import { LoadingState } from '~/components/LoadingState'
import { AppLayout } from '~/layouts/AppLayout'
import { api } from '~/react-query/trpc'
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
  } = api.missingTokens.list.useQuery()

  const {
    data: chainsData,
    error: chainsError,
    isError: isChainsError,
    isFetching: isChainsFetching,
    refetch: refetchChains,
  } = api.chains.metadata.useQuery()

  const rows: MissingTokenRow[] = missingTokensData ?? []
  const chains: ChainMetadata[] = chainsData ?? []
  const explorerUrlsByChain = new Map(
    chains.flatMap((chain) =>
      chain.explorerUrl ? [[chain.id, chain.explorerUrl] as const] : [],
    ),
  )

  const totalOccurrences = rows.reduce((sum, row) => sum + row.count, 0)
  const uniquePluginsCount = new Set(rows.flatMap((row) => row.plugins)).size

  const refetchAll = async () => {
    await Promise.all([refetchMissingTokens(), refetchChains()])
  }

  return (
    <AppLayout className="min-h-screen">
      <div className="flex flex-col gap-4 p-4">
        <Card className="gap-4">
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle>Missing tokens</CardTitle>
              <CardDescription>
                Transfers with missing token pricing or metadata, grouped by
                chain and address.
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
          <CardContent className="flex flex-wrap gap-2">
            <Badge variant="secondary">{rows.length} missing tokens</Badge>
            <Badge variant="secondary">{totalOccurrences} occurrences</Badge>
            <Badge variant="secondary">{uniquePluginsCount} plugins</Badge>
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
              />
            ) : null}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
