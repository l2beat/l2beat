import { RouterProvider } from 'react-router-dom'
import { CodeAppModule } from './apps/code/CodeApp'
import { type AppModule, createRouter } from './apps/createRouter'
import { DiscoveryAppModule } from './DiscoveryApp'
import { DiffoveryAppModule } from './panel-diff/DiffoveryApp'

const modules: AppModule[] = [
  DiscoveryAppModule,
  DiffoveryAppModule,
  CodeAppModule,
]

const router = createRouter(modules)

export function App() {
  return <RouterProvider router={router} />
}
