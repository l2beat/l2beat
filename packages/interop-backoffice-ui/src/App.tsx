import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { SidebarProvider } from './components/core/Sidebar'
import { Toaster } from './components/core/Sonner'
import { NotFoundPage } from './pages/NotFoundPage'
import { PluginStatusesPage } from './pages/plugin-statuses/PluginStatusesPage'
import { SummaryEventDetailsPage } from './pages/summary/events/SummaryEventDetailsPage'
import { SummaryEventsPage } from './pages/summary/events/SummaryEventsPage'
import { SummaryKnownAppsPage } from './pages/summary/known-apps/SummaryKnownAppsPage'
import { SummaryMessageDetailsPage } from './pages/summary/messages/SummaryMessageDetailsPage'
import { SummaryMessagesPage } from './pages/summary/messages/SummaryMessagesPage'
import { SummaryMissingTokensPage } from './pages/summary/missing-tokens/SummaryMissingTokensPage'
import { SummaryPage } from './pages/summary/SummaryPage'
import { SummaryTransferDetailsPage } from './pages/summary/transfers/SummaryTransferDetailsPage'
import { SummaryTransfersPage } from './pages/summary/transfers/SummaryTransfersPage'
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
            <Route path="/summary/events" element={<SummaryEventsPage />} />
            <Route
              path="/summary/events/:kind/:type"
              element={<SummaryEventDetailsPage />}
            />
            <Route
              path="/interop/events/:kind/:type"
              element={<SummaryEventDetailsPage />}
            />
            <Route path="/summary/messages" element={<SummaryMessagesPage />} />
            <Route
              path="/summary/known-apps"
              element={<SummaryKnownAppsPage />}
            />
            <Route
              path="/summary/messages/:type"
              element={<SummaryMessageDetailsPage />}
            />
            <Route
              path="/interop/messages/:type"
              element={<SummaryMessageDetailsPage />}
            />
            <Route
              path="/summary/transfers"
              element={<SummaryTransfersPage />}
            />
            <Route
              path="/summary/missing-tokens"
              element={<SummaryMissingTokensPage />}
            />
            <Route
              path="/summary/transfers/:type"
              element={<SummaryTransferDetailsPage />}
            />
            <Route
              path="/interop/transfers/:type"
              element={<SummaryTransferDetailsPage />}
            />
            <Route path="/plugin-statuses" element={<PluginStatusesPage />} />
            <Route path="/not-found" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </SidebarProvider>
    </TRPCReactProvider>
  )
}
