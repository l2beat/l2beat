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
import { MessageDetailsTable } from './table/details/MessageDetailsTable'
import type {
  ChainMetadata,
  MessageDetailsInput,
  MessageDetailsRow,
} from './types'
import { decodeRouteParam, parseOptionalSearchParam } from './utils'

export function MessageDetailsPage() {
  const params = useParams<{ type: string }>()
  const [searchParams] = useSearchParams()
  const type = decodeRouteParam(params.type)
  const plugin = parseOptionalSearchParam(searchParams.get('plugin'))
  const srcChain = parseOptionalSearchParam(searchParams.get('srcChain'))
  const dstChain = parseOptionalSearchParam(searchParams.get('dstChain'))
  const hasValidParams = type !== undefined

  const detailsInput: MessageDetailsInput = hasValidParams
    ? {
        type,
        plugin,
        srcChain,
        dstChain,
      }
    : { type: '' }

  const {
    data: messagesData,
    error: messagesError,
    isError: isMessagesError,
    isLoading: isMessagesLoading,
    isFetching: isMessagesFetching,
    refetch: refetchMessages,
  } = api.messages.details.useQuery(detailsInput, {
    enabled: hasValidParams,
  })

  const {
    data: chainsData,
    error: chainsError,
    isError: isChainsError,
    isFetching: isChainsFetching,
    refetch: refetchChains,
  } = api.chains.metadata.useQuery()

  const rows: MessageDetailsRow[] = messagesData ?? []
  const chains: ChainMetadata[] = chainsData ?? []
  const explorerUrlsByChain = new Map(
    chains.flatMap((chain) =>
      chain.explorerUrl ? [[chain.id, chain.explorerUrl] as const] : [],
    ),
  )
  const uniquePlugins = new Set(rows.map((row) => row.plugin)).size

  const refetchAll = async () => {
    await Promise.all([refetchMessages(), refetchChains()])
  }

  return (
    <AppLayout className="min-h-screen">
      <div className="flex flex-col gap-4 p-4">
        <Card className="gap-4">
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle>Message details</CardTitle>
              <CardDescription>
                Drill into a message type and optional plugin/chain filters.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm">
                <Link to="/messages">
                  <ChevronLeftIcon />
                  Back to messages
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => void refetchAll()}
                disabled={
                  !hasValidParams || isMessagesFetching || isChainsFetching
                }
              >
                <RefreshCwIcon
                  className={
                    isMessagesFetching || isChainsFetching ? 'animate-spin' : ''
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
            <Badge variant="secondary">{rows.length} messages</Badge>
            <Badge variant="secondary">{uniquePlugins} plugins</Badge>
          </CardContent>
        </Card>

        <Card className="gap-0 py-0">
          <CardContent className="px-0">
            {!hasValidParams ? (
              <ErrorState
                className="m-6"
                cause="Invalid route. Expected /messages/:type."
              />
            ) : null}

            {hasValidParams && isMessagesLoading ? (
              <LoadingState className="m-6" />
            ) : null}

            {hasValidParams && isMessagesError ? (
              <ErrorState className="m-6" cause={messagesError.message} />
            ) : null}

            {isChainsError ? (
              <div className="px-6 py-4 text-destructive text-sm">
                Failed to load chain metadata ({chainsError.message}). Tx hashes
                are shown without explorer links.
              </div>
            ) : null}

            {hasValidParams && !isMessagesLoading && !isMessagesError ? (
              <MessageDetailsTable
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
