import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router'
import { DecoderApp as OldDecoderApp } from './decoder/DecoderApp'
import { DecoderApp as NewDecoderApp } from './decoder-new/DecoderApp'
import { DiscoLupe } from './discolupe/DiscoLupe'
import { Layout } from './Layout'
import { LogoGenerator } from './logo-generator/LogoGenerator'
import { MonitorApp } from './monitor/MonitorApp'
import { SimulatorApp } from './simulator/SimulatorApp'

const queryClient = new QueryClient()

// biome-ignore lint/style/noNonNullAssertion: We are sure it exists
const root = document.getElementById('root')!

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<AutoRedirect />} />
            <Route path="/decoder" element={<OldDecoderApp />} />
            <Route path="/decoder-new" element={<NewDecoderApp />} />
            <Route path="/simulator" element={<SimulatorApp />} />
            <Route path="/discolupe" element={<DiscoLupe />} />
            <Route path="/logo-generator" element={<LogoGenerator />} />
            <Route path="/monitor" element={<MonitorApp />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
)

function AutoRedirect() {
  const navigate = useNavigate()
  useEffect(() => {
    navigate('/decoder')
  }, [])
  return null
}
