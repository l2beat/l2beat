import { HttpClient, Logger } from '@l2beat/shared'
import { ChainId, ProjectId } from '@l2beat/shared-pure'

import { Config } from '../../config'
import { Clock } from '../../core/Clock'
import { PriceUpdater } from '../../core/PriceUpdater'
import { OPTIMISM_MULTICALL_CONFIG } from '../../peripherals/ethereum/multicall/MulticallConfig'
import { TvlSubmodule } from '../ApplicationModule'
import { chainTvlSubmodule } from './ChainTvlSubmodule'
import { TvlDatabase } from './types'

export function createOptimismTvlSubmodule(
  db: TvlDatabase,
  priceUpdater: PriceUpdater,
  config: Config,
  logger: Logger,
  http: HttpClient,
  clock: Clock,
): TvlSubmodule | undefined {
  return chainTvlSubmodule(
    ChainId.OPTIMISM,
    ProjectId.OPTIMISM,
    config.tvl.optimism,
    config.tokens,
    OPTIMISM_MULTICALL_CONFIG,
    db,
    priceUpdater,
    http,
    clock,
    logger,
  )
}
