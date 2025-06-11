import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom'
import { HomePage } from './HomePage'
import { ProjectPage } from './ProjectPage'
import { NotFoundPage } from './NotFoundPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/ui" replace />,
  },
  {
    path: '/ui',
    element: <HomePage />,
  },
  {
    path: '/ui/p/:project',
    element: <ProjectPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])

const queryClient = new QueryClient()

export function DiscoveryApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}
