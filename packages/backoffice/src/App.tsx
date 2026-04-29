import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { SidebarProvider } from './components/core/Sidebar'
import { Toaster } from './components/core/Sonner'
import { EnvironmentProvider } from './components/environment/EnvironmentContext'
import { AggregatesPage } from './pages/interop/aggregates/AggregatesPage'
import { AnomaliesPage } from './pages/interop/anomalies/AnomaliesPage'
import { AnomalyDetailsPage } from './pages/interop/anomalies/AnomalyDetailsPage'
import { SuspiciousTransfersPage } from './pages/interop/anomalies/SuspiciousTransfersPage'
import { CoveragePiesPage } from './pages/interop/coverage-pies/CoveragePiesPage'
import { EventDetailsPage } from './pages/interop/events/EventDetailsPage'
import { EventsPage } from './pages/interop/events/EventsPage'
import { FinancialActionsPage } from './pages/interop/financials/FinancialActionsPage'
import { KnownAppsPage } from './pages/interop/known-apps/KnownAppsPage'
import { MemoryPage } from './pages/interop/memory/MemoryPage'
import { MessageDetailsPage } from './pages/interop/messages/MessageDetailsPage'
import { MessagesPage } from './pages/interop/messages/MessagesPage'
import { MissingTokensPage } from './pages/interop/missing-tokens/MissingTokensPage'
import { ProcessorStatusesPage } from './pages/interop/processor-statuses/ProcessorStatusesPage'
import { StatusPage } from './pages/interop/status/StatusPage'
import { SummaryPage } from './pages/interop/summary/SummaryPage'
import { TransferDetailsPage } from './pages/interop/transfers/TransferDetailsPage'
import { TransfersPage } from './pages/interop/transfers/TransfersPage'
import { BackofficeLandingPage } from './pages/landing/BackofficeLandingPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { TRPCReactProvider } from './react-query/trpc'

export function App() {
  return (
    <EnvironmentProvider>
      <TRPCReactProvider>
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

              <Route
                path="/interop/financials/actions"
                element={<FinancialActionsPage />}
              />
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
                path="/interop/insights/anomalies"
                element={<AnomaliesPage />}
              />
              <Route
                path="/interop/insights/anomalies/aggregate/:id"
                element={<AnomalyDetailsPage />}
              />
              <Route
                path="/interop/insights/anomalies/suspicious-transfers"
                element={<SuspiciousTransfersPage />}
              />
              <Route
                path="/interop/insights/coverage-pies"
                element={<CoveragePiesPage />}
              />
              <Route path="/interop/insights/memory" element={<MemoryPage />} />
              <Route path="/not-found" element={<NotFoundPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </SidebarProvider>
      </TRPCReactProvider>
    </EnvironmentProvider>
  )
}
