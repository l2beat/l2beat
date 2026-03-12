import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { helloRouter } from './routers/hello'
import { router } from './trpc'

interface AppRouterDeps {}

export function createAppRouter(_: AppRouterDeps) {
  return router({
    hello: helloRouter,
  })
}

export type AppRouter = ReturnType<typeof createAppRouter>
export type RouterOutputs = inferRouterOutputs<AppRouter>
export type RouterInputs = inferRouterInputs<AppRouter>
