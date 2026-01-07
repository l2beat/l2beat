import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import type { CoingeckoClient } from '../chains/clients/coingecko/CoingeckoClient'
import { abstractTokensRouter } from './routers/abstractTokens'
import { chainsRouter } from './routers/chains'
import { deployedTokensRouter } from './routers/deployedTokens'
import { planRouter } from './routers/plan'
import { searchRouter } from './routers/search'
import { router } from './trpc'

interface AppRouterDeps {
  coingeckoClient: CoingeckoClient
  etherscanApiKey: string | undefined
}

export function createAppRouter({
  coingeckoClient,
  etherscanApiKey,
}: AppRouterDeps) {
  return router({
    plan: planRouter,
    chains: chainsRouter({ etherscanApiKey }),
    abstractTokens: abstractTokensRouter({ coingeckoClient }),
    deployedTokens: deployedTokensRouter({ coingeckoClient, etherscanApiKey }),
    search: searchRouter,
  })
}

export type AppRouter = ReturnType<typeof createAppRouter>
export type RouterOutputs = inferRouterOutputs<AppRouter>
export type RouterInputs = inferRouterInputs<AppRouter>
