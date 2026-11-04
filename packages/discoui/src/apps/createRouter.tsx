import { createBrowserRouter, type RouteObject } from 'react-router'
import { NotFoundPage } from './discovery/NotFoundPage'
import { AppErrorPage } from './error/AppErrorPage'

export interface AppModule {
  routes: RouteObject[]
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

  return createBrowserRouter([
    { errorElement: <AppErrorPage />, children: routers },
  ])
}
