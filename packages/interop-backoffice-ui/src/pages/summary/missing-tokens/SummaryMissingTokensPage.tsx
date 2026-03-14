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
import { MissingTokensTable } from '../table/missing-tokens/MissingTokensTable'
import type {
  SummaryChainMetadata,
  SummaryMissingTokenRow,
} from '../table/types'

export function SummaryMissingTokensPage() {
  const {
    data: missingTokensData,
    isLoading: isMissingTokensLoading,
    isError: isMissingTokensError,
    error: missingTokensError,
    refetch: refetchMissingTokens,
    isFetching: isMissingTokensFetching,
  } = api.summary.missingTokens.useQuery()

  const {
    data: chainsData,
    isError: isChainsError,
    error: chainsError,
    refetch: refetchChains,
    isFetching: isChainsFetching,
  } = api.chains.metadata.useQuery()

  const rows: SummaryMissingTokenRow[] = missingTokensData ?? []
  const chains: SummaryChainMetadata[] = chainsData ?? []

  const uniqueChainsCount = useMemo(
    () => new Set(rows.map((row) => row.chain)).size,
    [rows],
  )
  const uniquePluginsCount = useMemo(
    () => new Set(rows.flatMap((row) => row.plugins)).size,
    [rows],
  )
  const missingRecordsCount = rows.reduce((sum, row) => sum + row.count, 0)

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
    await Promise.all([refetchMissingTokens(), refetchChains()])
  }

  return (
    <AppLayout className="min-h-screen">
      <div className="flex flex-col gap-4 p-4">
        <SummarySubnav />

        <Card className="gap-4">
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle>Summary: Missing tokens</CardTitle>
              <CardDescription>
                Tokens missing valuation metadata, with direct add-token
                actions.
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void refetch()}
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
            <Badge variant="secondary">
              {missingRecordsCount} transfer sides
            </Badge>
            <Badge variant="secondary">{uniqueChainsCount} chains</Badge>
            <Badge variant="secondary">{uniquePluginsCount} plugins</Badge>
          </CardContent>
        </Card>

        <Card className="gap-0 py-0">
          <CardContent className="px-0">
            {isMissingTokensLoading ? <LoadingState className="m-6" /> : null}

            {isMissingTokensError ? (
              <div className="px-6 py-4 text-destructive text-sm">
                Failed to load missing tokens: {missingTokensError.message}
              </div>
            ) : null}

            {isChainsError ? (
              <div className="px-6 py-4 text-destructive text-sm">
                Failed to load chain metadata ({chainsError.message}). Addresses
                are shown without explorer links.
              </div>
            ) : null}

            {!isMissingTokensLoading && !isMissingTokensError ? (
              <MissingTokensTable
                data={rows}
                getExplorerUrl={getExplorerUrl}
                enableCsvExport
              />
            ) : null}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
