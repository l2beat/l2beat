import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { SidebarProvider } from './components/core/Sidebar'
import { Toaster } from './components/core/Sonner'
import { routes } from './routes'

const router = createBrowserRouter(routes)
const queryClient = new QueryClient()

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <Toaster />
        <RouterProvider router={router} />
      </SidebarProvider>
    </QueryClientProvider>
  )
}
