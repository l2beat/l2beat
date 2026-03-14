import type { RouterInputs } from '@l2beat/interop-backoffice'
import { ChevronLeftIcon, RefreshCwIcon } from 'lucide-react'
import { useCallback, useMemo } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
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
import { TransferDetailsTable } from '../table/transfers-details/TransferDetailsTable'
import {
  decodeRouteParam,
  parseOptionalSearchParam,
} from '../table/transfers-details/utils'
import type {
  SummaryChainMetadata,
  SummaryTransferDetailsRow,
} from '../table/types'

type TransferDetailsInput = RouterInputs['summary']['transfersDetails']

export function SummaryTransferDetailsPage() {
  const params = useParams<{ type: string }>()
  const [searchParams] = useSearchParams()

  const type = decodeRouteParam(params.type)
  const plugin = parseOptionalSearchParam(searchParams.get('plugin'))
  const srcChain = parseOptionalSearchParam(searchParams.get('srcChain'))
  const dstChain = parseOptionalSearchParam(searchParams.get('dstChain'))
  const hasValidParams = type !== undefined

  const transferDetailsInput: TransferDetailsInput = hasValidParams
    ? {
        type,
        plugin,
        srcChain,
        dstChain,
      }
    : { type: '' }

  const {
    data: transfersData,
    isLoading: isTransfersLoading,
    isError: isTransfersError,
    error: transfersError,
    refetch: refetchTransfers,
    isFetching: isTransfersFetching,
  } = api.summary.transfersDetails.useQuery(transferDetailsInput, {
    enabled: hasValidParams,
  })

  const {
    data: chainsData,
    isError: isChainsError,
    error: chainsError,
    refetch: refetchChains,
    isFetching: isChainsFetching,
  } = api.chains.metadata.useQuery()

  const rows: SummaryTransferDetailsRow[] = transfersData ?? []
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
    await Promise.all([refetchTransfers(), refetchChains()])
  }

  return (
    <AppLayout className="min-h-screen">
      <div className="flex flex-col gap-4 p-4">
        <SummarySubnav />

        <Card className="gap-4">
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle>Transfer details</CardTitle>
              <CardDescription>
                Drill-down for selected transfer type and chain filters.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm">
                <Link to="/summary/transfers">
                  <ChevronLeftIcon />
                  Back to transfers
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => void refetch()}
                disabled={
                  !hasValidParams || isTransfersFetching || isChainsFetching
                }
              >
                <RefreshCwIcon
                  className={
                    isTransfersFetching || isChainsFetching
                      ? 'animate-spin'
                      : ''
                  }
                />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Badge variant={hasValidParams ? 'secondary' : 'destructive'}>
              Type: {type ?? 'invalid route'}
            </Badge>
            <Badge variant="secondary">Plugin: {plugin ?? 'all'}</Badge>
            <Badge variant="secondary">Source chain: {srcChain ?? 'all'}</Badge>
            <Badge variant="secondary">
              Destination chain: {dstChain ?? 'all'}
            </Badge>
            <Badge variant="secondary">{rows.length} transfers</Badge>
          </CardContent>
        </Card>

        <Card className="gap-0 py-0">
          <CardContent className="px-0">
            {!hasValidParams ? (
              <div className="px-6 py-4 text-destructive text-sm">
                Invalid route. Expected: /interop/transfers/:type.
              </div>
            ) : null}

            {hasValidParams && isTransfersLoading ? (
              <LoadingState className="m-6" />
            ) : null}

            {hasValidParams && isTransfersError ? (
              <div className="px-6 py-4 text-destructive text-sm">
                Failed to load transfer details: {transfersError.message}
              </div>
            ) : null}

            {isChainsError ? (
              <div className="px-6 py-4 text-destructive text-sm">
                Failed to load chain metadata ({chainsError.message}). Tx hashes
                are shown without explorer links.
              </div>
            ) : null}

            {hasValidParams && !isTransfersLoading && !isTransfersError ? (
              <TransferDetailsTable
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
