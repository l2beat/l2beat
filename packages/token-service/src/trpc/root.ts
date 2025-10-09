import { chainsRouter } from './routers/chains'
import { planRouter } from './routers/plan'
import { router } from './trpc'

export const appRouter = router({
  plan: planRouter,
  chains: chainsRouter,
})

export type AppRouter = typeof appRouter
