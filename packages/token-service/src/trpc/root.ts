import { planRouter } from './routers/plan'
import { protectedProcedure, router } from './trpc'

export const appRouter = router({
  plan: planRouter,
  test: protectedProcedure.query(() => 'Hello, world!'),
})

export type AppRouter = typeof appRouter
