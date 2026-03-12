import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { SidebarProvider } from './components/core/Sidebar'
import { Toaster } from './components/core/Sonner'
import { NotFoundPage } from './pages/NotFoundPage'
import { PluginStatusesPage } from './pages/plugin-statuses/PluginStatusesPage'
import { SummaryEventsPage } from './pages/summary/events/SummaryEventsPage'
import { SummaryMessagesPage } from './pages/summary/messages/SummaryMessagesPage'
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
            <Route path="/summary/events" element={<SummaryEventsPage />} />
            <Route path="/summary/messages" element={<SummaryMessagesPage />} />
            <Route path="/plugin-statuses" element={<PluginStatusesPage />} />
            <Route path="/not-found" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </SidebarProvider>
    </TRPCReactProvider>
  )
}
