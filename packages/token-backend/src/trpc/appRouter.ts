import { chainsRouter } from './routers/chains'
import { coingeckoRouter } from './routers/coingecko'
import { planRouter } from './routers/plan'
import { tokensRouter } from './routers/tokens'
import { router } from './trpc'

export const appRouter = router({
  plan: planRouter,
  chains: chainsRouter,
  tokens: tokensRouter,
  coingecko: coingeckoRouter,
})

export type AppRouter = typeof appRouter
