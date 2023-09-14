import { HttpClient, Logger } from '@l2beat/shared'
import { ChainId, ProjectId } from '@l2beat/shared-pure'

import { Config } from '../../config'
import { ARBITRUM_BALANCE_ENCODING } from '../../core/balances/BalanceProvider'
import { Clock } from '../../core/Clock'
import { PriceUpdater } from '../../core/PriceUpdater'
import { ARBITRUM_MULTICALL_CONFIG } from '../../peripherals/ethereum/multicall/MulticallConfig'
import { TvlSubmodule } from '../ApplicationModule'
import { chainTvlSubmodule } from './ChainTvlSubmodule'
import { TvlDatabase } from './types'

export function createArbitrumTvlSubmodule(
  db: TvlDatabase,
  priceUpdater: PriceUpdater,
  config: Config,
  logger: Logger,
  http: HttpClient,
  clock: Clock,
): TvlSubmodule | undefined {
  return chainTvlSubmodule(
    'ArbitrumTvlModule',
    ChainId.ARBITRUM,
    ProjectId.ARBITRUM,
    config.tvl.arbitrum,
    config.tokens,
    ARBITRUM_MULTICALL_CONFIG,
    ARBITRUM_BALANCE_ENCODING,
    db,
    priceUpdater,
    http,
    clock,
    logger,
  )
}
