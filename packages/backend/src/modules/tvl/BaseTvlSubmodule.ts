import { Logger } from '@l2beat/backend-tools'
import { CoingeckoQueryService, HttpClient } from '@l2beat/shared'
import { ChainId, ProjectId } from '@l2beat/shared-pure'

import { Config } from '../../config'
import { Clock } from '../../core/Clock'
import { PriceUpdater } from '../../core/PriceUpdater'
import { TvlSubmodule } from '../ApplicationModule'
import { chainTvlSubmodule } from './ChainTvlSubmodule'
import { TvlDatabase } from './types'

export function createBaseTvlSubmodule(
  db: TvlDatabase,
  priceUpdater: PriceUpdater,
  coingeckoQueryService: CoingeckoQueryService,
  config: Config,
  logger: Logger,
  http: HttpClient,
  clock: Clock,
): TvlSubmodule | undefined {
  return chainTvlSubmodule(
    ChainId.BASE,
    ProjectId.BASE,
    config.tvl.base,
    config.tokens,
    db,
    priceUpdater,
    coingeckoQueryService,
    http,
    clock,
    logger,
  )
}
