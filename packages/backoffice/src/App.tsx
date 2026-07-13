import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { SidebarProvider } from './components/core/Sidebar'
import { Toaster } from './components/core/Sonner'
import {
  EnvironmentProvider,
  useEnvironment,
} from './components/environment/EnvironmentContext'
import { ActivityDetailsPage } from './pages/interop/activity/ActivityDetailsPage'
import { ActivityPage } from './pages/interop/activity/ActivityPage'
import { SuspiciousTransfersPage } from './pages/interop/activity/SuspiciousTransfersPage'
import { AggregatesPage } from './pages/interop/aggregates/AggregatesPage'
import { ChainsSummaryPage } from './pages/interop/chains-summary/ChainsSummaryPage'
import { CoveragePiesPage } from './pages/interop/coverage-pies/CoveragePiesPage'
import { EventDetailsPage } from './pages/interop/events/EventDetailsPage'
import { EventsPage } from './pages/interop/events/EventsPage'
import { FinancialsPage } from './pages/interop/financials/FinancialsPage'
import { HighlightsPage } from './pages/interop/highlights/HighlightsPage'
import { KnownAppsPage } from './pages/interop/known-apps/KnownAppsPage'
import { MemoryPage } from './pages/interop/memory/MemoryPage'
import { MessageDetailsPage } from './pages/interop/messages/MessageDetailsPage'
import { MessagesPage } from './pages/interop/messages/MessagesPage'
import { MissingTokensPage } from './pages/interop/missing-tokens/MissingTokensPage'
import { ProcessorStatusesPage } from './pages/interop/processor-statuses/ProcessorStatusesPage'
import { PromotionPage } from './pages/interop/promotion/PromotionPage'
import { StatusPage } from './pages/interop/status/StatusPage'
import { SummaryPage } from './pages/interop/summary/SummaryPage'
import { TransferDetailsPage } from './pages/interop/transfers/TransferDetailsPage'
import { TransfersPage } from './pages/interop/transfers/TransfersPage'
import { BackofficeLandingPage } from './pages/landing/BackofficeLandingPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { InteropAggregatesPage } from './pages/website/interop-aggregates/InteropAggregatesPage'
import { DaTrackingStatusPage } from './pages/website/status/da-tracking/DaTrackingStatusPage'
import { TrackedTxsStatusPage } from './pages/website/status/tracked-txs/TrackedTxsStatusPage'
import { TRPCReactProvider } from './react-query/trpc'

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
      <SidebarProvider>
        <BrowserRouter>
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
              path="/interop/missing-tokens"
              element={<MissingTokensPage />}
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
              path="/interop/insights/coverage-pies"
              element={<CoveragePiesPage />}
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
              path="/website/interop-aggregates"
              element={<InteropAggregatesPage />}
            />
            <Route path="/not-found" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </SidebarProvider>
    </TRPCReactProvider>
  )
}
