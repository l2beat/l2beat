import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Navigate, Outlet } from 'react-router-dom'
import { HomePage } from './HomePage'
import { ProjectPage } from './ProjectPage'
import type { AppModule } from './routing/utils'

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
      element: (
        <QueryClientProvider client={queryClient}>
          <Outlet />
        </QueryClientProvider>
      ),
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
          path: 'p/:project',
          element: <ProjectPage />,
        },
      ],
    },
  ],
}
