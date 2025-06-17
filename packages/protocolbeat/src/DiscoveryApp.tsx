import { Navigate } from 'react-router-dom'
import { HomePage } from './HomePage'
import { ProjectPage } from './ProjectPage'
import type { AppModule } from './routing/utils'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export const DiscoveryAppModule: AppModule = {
  name: 'discovery',
  routes: [
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
  ],
  root: (children) => {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  },
}
