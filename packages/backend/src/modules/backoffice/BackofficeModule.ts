import Router from '@koa/router'
import type { Database } from '@l2beat/database'
import type { AnyTRPCRouter } from '@trpc/server'
import type { Config } from '../../config'
import { createTRPCContext } from '../../trpc/context'
import { createKoaMiddleware } from '../../trpc/koa-middleware'
import type { ApplicationModule, TrpcContribution } from '../types'
import { createBackendAppRouter } from './appRouter'

interface BackofficeModuleDependencies<
  T extends readonly TrpcContribution<string, AnyTRPCRouter>[],
> {
  config: Config
  db: Database
  trpcContributions: T
}

export function createBackofficeModule<
  T extends readonly TrpcContribution<string, AnyTRPCRouter>[],
>({
  config,
  db,
  trpcContributions,
}: BackofficeModuleDependencies<T>): ApplicationModule | undefined {
  if (trpcContributions.length === 0) {
    return
  }

  const appRouter = createBackendAppRouter(trpcContributions)
  const auth = config.backoffice ? config.backoffice.auth : false
  const enabled = new Set(trpcContributions.map((c) => c.namespace))

  const trpc = createKoaMiddleware({
    router: appRouter,
    prefix: '/trpc',
    allowMethodOverride: true,
    createContext: ({ req }) =>
      createTRPCContext({
        headers: new Headers(req.headers as Record<string, string>),
        db,
        auth,
      }),
  })

  const router = new Router()
  router.all(['/trpc', '/trpc/(.*)'], (ctx, next) => {
    const path = ctx.request.path.slice('/trpc/'.length)
    const ns = extractNamespace(path)
    if (ns && !enabled.has(ns)) {
      ctx.status = 503
      ctx.body = { error: { code: 'MODULE_DISABLED', namespace: ns } }
      return
    }
    return trpc(ctx, next)
  })

  return { routers: [router] }
}

// Returns the namespace prefix only for single-procedure calls. Batch
// requests (`?batch=1`, comma-separated paths) bypass the guard and fall
// through to tRPC, which yields NOT_FOUND per missing procedure.
function extractNamespace(path: string): string | undefined {
  if (path.length === 0 || path.includes(',')) return
  const dotIdx = path.indexOf('.')
  return dotIdx === -1 ? undefined : path.slice(0, dotIdx)
}
