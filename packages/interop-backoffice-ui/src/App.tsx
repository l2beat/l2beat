import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { SidebarProvider } from './components/core/Sidebar'
import { Toaster } from './components/core/Sonner'
import { AggregatesPage } from './pages/aggregates/AggregatesPage'
import { AnomaliesPage } from './pages/anomalies/AnomaliesPage'
import { AnomalyDetailsPage } from './pages/anomalies/AnomalyDetailsPage'
import { SuspiciousTransfersPage } from './pages/anomalies/SuspiciousTransfersPage'
import { EventDetailsPage } from './pages/events/EventDetailsPage'
import { EventsPage } from './pages/events/EventsPage'
import { FinancialActionsPage } from './pages/financials/FinancialActionsPage'
import { KnownAppsPage } from './pages/known-apps/KnownAppsPage'
import { MemoryPage } from './pages/memory/MemoryPage'
import { MessageDetailsPage } from './pages/messages/MessageDetailsPage'
import { MessagesPage } from './pages/messages/MessagesPage'
import { MissingTokensPage } from './pages/missing-tokens/MissingTokensPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ProcessorStatusesPage } from './pages/processor-statuses/ProcessorStatusesPage'
import { StatusPage } from './pages/status/StatusPage'
import { SummaryPage } from './pages/summary/SummaryPage'
import { TransferDetailsPage } from './pages/transfers/TransferDetailsPage'
import { TransfersPage } from './pages/transfers/TransfersPage'
import { TRPCReactProvider } from './react-query/trpc'

export function App() {
  return (
    <TRPCReactProvider>
      <SidebarProvider>
        <BrowserRouter>
          <ReactQueryDevtools initialIsOpen={false} />

          <Toaster />
          <Routes>
            <Route path="/" element={<SummaryPage />} />

            <Route path="/aggregates" element={<AggregatesPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:kind/:type" element={<EventDetailsPage />} />

            <Route
              path="/financials/actions"
              element={<FinancialActionsPage />}
            />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/messages/:type" element={<MessageDetailsPage />} />
            <Route path="/known-apps" element={<KnownAppsPage />} />
            <Route
              path="/indexing/processor-statuses"
              element={<ProcessorStatusesPage />}
            />

            <Route path="/transfers" element={<TransfersPage />} />
            <Route path="/transfers/:type" element={<TransferDetailsPage />} />
            <Route path="/missing-tokens" element={<MissingTokensPage />} />
            <Route path="/indexing/plugin-statuses" element={<StatusPage />} />

            <Route path="/insights/anomalies" element={<AnomaliesPage />} />
            <Route
              path="/insights/anomalies/aggregate/:id"
              element={<AnomalyDetailsPage />}
            />
            <Route
              path="/insights/anomalies/suspicious-transfers"
              element={<SuspiciousTransfersPage />}
            />
            <Route path="/insights/memory" element={<MemoryPage />} />
            <Route path="/not-found" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </SidebarProvider>
    </TRPCReactProvider>
  )
}
