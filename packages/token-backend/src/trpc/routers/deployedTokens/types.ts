import type { ChainRecord } from '@l2beat/database/dist/repositories/ChainRepository'
import type { Chain } from '../../../chains/Chain'
import type { CoingeckoClient } from '../../../chains/clients/coingecko/CoingeckoClient'

export interface DeployedTokensRouterDeps {
  coingeckoClient: CoingeckoClient
  etherscanApiKey: string | undefined
  createChain?: (chainRecord: ChainRecord) => Chain
}
