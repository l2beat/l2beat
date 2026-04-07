import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { SidebarProvider } from './components/core/Sidebar'
import { Toaster } from './components/core/Sonner'
import { SuspiciousTransfersPage } from './pages/anomalies/SuspiciousTransfersPage'
import { EventDetailsPage } from './pages/events/EventDetailsPage'
import { EventsPage } from './pages/events/EventsPage'
import { KnownAppsPage } from './pages/known-apps/KnownAppsPage'
import { MessageDetailsPage } from './pages/messages/MessageDetailsPage'
import { MessagesPage } from './pages/messages/MessagesPage'
import { MissingTokensPage } from './pages/missing-tokens/MissingTokensPage'
import { NotFoundPage } from './pages/NotFoundPage'
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

            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:kind/:type" element={<EventDetailsPage />} />

            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/messages/:type" element={<MessageDetailsPage />} />
            <Route path="/known-apps" element={<KnownAppsPage />} />

            <Route path="/transfers" element={<TransfersPage />} />
            <Route path="/transfers/:type" element={<TransferDetailsPage />} />
            <Route path="/missing-tokens" element={<MissingTokensPage />} />

            <Route
              path="/insights/anomalies/suspicious-transfers"
              element={<SuspiciousTransfersPage />}
            />
            <Route path="/insights/memory" element={<StatusPage />} />
            <Route path="/not-found" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </SidebarProvider>
    </TRPCReactProvider>
  )
}
