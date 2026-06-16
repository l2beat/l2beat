import { useQuery } from '@tanstack/react-query'
import { ChevronLeftIcon, RefreshCwIcon } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Badge } from '~/components/core/Badge'
import { Button } from '~/components/core/Button'
import { ErrorState } from '~/components/ErrorState'
import { LoadingState } from '~/components/LoadingState'
import { TablePageLayout } from '~/components/table/TablePageLayout'
import { useBackendTrpc } from '~/react-query/trpc'
import { EventDetailsTable } from './table/details/EventDetailsTable'
import type {
  ChainMetadata,
  EventDetailsInput,
  EventDetailsRow,
  InteropEventKind,
} from './types'
import { getEventKindLabel } from './utils/event-labels'

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

export function EventDetailsPage() {
  const trpc = useBackendTrpc()
  const params = useParams<{ kind: string; type: string }>()
  const kind = getKind(params.kind)
  const type = decodeRouteParam(params.type)
  const hasValidParams = kind !== undefined && type !== undefined

  const detailsInput: EventDetailsInput = hasValidParams
    ? { kind, type }
    : { kind: 'all', type: '' }

  const {
    data: eventDetailsData,
    error: eventDetailsError,
    isError: isEventDetailsError,
    isLoading: isEventDetailsLoading,
    isFetching: isEventDetailsFetching,
    refetch: refetchEventDetails,
  } = useQuery(
    trpc.interop.events.details.queryOptions(detailsInput, {
      enabled: hasValidParams,
    }),
  )

  const {
    data: chainsData,
    error: chainsError,
    isError: isChainsError,
    isFetching: isChainsFetching,
    refetch: refetchChains,
  } = useQuery(trpc.interop.chains.metadata.queryOptions())

  const rows: EventDetailsRow[] = eventDetailsData ?? []
  const chains: ChainMetadata[] = chainsData ?? []
  const explorerUrlsByChain = new Map(
    chains.flatMap((chain) =>
      chain.explorerUrl ? [[chain.id, chain.explorerUrl] as const] : [],
    ),
  )
  const uniqueChains = new Set(rows.map((row) => row.chain)).size

  const refetchAll = async () => {
    await Promise.all([refetchEventDetails(), refetchChains()])
  }

  return (
    <TablePageLayout
      title="Event details"
      description="Drill into a single event type and status bucket."
      actions={
        <>
          <Button asChild variant="outline" size="sm">
            <Link to="/interop/events">
              <ChevronLeftIcon />
              Back to events
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => void refetchAll()}
            disabled={
              !hasValidParams || isEventDetailsFetching || isChainsFetching
            }
          >
            <RefreshCwIcon
              className={
                isEventDetailsFetching || isChainsFetching ? 'animate-spin' : ''
              }
            />
            Refresh
          </Button>
        </>
      }
      summary={
        <>
          <Badge variant={hasValidParams ? 'secondary' : 'destructive'}>
            Kind:{' '}
            {hasValidParams && kind ? getEventKindLabel(kind) : 'invalid route'}
          </Badge>
          <Badge variant={hasValidParams ? 'secondary' : 'destructive'}>
            Type: {type ?? 'invalid route'}
          </Badge>
          <Badge variant="secondary">{rows.length} events</Badge>
          <Badge variant="secondary">{uniqueChains} chains</Badge>
        </>
      }
    >
      {!hasValidParams ? (
        <ErrorState
          className="m-6"
          cause="Invalid route. Expected /events/:kind/:type."
        />
      ) : null}

      {hasValidParams && isEventDetailsLoading ? (
        <LoadingState className="m-6" />
      ) : null}

      {hasValidParams && isEventDetailsError ? (
        <ErrorState className="m-6" cause={eventDetailsError.message} />
      ) : null}

      {isChainsError ? (
        <div className="px-6 py-4 text-destructive text-sm">
          Failed to load chain metadata ({chainsError.message}). Tx hashes are
          shown without explorer links.
        </div>
      ) : null}

      {hasValidParams && !isEventDetailsLoading && !isEventDetailsError ? (
        <EventDetailsTable
          data={rows}
          getExplorerUrl={(chain) => explorerUrlsByChain.get(chain)}
          enableCsvExport
        />
      ) : null}
    </TablePageLayout>
  )
}
