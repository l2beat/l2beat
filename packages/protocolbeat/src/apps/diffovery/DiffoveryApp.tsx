import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Outlet } from 'react-router-dom'
import type { AppModule } from '../createRouter'
import { AddressSelectionPage } from './AddressSelectionPage'
import { DiffPage } from './DiffPage'

const queryClient = new QueryClient()

export const DiffoveryAppModule: AppModule = {
  name: 'diff',
  routes: [
    {
      path: '/diff',
      element: (
        <QueryClientProvider client={queryClient}>
          <Outlet />
        </QueryClientProvider>
      ),
      children: [
        {
          index: true,
          element: <AddressSelectionPage />,
        },
        {
          path: ':address1/:address2',
          element: <DiffPage />,
        },
      ],
    },
  ],
}
