import { RouterProvider } from 'react-router/dom'
import { CodeAppModule } from './apps/code/CodeApp'
import { type AppModule, createRouter } from './apps/createRouter'
import { DiffoveryAppModule } from './apps/diffovery/DiffoveryApp'
import { DiscoveryAppModule } from './apps/discovery/DiscoveryApp'
import { useApplyTheme } from './theme'

const modules: AppModule[] = [
  DiscoveryAppModule,
  DiffoveryAppModule,
  CodeAppModule,
]

const router = createRouter(modules)

export function App() {
  useApplyTheme()
  return <RouterProvider router={router} />
}
