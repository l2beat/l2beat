import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { SidebarProvider } from './components/core/Sidebar'
import { Toaster } from './components/core/Sonner'
import { MainPage } from './pages/MainPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { SearchPage } from './pages/search/SearchPage'
import { AbstractTokenPage } from './pages/tokens/AbstractTokenPage'
import { AddTokensPage } from './pages/tokens/add-tokens/AddTokensPage'
import { DeployedTokenPage } from './pages/tokens/DeployedTokenPage'
import { TRPCReactProvider } from './react-query/trpc'

export function App() {
  return (
    <TRPCReactProvider>
      <SidebarProvider>
        <BrowserRouter>
          <Toaster />
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/search/:search" element={<SearchPage />} />
            <Route path="/tokens/new" element={<AddTokensPage />} />
            <Route path="/tokens/:id" element={<AbstractTokenPage />} />
            <Route
              path="/tokens/:chain/:address"
              element={<DeployedTokenPage />}
            />
            <Route path="/not-found" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </SidebarProvider>
    </TRPCReactProvider>
  )
}
