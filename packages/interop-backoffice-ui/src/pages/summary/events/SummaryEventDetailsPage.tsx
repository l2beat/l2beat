import type { RouterInputs } from '@l2beat/interop-backoffice'
import { ChevronLeftIcon, RefreshCwIcon } from 'lucide-react'
import { useCallback, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
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
import { EventDetailsTable } from '../table/events-details/EventDetailsTable'
import {
  getEventKindLabel,
  type InteropEventKind,
} from '../table/events-details/utils'
import type {
  SummaryChainMetadata,
  SummaryEventDetailsRow,
} from '../table/types'

const INTEROP_EVENT_KINDS: readonly InteropEventKind[] = [
  'all',
  'matched',
  'unmatched',
  'old-unmatched',
  'unsupported',
]

function decodeRouteParam(value: string | undefined) {
  if (value === undefined) {
    return undefined
  }

  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

function isInteropEventKind(value: string): value is InteropEventKind {
  return INTEROP_EVENT_KINDS.includes(value as InteropEventKind)
}

function getKind(kind: string | undefined): InteropEventKind | undefined {
  if (kind === undefined) {
    return undefined
  }

  return isInteropEventKind(kind) ? kind : undefined
}

type EventsDetailsInput = RouterInputs['summary']['eventsDetails']

export function SummaryEventDetailsPage() {
  const params = useParams<{ kind: string; type: string }>()
  const kind = getKind(params.kind)
  const type = decodeRouteParam(params.type)
  const hasValidParams = kind !== undefined && type !== undefined

  const eventsDetailsInput: EventsDetailsInput = hasValidParams
    ? { kind, type }
    : { kind: 'all', type: '' }

  const {
    data: eventsData,
    isLoading: isEventsLoading,
    isError: isEventsError,
    error: eventsError,
    refetch: refetchEvents,
    isFetching: isEventsFetching,
  } = api.summary.eventsDetails.useQuery(eventsDetailsInput, {
    enabled: hasValidParams,
  })

  const {
    data: chainsData,
    isError: isChainsError,
    error: chainsError,
    refetch: refetchChains,
    isFetching: isChainsFetching,
  } = api.chains.metadata.useQuery()

  const rows: SummaryEventDetailsRow[] = eventsData ?? []
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

  const uniqueChains = useMemo(
    () => new Set(rows.map((row) => row.chain)).size,
    [rows],
  )

  const refetch = async () => {
    await Promise.all([refetchEvents(), refetchChains()])
  }

  return (
    <AppLayout className="min-h-screen">
      <div className="flex flex-col gap-4 p-4">
        <SummarySubnav />

        <Card className="gap-4">
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle>Event details</CardTitle>
              <CardDescription>
                Drill-down for selected event kind and type.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm">
                <Link to="/summary/events">
                  <ChevronLeftIcon />
                  Back to events
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => void refetch()}
                disabled={
                  !hasValidParams || isEventsFetching || isChainsFetching
                }
              >
                <RefreshCwIcon
                  className={
                    isEventsFetching || isChainsFetching ? 'animate-spin' : ''
                  }
                />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Badge variant={hasValidParams ? 'secondary' : 'destructive'}>
              Kind:{' '}
              {hasValidParams && kind
                ? getEventKindLabel(kind)
                : 'invalid route'}
            </Badge>
            <Badge variant={hasValidParams ? 'secondary' : 'destructive'}>
              Type: {type ?? 'invalid route'}
            </Badge>
            <Badge variant="secondary">{rows.length} events</Badge>
            <Badge variant="secondary">{uniqueChains} chains</Badge>
          </CardContent>
        </Card>

        <Card className="gap-0 py-0">
          <CardContent className="px-0">
            {!hasValidParams ? (
              <div className="px-6 py-4 text-destructive text-sm">
                Invalid route. Expected: /interop/events/:kind/:type.
              </div>
            ) : null}

            {hasValidParams && isEventsLoading ? (
              <LoadingState className="m-6" />
            ) : null}

            {hasValidParams && isEventsError ? (
              <div className="px-6 py-4 text-destructive text-sm">
                Failed to load event details: {eventsError.message}
              </div>
            ) : null}

            {isChainsError ? (
              <div className="px-6 py-4 text-destructive text-sm">
                Failed to load chain metadata ({chainsError.message}). Tx hashes
                are shown without explorer links.
              </div>
            ) : null}

            {hasValidParams && !isEventsLoading && !isEventsError ? (
              <EventDetailsTable
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
