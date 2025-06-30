import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { DiscoveryAppModule } from './DiscoveryApp'
import { DiffoveryAppModule } from './panel-diff/DiffoveryApp'
import { type AppModule, createRouter } from './routing/utils'

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
