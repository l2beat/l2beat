import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Outlet } from 'react-router-dom'
import type { AppModule } from '../routing/utils'
import { AddressSelectionPage } from './AddressSelectionPage'
import { CodePage } from './CodePage'

const queryClient = new QueryClient()

export const CodeAppModule: AppModule = {
  name: 'code',
  routes: [
    {
      path: '/address',
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
          path: ':address',
          element: <CodePage />,
        },
      ],
    },
  ],
}
