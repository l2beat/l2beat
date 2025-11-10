import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { abstractTokensRouter } from './routers/abstractTokens'
import { chainsRouter } from './routers/chains'
import { coingeckoRouter } from './routers/coingecko'
import { deployedTokensRouter } from './routers/deployedTokens'
import { planRouter } from './routers/plan'
import { searchRouter } from './routers/search'
import { router } from './trpc'

export const appRouter = router({
  plan: planRouter,
  chains: chainsRouter,
  abstractTokens: abstractTokensRouter,
  deployedTokens: deployedTokensRouter,
  search: searchRouter,
  coingecko: coingeckoRouter,
})

export type AppRouter = typeof appRouter
export type RouterOutputs = inferRouterOutputs<AppRouter>
export type RouterInputs = inferRouterInputs<AppRouter>
