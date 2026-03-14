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
import { MessageDetailsTable } from '../table/messages-details/MessageDetailsTable'
import {
  decodeRouteParam,
  parseOptionalSearchParam,
} from '../table/messages-details/utils'
import type {
  SummaryChainMetadata,
  SummaryMessageDetailsRow,
} from '../table/types'

type MessageDetailsInput = RouterInputs['summary']['messagesDetails']

export function SummaryMessageDetailsPage() {
  const params = useParams<{ type: string }>()
  const [searchParams] = useSearchParams()

  const type = decodeRouteParam(params.type)
  const plugin = parseOptionalSearchParam(searchParams.get('plugin'))
  const srcChain = parseOptionalSearchParam(searchParams.get('srcChain'))
  const dstChain = parseOptionalSearchParam(searchParams.get('dstChain'))
  const hasValidParams = type !== undefined

  const messageDetailsInput: MessageDetailsInput = hasValidParams
    ? {
        type,
        plugin,
        srcChain,
        dstChain,
      }
    : { type: '' }

  const {
    data: messagesData,
    isLoading: isMessagesLoading,
    isError: isMessagesError,
    error: messagesError,
    refetch: refetchMessages,
    isFetching: isMessagesFetching,
  } = api.summary.messagesDetails.useQuery(messageDetailsInput, {
    enabled: hasValidParams,
  })

  const {
    data: chainsData,
    isError: isChainsError,
    error: chainsError,
    refetch: refetchChains,
    isFetching: isChainsFetching,
  } = api.chains.metadata.useQuery()

  const rows: SummaryMessageDetailsRow[] = messagesData ?? []
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
    await Promise.all([refetchMessages(), refetchChains()])
  }

  return (
    <AppLayout className="min-h-screen">
      <div className="flex flex-col gap-4 p-4">
        <SummarySubnav />

        <Card className="gap-4">
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle>Message details</CardTitle>
              <CardDescription>
                Drill-down for selected message type and chain filters.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm">
                <Link to="/summary/messages">
                  <ChevronLeftIcon />
                  Back to messages
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => void refetch()}
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
          </CardContent>
        </Card>

        <Card className="gap-0 py-0">
          <CardContent className="px-0">
            {!hasValidParams ? (
              <div className="px-6 py-4 text-destructive text-sm">
                Invalid route. Expected: /interop/messages/:type.
              </div>
            ) : null}

            {hasValidParams && isMessagesLoading ? (
              <LoadingState className="m-6" />
            ) : null}

            {hasValidParams && isMessagesError ? (
              <div className="px-6 py-4 text-destructive text-sm">
                Failed to load message details: {messagesError.message}
              </div>
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
