import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { publicProcedure, router } from './trpc'

export const appRouter = router({
  hello: publicProcedure.query(() => {
    return { greeting: 'hello world' }
  }),
})

export type AppRouter = typeof appRouter
export type RouterOutputs = inferRouterOutputs<AppRouter>
export type RouterInputs = inferRouterInputs<AppRouter>
