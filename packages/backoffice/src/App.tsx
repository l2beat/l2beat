import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { SidebarProvider } from './components/core/Sidebar'
import { Toaster } from './components/core/Sonner'
import {
  EnvironmentProvider,
  useEnvironment,
} from './components/environment/EnvironmentContext'
import { LoadingState } from './components/LoadingState'
import { AppLayout } from './layouts/AppLayout'
import { ActivityDetailsPage } from './pages/interop/activity/ActivityDetailsPage'
import { ActivityPage } from './pages/interop/activity/ActivityPage'
import { SuspiciousTransfersPage } from './pages/interop/activity/SuspiciousTransfersPage'
import { AggregatesPage } from './pages/interop/aggregates/AggregatesPage'
import { ChainsSummaryPage } from './pages/interop/chains-summary/ChainsSummaryPage'
import { CoveragePage } from './pages/interop/coverage/CoveragePage'
import { EventDetailsPage } from './pages/interop/events/EventDetailsPage'
import { EventsPage } from './pages/interop/events/EventsPage'
import { FinancialsPage } from './pages/interop/financials/FinancialsPage'
import { HighlightsPage } from './pages/interop/highlights/HighlightsPage'
import { KnownAppsPage } from './pages/interop/known-apps/KnownAppsPage'
import { MemoryPage } from './pages/interop/memory/MemoryPage'
import { MessageDetailsPage } from './pages/interop/messages/MessageDetailsPage'
import { MessagesPage } from './pages/interop/messages/MessagesPage'
import { ProcessorStatusesPage } from './pages/interop/processor-statuses/ProcessorStatusesPage'
import { PromotionPage } from './pages/interop/promotion/PromotionPage'
import { StatusPage } from './pages/interop/status/StatusPage'
import { SummaryPage } from './pages/interop/summary/SummaryPage'
import { TransferDetailsPage } from './pages/interop/transfers/TransferDetailsPage'
import { TransfersPage } from './pages/interop/transfers/TransfersPage'
import { BackofficeLandingPage } from './pages/landing/BackofficeLandingPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { AddChain } from './pages/token-db/chains/AddChain'
import { ChainPage } from './pages/token-db/chains/ChainPage'
import { ChainsSummaryPage as TokenDbChainsSummaryPage } from './pages/token-db/chains/ChainsSummaryPage'
import { SearchPage } from './pages/token-db/search/SearchPage'
import { AbstractTokenPage } from './pages/token-db/tokens/AbstractTokenPage'
import { AddTokensPage } from './pages/token-db/tokens/add-tokens/AddTokensPage'
import { DeployedTokenPage } from './pages/token-db/tokens/DeployedTokenPage'
import { TokenHistoryPage } from './pages/token-db/tokens/TokenHistoryPage'
import { TokenIngestionQueuePage } from './pages/token-db/tokens/TokenIngestionQueuePage'
import { TokenSuggestionsPage } from './pages/token-db/tokens/TokenSuggestionsPage'
import { TokensSummaryPage } from './pages/token-db/tokens/TokensSummaryPage'
import { TvsCoveragePage } from './pages/token-db/tokens/tvs-coverage/TvsCoveragePage'
import { DailyChecksRedirect } from './pages/website/daily-checks/DailyChecksRedirect'
import { InteropAggregatesPage } from './pages/website/interop-aggregates/InteropAggregatesPage'
import { DaTrackingStatusPage } from './pages/website/status/da-tracking/DaTrackingStatusPage'
import { TrackedTxsStatusPage } from './pages/website/status/tracked-txs/TrackedTxsStatusPage'
import { TRPCReactProvider } from './react-query/trpc'

const TokenRelationsGraphPage = lazy(() =>
  import('./pages/token-db/tokens/TokenRelationsGraphPage').then((module) => ({
    default: module.TokenRelationsGraphPage,
  })),
)

export function App() {
  return (
    <EnvironmentProvider>
      <EnvironmentScopedApp />
    </EnvironmentProvider>
  )
}

function EnvironmentScopedApp() {
  const { environment } = useEnvironment()

  return (
    <TRPCReactProvider key={environment}>
      <BrowserRouter>
        <SidebarProvider>
          <ReactQueryDevtools initialIsOpen={false} />

          <Toaster />
          <Routes>
            <Route path="/" element={<BackofficeLandingPage />} />

            <Route path="/interop" element={<SummaryPage />} />
            <Route path="/interop/aggregates" element={<AggregatesPage />} />
            <Route path="/interop/events" element={<EventsPage />} />
            <Route
              path="/interop/events/:kind/:type"
              element={<EventDetailsPage />}
            />

            <Route path="/interop/financials" element={<FinancialsPage />} />
            <Route path="/interop/messages" element={<MessagesPage />} />
            <Route
              path="/interop/messages/:type"
              element={<MessageDetailsPage />}
            />
            <Route path="/interop/known-apps" element={<KnownAppsPage />} />
            <Route
              path="/interop/indexing/processor-statuses"
              element={<ProcessorStatusesPage />}
            />

            <Route path="/interop/transfers" element={<TransfersPage />} />
            <Route
              path="/interop/transfers/:type"
              element={<TransferDetailsPage />}
            />
            <Route
              path="/interop/indexing/plugin-statuses"
              element={<StatusPage />}
            />

            <Route
              path="/interop/insights/activity"
              element={<ActivityPage />}
            />
            <Route
              path="/interop/insights/activity/aggregate/:id"
              element={<ActivityDetailsPage />}
            />
            <Route
              path="/interop/insights/activity/suspicious-transfers"
              element={<SuspiciousTransfersPage />}
            />
            <Route
              path="/interop/insights/coverage"
              element={<CoveragePage />}
            />
            <Route
              path="/interop/insights/coverage-pies"
              element={<Navigate to="/interop/insights/coverage" replace />}
            />
            <Route
              path="/interop/insights/highlights"
              element={<HighlightsPage />}
            />
            <Route
              path="/interop/insights/chains-summary"
              element={<ChainsSummaryPage />}
            />
            <Route path="/interop/insights/memory" element={<MemoryPage />} />
            <Route path="/interop/promotion" element={<PromotionPage />} />
            <Route
              path="/website/status/tracked-txs"
              element={<TrackedTxsStatusPage />}
            />
            <Route
              path="/website/status/da-tracking"
              element={<DaTrackingStatusPage />}
            />
            <Route
              path="/website/daily-checks"
              element={<DailyChecksRedirect />}
            />
            <Route
              path="/website/interop-aggregates"
              element={<InteropAggregatesPage />}
            />
            <Route
              path="/token-db"
              element={<Navigate to="/token-db/tokens" replace />}
            />
            <Route path="/token-db/tokens" element={<TokensSummaryPage />} />
            <Route
              path="/token-db/tokens/suggestions"
              element={<TokenSuggestionsPage />}
            />
            <Route
              path="/token-db/tokens/ingestion-queue"
              element={<TokenIngestionQueuePage />}
            />
            <Route
              path="/token-db/tokens/history"
              element={<TokenHistoryPage />}
            />
            <Route
              path="/token-db/tokens/relations-graph"
              element={
                <Suspense
                  fallback={
                    <AppLayout>
                      <LoadingState className="h-full" />
                    </AppLayout>
                  }
                >
                  <TokenRelationsGraphPage />
                </Suspense>
              }
            />
            <Route
              path="/token-db/tokens/tvs-coverage"
              element={<TvsCoveragePage />}
            />
            <Route path="/token-db/search/:search" element={<SearchPage />} />
            <Route path="/token-db/tokens/new" element={<AddTokensPage />} />
            <Route
              path="/token-db/tokens/:id"
              element={<AbstractTokenPage />}
            />
            <Route
              path="/token-db/tokens/:chain/:address"
              element={<DeployedTokenPage />}
            />
            <Route
              path="/token-db/chains"
              element={<TokenDbChainsSummaryPage />}
            />
            <Route path="/token-db/chains/new" element={<AddChain />} />
            <Route path="/token-db/chains/:name" element={<ChainPage />} />
            <Route
              path="/token-db/not-found"
              element={<NotFoundPage home="/token-db" />}
            />

            <Route path="/not-found" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </SidebarProvider>
      </BrowserRouter>
    </TRPCReactProvider>
  )
}
