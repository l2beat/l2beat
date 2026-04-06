import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { LandingPage } from './pages/landing/LandingPage'
import { ProtocolsPage } from './pages/protocols/ProtocolsPage'
import { ReviewPage } from './pages/review/ReviewPage'
import { ComparePage } from './pages/compare/ComparePage'
import { AboutPage } from './pages/about/AboutPage'
import { GalleryPage } from './pages/gallery/GalleryPage'

const queryClient = new QueryClient()

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<LandingPage />} />
            <Route path="/protocols" element={<ProtocolsPage />} />
            <Route path="/protocol/:slug" element={<ReviewPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
