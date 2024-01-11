import { Logger } from '@l2beat/backend-tools'
import { CoingeckoQueryService, HttpClient } from '@l2beat/shared'
import { ChainId, ProjectId } from '@l2beat/shared-pure'

import { Config } from '../../config'
import { Clock } from '../../core/Clock'
import { PriceUpdater } from '../../core/PriceUpdater'
import { MANTA_PACIFIC_MULTICALL_CONFIG } from '../../peripherals/ethereum/multicall/MulticallConfig'
import { TvlSubmodule } from '../ApplicationModule'
import { chainTvlSubmodule } from './ChainTvlSubmodule'
import { TvlDatabase } from './types'

export function createMantaTvlSubmodule(
  db: TvlDatabase,
  priceUpdater: PriceUpdater,
  coingeckoQueryService: CoingeckoQueryService,
  config: Config,
  logger: Logger,
  http: HttpClient,
  clock: Clock,
): TvlSubmodule | undefined {
  return chainTvlSubmodule(
    ChainId.MANTA_PACIFIC,
    ProjectId.MANTA_PACIFIC,
    config.tvl.mantapacific,
    config.tokens,
    MANTA_PACIFIC_MULTICALL_CONFIG,
    db,
    priceUpdater,
    coingeckoQueryService,
    http,
    clock,
    logger,
  )
}
