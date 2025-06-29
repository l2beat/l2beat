import { RouterProvider } from 'react-router-dom'
import { DiscoveryAppModule } from './DiscoveryApp'
import { DiffoveryAppModule } from './panel-diff/DiffoveryApp'
import { type AppModule, createRouter } from './routing/utils'

const modules: AppModule[] = [DiscoveryAppModule, DiffoveryAppModule]

const router = createRouter(modules)

export function App() {
  return <RouterProvider router={router} />
}
