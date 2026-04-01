import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { SidebarProvider } from './components/core/Sidebar'
import { Toaster } from './components/core/Sonner'
import { EventDetailsPage } from './pages/events/EventDetailsPage'
import { EventsPage } from './pages/events/EventsPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { StatusPage } from './pages/status/StatusPage'
import { SummaryPage } from './pages/summary/SummaryPage'
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
            <Route path="/summary/events" element={<EventsPage />} />
            <Route
              path="/summary/events/:kind/:type"
              element={<EventDetailsPage />}
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
