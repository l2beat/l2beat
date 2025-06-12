import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { AddressSelectionPage } from './AddressSelectionPage'
import { DiffPage } from './DiffPage'

const router = createBrowserRouter([
  {
    path: '/diff',
    element: <AddressSelectionPage />,
  },
  {
    path: '/diff/:address1/:address2',
    element: <DiffPage />,
  },
])

const queryClient = new QueryClient()

export function DiffoveryApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}
