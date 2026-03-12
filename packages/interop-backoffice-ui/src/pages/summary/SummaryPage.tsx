import { RefreshCwIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
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
import { SummarySubnav } from './components/SummarySubnav'
import type {
  SummaryEventRow,
  SummaryKnownAppsRow,
  SummaryMessageRow,
  SummaryMissingTokenRow,
  SummaryTransferRow,
} from './table/types'

export function SummaryPage() {
  const {
    data: eventsData,
    isLoading: isEventsLoading,
    isError: isEventsError,
    error: eventsError,
    refetch: refetchEvents,
    isFetching: isEventsFetching,
  } = api.summary.events.useQuery()

  const {
    data: messagesData,
    isLoading: isMessagesLoading,
    isError: isMessagesError,
    error: messagesError,
    refetch: refetchMessages,
    isFetching: isMessagesFetching,
  } = api.summary.messages.useQuery()

  const {
    data: transfersData,
    isLoading: isTransfersLoading,
    isError: isTransfersError,
    error: transfersError,
    refetch: refetchTransfers,
    isFetching: isTransfersFetching,
  } = api.summary.transfers.useQuery()

  const {
    data: missingTokensData,
    isLoading: isMissingTokensLoading,
    isError: isMissingTokensError,
    error: missingTokensError,
    refetch: refetchMissingTokens,
    isFetching: isMissingTokensFetching,
  } = api.summary.missingTokens.useQuery()

  const {
    data: knownAppsData,
    isLoading: isKnownAppsLoading,
    isError: isKnownAppsError,
    error: knownAppsError,
    refetch: refetchKnownApps,
    isFetching: isKnownAppsFetching,
  } = api.summary.knownApps.useQuery()

  const refetchAll = async () => {
    await Promise.all([
      refetchEvents(),
      refetchMessages(),
      refetchTransfers(),
      refetchMissingTokens(),
      refetchKnownApps(),
    ])
  }

  const eventRows: SummaryEventRow[] = eventsData ?? []
  const messageRows: SummaryMessageRow[] = messagesData ?? []
  const transferRows: SummaryTransferRow[] = transfersData ?? []
  const missingTokenRows: SummaryMissingTokenRow[] = missingTokensData ?? []
  const knownAppsRows: SummaryKnownAppsRow[] = knownAppsData ?? []
  const totalEvents = eventRows.reduce((sum, row) => sum + row.count, 0)
  const unmatchedEvents = eventRows.reduce((sum, row) => sum + row.unmatched, 0)
  const totalMessages = messageRows.reduce((sum, row) => sum + row.count, 0)
  const totalTransfers = transferRows.reduce((sum, row) => sum + row.count, 0)
  const totalMissingTokenRecords = missingTokenRows.reduce(
    (sum, row) => sum + row.count,
    0,
  )
  const totalKnownApps = knownAppsRows.reduce(
    (sum, row) => sum + row.apps.length,
    0,
  )
  const knownAppMessages = messageRows.reduce(
    (sum, row) => sum + row.knownAppCount,
    0,
  )

  return (
    <AppLayout className="min-h-screen">
      <div className="flex flex-col gap-4 p-4">
        <SummarySubnav />

        <Card className="gap-4">
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle>Interop summary: Overview</CardTitle>
              <CardDescription>
                Summary has been split into dedicated sub-pages for events,
                messages, and transfers.
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void refetchAll()}
              disabled={
                isEventsFetching ||
                isMessagesFetching ||
                isTransfersFetching ||
                isMissingTokensFetching ||
                isKnownAppsFetching
              }
            >
              <RefreshCwIcon
                className={
                  isEventsFetching ||
                  isMessagesFetching ||
                  isTransfersFetching ||
                  isMissingTokensFetching ||
                  isKnownAppsFetching
                    ? 'animate-spin'
                    : ''
                }
              />
              Refresh
            </Button>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Badge variant="secondary">{eventRows.length} event types</Badge>
            <Badge variant="secondary">
              {messageRows.length} message types
            </Badge>
            <Badge variant="secondary">
              {knownAppsRows.length} plugins with known apps
            </Badge>
            <Badge variant="secondary">
              {transferRows.length} transfer types
            </Badge>
            <Badge
              variant={
                missingTokenRows.length > 0 ? 'destructive' : 'secondary'
              }
            >
              {missingTokenRows.length} missing tokens
            </Badge>
            <Badge variant="secondary">{totalEvents} total events</Badge>
            <Badge variant="secondary">{totalMessages} total messages</Badge>
            <Badge variant="secondary">{totalKnownApps} known apps</Badge>
            <Badge variant="secondary">{totalTransfers} total transfers</Badge>
            <Badge variant="secondary">
              {totalMissingTokenRecords} missing transfer sides
            </Badge>
            <Badge variant={unmatchedEvents > 0 ? 'destructive' : 'secondary'}>
              {unmatchedEvents} unmatched
            </Badge>
            <Badge variant="secondary">
              {knownAppMessages} known-app messages
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Summary sections</CardTitle>
            <CardDescription>
              Open a dedicated page for each table.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/summary/aggregates">Open aggregates</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/summary/anomalies">Open anomalies</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/summary/coverage-pies">Open coverage pies</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/summary/events">Open events</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/summary/messages">Open messages</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/summary/known-apps">Open known apps</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/summary/transfers">Open transfers</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/summary/missing-tokens">Open missing tokens</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/processor-statuses">Open processor statuses</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/financials/actions">Open financial actions</Link>
            </Button>
          </CardContent>
        </Card>

        {isEventsLoading ||
        isMessagesLoading ||
        isTransfersLoading ||
        isMissingTokensLoading ||
        isKnownAppsLoading ? (
          <LoadingState className="m-2" />
        ) : null}
        {isEventsError ? (
          <div className="px-2 text-destructive text-sm">
            Failed to load summary events: {eventsError.message}
          </div>
        ) : null}
        {isMessagesError ? (
          <div className="px-2 text-destructive text-sm">
            Failed to load summary messages: {messagesError.message}
          </div>
        ) : null}
        {isTransfersError ? (
          <div className="px-2 text-destructive text-sm">
            Failed to load summary transfers: {transfersError.message}
          </div>
        ) : null}
        {isMissingTokensError ? (
          <div className="px-2 text-destructive text-sm">
            Failed to load summary missing tokens: {missingTokensError.message}
          </div>
        ) : null}
        {isKnownAppsError ? (
          <div className="px-2 text-destructive text-sm">
            Failed to load summary known apps: {knownAppsError.message}
          </div>
        ) : null}
      </div>
    </AppLayout>
  )
}
