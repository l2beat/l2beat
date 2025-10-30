import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Navigate, Outlet } from 'react-router-dom'
import type { AppModule } from '../createRouter'
import { HomePage } from './HomePage'
import { ProjectConfigProvider } from './hooks/useProjectConfig'
import { NewProjectPage } from './NewProjectPage'
import { ProjectPage } from './ProjectPage'

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
          element: (
            <ProjectConfigProvider>
              <ProjectPage />
            </ProjectConfigProvider>
          ),
        },
        {
          path: 'new',
          element: <NewProjectPage />,
        },
      ],
    },
  ],
}
