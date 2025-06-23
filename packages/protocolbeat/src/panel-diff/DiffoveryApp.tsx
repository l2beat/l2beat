import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { AppModule } from '../routing/utils'
import { AddressSelectionPage } from './AddressSelectionPage'
import { DiffPage } from './DiffPage'
import { Outlet } from 'react-router-dom'

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
