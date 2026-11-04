import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router'
import { DecoderApp } from './decoder/DecoderApp'
import { Layout } from './Layout'
import { MonitorApp } from './monitor/MonitorApp'
import { SimulatorApp } from './simulator/SimulatorApp'
import { BlockPage as UopsBlockPage } from './uops/BlockPage'
import { StatsPage as UopsStatsPage } from './uops/StatsPage'

const queryClient = new QueryClient()

// biome-ignore lint/style/noNonNullAssertion: We are sure it exists
const root = document.getElementById('root')!

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<DecoderRedirect />} />
            <Route path="/decoder" element={<DecoderApp />} />
            <Route path="/decoder-3" element={<DecoderRedirect />} />
            <Route path="/decoder-new" element={<DecoderRedirect />} />
            <Route path="/simulator" element={<SimulatorApp />} />
            <Route path="/monitor" element={<MonitorApp />} />
            <Route path="/uops" element={<UopsBlockPage />} />
            <Route path="/uops/stats" element={<UopsStatsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
)

function DecoderRedirect() {
  const location = useLocation()
  return <Navigate to={`/decoder${location.search}${location.hash}`} replace />
}
