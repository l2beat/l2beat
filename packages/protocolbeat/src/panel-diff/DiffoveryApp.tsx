import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { AppModule } from '../routing/utils'
import { AddressSelectionPage } from './AddressSelectionPage'
import { DiffPage } from './DiffPage'

const queryClient = new QueryClient()

export const DiffoveryAppModule: AppModule = {
  name: 'diff',
  routes: [
    {
      path: '/diff',
      element: <AddressSelectionPage />,
    },
    {
      path: '/diff/:address1/:address2',
      element: <DiffPage />,
    },
  ],
  root: (children) => {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  },
}
