import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import type { CoingeckoClient } from '../chains/clients/coingecko/CoingeckoClient'
import { abstractTokensRouter } from './routers/abstractTokens'
import { chainsRouter } from './routers/chains'
import { deployedTokensRouter } from './routers/deployedTokens'
import { planRouter } from './routers/plan'
import { searchRouter } from './routers/search'
import { router } from './trpc'

export function createAppRouter({
  coingeckoClient,
}: {
  coingeckoClient: CoingeckoClient
}) {
  return router({
    plan: planRouter,
    chains: chainsRouter,
    abstractTokens: abstractTokensRouter({ coingeckoClient }),
    deployedTokens: deployedTokensRouter({ coingeckoClient }),
    search: searchRouter,
  })
}

export type AppRouter = ReturnType<typeof createAppRouter>
export type RouterOutputs = inferRouterOutputs<AppRouter>
export type RouterInputs = inferRouterInputs<AppRouter>
