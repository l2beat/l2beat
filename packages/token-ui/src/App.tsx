import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { SidebarProvider } from './components/core/Sidebar'
import { Toaster } from './components/core/Sonner'
import { AddChain } from './pages/chains/AddChain'
import { ChainPage } from './pages/chains/ChainPage'
import { ChainsSummaryPage } from './pages/chains/ChainsSummaryPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { SearchPage } from './pages/search/SearchPage'
import { AbstractTokenPage } from './pages/tokens/AbstractTokenPage'
import { AddTokensPage } from './pages/tokens/add-tokens/AddTokensPage'
import { DeployedTokenPage } from './pages/tokens/DeployedTokenPage'
import { TokensSummaryPage } from './pages/tokens/TokensSummaryPage'
import { TRPCReactProvider } from './react-query/trpc'

export function App() {
  return (
    <TRPCReactProvider>
      <SidebarProvider>
        <BrowserRouter>
          <ReactQueryDevtools initialIsOpen={false} />

          <Toaster />
          <Routes>
            <Route path="/" element={<TokensSummaryPage />} />
            <Route path="/tokens" element={<TokensSummaryPage />} />
            <Route path="/search/:search" element={<SearchPage />} />
            <Route path="/tokens/new" element={<AddTokensPage />} />
            <Route path="/tokens/:id" element={<AbstractTokenPage />} />
            <Route
              path="/tokens/:chain/:address"
              element={<DeployedTokenPage />}
            />
            <Route path="/chains" element={<ChainsSummaryPage />} />
            <Route path="/chains/new" element={<AddChain />} />
            <Route path="/chains/:name" element={<ChainPage />} />
            <Route path="/not-found" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </SidebarProvider>
    </TRPCReactProvider>
  )
}
