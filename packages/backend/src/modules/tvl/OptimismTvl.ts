import { CoingeckoClient, HttpClient, Logger } from '@l2beat/shared'
import { ChainId, ProjectId } from '@l2beat/shared-pure'

import { Config } from '../../config'
import { CirculatingSupplyFormulaUpdater } from '../../core/assets/CirculatingSupplyFormulaUpdater'
import { Clock } from '../../core/Clock'
import { PriceUpdater } from '../../core/PriceUpdater'
import { CirculatingSupplyUpdater } from '../../core/totalSupply/CirculatingSupplyUpdater'
import { CoingeckoQueryService } from '../../peripherals/coingecko/CoingeckoQueryService'
import { TvlSubmodule } from '../ApplicationModule'
import { TvlDatabase } from './types'

export function createOptimismTvlSubmodule(
  db: TvlDatabase,
  priceUpdater: PriceUpdater,
  config: Config,
  logger: Logger,
  http: HttpClient,
  clock: Clock,
): TvlSubmodule | undefined {
  if (!config.tvl.optimism) {
    logger.info('Optimism TVL module disabled')
    return
  }

  // #region peripherals
  const coingeckoClient = new CoingeckoClient(http, config.tvl.coingeckoApiKey)
  const coingeckoQueryService = new CoingeckoQueryService(coingeckoClient)
  // #endregion

  // #region updaters

  const circulatingSupplyTokens = config.tokens.filter(
    (t) => t.chainId === ChainId.OPTIMISM && t.formula === 'circulatingSupply',
  )

  const circulatingSupplyUpdater = new CirculatingSupplyUpdater(
    coingeckoQueryService,
    db.circulatingSupplyRepository,
    clock,
    circulatingSupplyTokens,
    ChainId.OPTIMISM,
    logger,
  )

  const circulatingSupplyFormulaUpdater = new CirculatingSupplyFormulaUpdater(
    priceUpdater,
    circulatingSupplyUpdater,
    db.reportRepository,
    db.reportStatusRepository,
    ProjectId.OPTIMISM,
    ChainId.OPTIMISM,
    clock,
    circulatingSupplyTokens,
    logger,
    config.tvl.optimism.minBlockTimestamp,
  )

  // #endregion

  const start = async () => {
    logger = logger.for('OptimismTvlModule')
    logger.info('Starting')

    circulatingSupplyUpdater.start()
    await circulatingSupplyFormulaUpdater.start()

    logger.info('Started')
  }

  return {
    updaters: [circulatingSupplyFormulaUpdater],
    start,
  }
}
