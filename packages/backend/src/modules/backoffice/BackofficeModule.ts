import Router from '@koa/router'
import type { Database } from '@l2beat/database'
import type { Config } from '../../config'
import { createTRPCContext } from '../../trpc/context'
import { createKoaMiddleware } from '../../trpc/koa-middleware'
import type { InteropTrpcRouter } from '../interop/engine/dashboard/trpc/router'
import type { ApplicationModule } from '../types'
import { type AppRouter, createAppRouter } from './appRouter'

interface BackofficeModuleDependencies {
  config: Config
  db: Database
  subRouters: {
    interop?: InteropTrpcRouter
  }
}

export function createBackofficeModule({
  config,
  db,
  subRouters,
}: BackofficeModuleDependencies): ApplicationModule | undefined {
  if (!subRouters.interop) {
    return
  }

  const appRouter: AppRouter = createAppRouter({
    interop: subRouters.interop,
  })

  const auth = config.interop ? config.interop.dashboard.auth : false

  const router = new Router()
  router.all(
    ['/trpc', '/trpc/(.*)'],
    createKoaMiddleware({
      router: appRouter,
      prefix: '/trpc',
      allowMethodOverride: true,
      createContext: ({ req }) =>
        createTRPCContext({
          headers: new Headers(req.headers as Record<string, string>),
          db,
          auth,
        }),
    }),
  )

  return { routers: [router] }
}
