import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { createRouter, type AppModule } from './routing/utils'
import { DiscoveryAppModule } from './DiscoveryApp'
import { DiffoveryAppModule } from './panel-diff/DiffoveryApp'

const modules: AppModule[] = [DiscoveryAppModule, DiffoveryAppModule]

const router = createRouter(modules)

const queryClient = new QueryClient()

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}
