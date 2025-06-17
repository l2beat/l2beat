import { type RouteObject, createBrowserRouter } from 'react-router-dom'
import { NotFoundPage } from '../NotFoundPage'

export interface AppModule {
  routes: RouteObject[]
  root?: (
    children: React.ReactNode | React.ReactNode[] | undefined,
  ) => React.ReactNode
  name: string
}

export function createRouter(
  modules: AppModule[],
): ReturnType<typeof createBrowserRouter> {
  const routers: RouteObject[] = []

  for (const module of modules) {
    routers.push(...module.routes)
  }

  routers.push({
    path: '*',
    element: <NotFoundPage />,
  })

  return createBrowserRouter(routers)
}
