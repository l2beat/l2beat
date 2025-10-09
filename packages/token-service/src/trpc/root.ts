import { chainsRouter } from './routers/chains'
import { planRouter } from './routers/plan'
import { tokensRouter } from './routers/tokens'
import { router } from './trpc'

export const appRouter = router({
  plan: planRouter,
  chains: chainsRouter,
  tokens: tokensRouter,
})

export type AppRouter = typeof appRouter
