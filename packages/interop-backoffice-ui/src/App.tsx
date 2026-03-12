import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { SidebarProvider } from './components/core/Sidebar'
import { Toaster } from './components/core/Sonner'
import { NotFoundPage } from './pages/NotFoundPage'
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
            <Route path="/tokens" element={<SummaryPage />} />
            <Route path="/not-found" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </SidebarProvider>
    </TRPCReactProvider>
  )
}
