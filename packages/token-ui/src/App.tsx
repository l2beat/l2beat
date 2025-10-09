import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { SidebarProvider } from './components/core/Sidebar'
import { Toaster } from './components/core/Sonner'
import { TRPCReactProvider } from './react-query/trpc'
import { routes } from './routes'

const router = createBrowserRouter(routes)

export function App() {
  return (
    <TRPCReactProvider>
      <SidebarProvider>
        <Toaster />
        <RouterProvider router={router} />
      </SidebarProvider>
    </TRPCReactProvider>
  )
}
