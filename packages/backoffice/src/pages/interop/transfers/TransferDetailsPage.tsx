import { ChevronLeftIcon, RefreshCwIcon } from 'lucide-react'
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
import { ErrorState } from '~/components/ErrorState'
import { LoadingState } from '~/components/LoadingState'
import { AppLayout } from '~/layouts/AppLayout'
import { api } from '~/react-query/trpc'
import { TransferDetailsTable } from './table/details/TransferDetailsTable'
import type {
  ChainMetadata,
  TransferDetailsInput,
  TransferDetailsRow,
} from './types'
import { decodeRouteParam, parseOptionalSearchParam } from './utils'

export function TransferDetailsPage() {
  const params = useParams<{ type: string }>()
  const [searchParams] = useSearchParams()
  const type = decodeRouteParam(params.type)
  const plugin = parseOptionalSearchParam(searchParams.get('plugin'))
  const srcChain = parseOptionalSearchParam(searchParams.get('srcChain'))
  const dstChain = parseOptionalSearchParam(searchParams.get('dstChain'))
  const hasValidParams = type !== undefined

  const detailsInput: TransferDetailsInput = hasValidParams
    ? {
        type,
        plugin,
        srcChain,
        dstChain,
      }
    : { type: '' }

  const {
    data: transfersData,
    error: transfersError,
    isError: isTransfersError,
    isLoading: isTransfersLoading,
    isFetching: isTransfersFetching,
    refetch: refetchTransfers,
  } = api.transfers.details.useQuery(detailsInput, {
    enabled: hasValidParams,
  })

  const {
    data: chainsData,
    error: chainsError,
    isError: isChainsError,
    isFetching: isChainsFetching,
    refetch: refetchChains,
  } = api.chains.metadata.useQuery()

  const rows: TransferDetailsRow[] = transfersData ?? []
  const chains: ChainMetadata[] = chainsData ?? []
  const explorerUrlsByChain = new Map(
    chains.flatMap((chain) =>
      chain.explorerUrl ? [[chain.id, chain.explorerUrl] as const] : [],
    ),
  )

  const refetchAll = async () => {
    await Promise.all([refetchTransfers(), refetchChains()])
  }

  return (
    <AppLayout className="min-h-screen">
      <div className="flex flex-col gap-4">
        <Card className="gap-4">
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle>Transfer details</CardTitle>
              <CardDescription>
                Drill into a single transfer type and optional chain filters.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm">
                <Link to="/interop/transfers">
                  <ChevronLeftIcon />
                  Back to transfers
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => void refetchAll()}
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
              <ErrorState
                className="m-6"
                cause="Invalid route. Expected /transfers/:type."
              />
            ) : null}

            {hasValidParams && isTransfersLoading ? (
              <LoadingState className="m-6" />
            ) : null}

            {hasValidParams && isTransfersError ? (
              <ErrorState className="m-6" cause={transfersError.message} />
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
