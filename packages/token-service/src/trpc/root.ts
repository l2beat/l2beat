import { planRouter } from './routers/plan'
import { procedure, router } from './trpc'

export const appRouter = router({
  plan: planRouter,
  test: procedure.query(() => 'Hello, world!'),
})

export type AppRouter = typeof appRouter
