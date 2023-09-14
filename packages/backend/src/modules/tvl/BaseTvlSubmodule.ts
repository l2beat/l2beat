import { HttpClient, Logger } from '@l2beat/shared'
import { ChainId, ProjectId } from '@l2beat/shared-pure'

import { Config } from '../../config'
import { Clock } from '../../core/Clock'
import { PriceUpdater } from '../../core/PriceUpdater'
import { BASE_MULTICALL_CONFIG } from '../../peripherals/ethereum/MulticallConfig'
import { TvlSubmodule } from '../ApplicationModule'
import { chainTvlSubmodule } from './ChainTvlSubmodule'
import { TvlDatabase } from './types'

export function createBaseTvlSubmodule(
  db: TvlDatabase,
  priceUpdater: PriceUpdater,
  config: Config,
  logger: Logger,
  http: HttpClient,
  clock: Clock,
): TvlSubmodule | undefined {
  return chainTvlSubmodule(
    'BaseTvlModule',
    ChainId.BASE,
    ProjectId.BASE,
    config.tvl.base,
    config.tokens,
    BASE_MULTICALL_CONFIG,
    db,
    priceUpdater,
    http,
    clock,
    logger,
  )
}
