import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router'
import { Layout } from './Layout'
import { DecoderApp } from './decoder/DecoderApp'
import { DiscoLupe } from './discolupe/DiscoLupe'
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
            <Route path="/decoder" element={<DecoderApp />} />
            <Route path="/simulator" element={<SimulatorApp />} />
            <Route path="/discolupe" element={<DiscoLupe />} />
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
