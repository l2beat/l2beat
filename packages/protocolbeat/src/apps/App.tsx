import { RouterProvider } from 'react-router-dom'
import { CodeAppModule } from './code/CodeApp'
import { DiffoveryAppModule } from './diffovery/DiffoveryApp'
import { DiscoveryAppModule } from './discovery/DiscoveryApp'
import { type AppModule, createRouter } from './utils'

const modules: AppModule[] = [
  DiscoveryAppModule,
  DiffoveryAppModule,
  CodeAppModule,
]

const router = createRouter(modules)

export function App() {
  return <RouterProvider router={router} />
}
