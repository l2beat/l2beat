import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Navigate, Outlet } from 'react-router-dom'
import type { AppModule } from '../createRouter'
import { NotificationsRoot } from './components/Notifications'
import { ConfigHealthReportPage } from './ConfigHealthReportPage'
import { HomePage } from './HomePage'
import { ConfigModelsProvider } from './hooks/useConfigModels'
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
            <ConfigModelsProvider>
              <NotificationsRoot />
              <ProjectPage />
            </ConfigModelsProvider>
          ),
        },
        {
          path: 'new',
          element: <NewProjectPage />,
        },
        {
          path: 'reports/config-health',
          element: <ConfigHealthReportPage />,
        },
      ],
    },
  ],
}
