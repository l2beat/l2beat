import { CoingeckoClient, HttpClient, Logger } from '@l2beat/shared'
import { ChainId, ProjectId } from '@l2beat/shared-pure'

import { Config } from '../../config'
import { CirculatingSupplyFormulaUpdater } from '../../core/assets/CirculatingSupplyFormulaUpdater'
import { Clock } from '../../core/Clock'
import { PriceUpdater } from '../../core/PriceUpdater'
import { CirculatingSupplyUpdater } from '../../core/totalSupply/CirculatingSupplyUpdater'
import { CoingeckoCirculatingSupplyProvider } from '../../core/totalSupply/providers/CoingeckoCirculatingSupplyProvider'
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
  // #endregion

  // #region updaters

  const circulatingSupplyTokens = config.tokens.filter(
    (t) => t.chainId === ChainId.OPTIMISM && t.formula === 'circulatingSupply',
  )

  const coingeckoCirculatingSupplyProvider =
    new CoingeckoCirculatingSupplyProvider(coingeckoClient, ChainId.OPTIMISM)

  const circulatingSupplyUpdater = new CirculatingSupplyUpdater(
    coingeckoCirculatingSupplyProvider,
    db.circulatingSupplyRepository,
    db.circulatingSupplyStatusRepository,
    clock,
    circulatingSupplyTokens,
    logger,
    ChainId.OPTIMISM,
    config.tvl.optimism.minBlockTimestamp,
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

    await circulatingSupplyUpdater.start()
    await circulatingSupplyFormulaUpdater.start()

    logger.info('Started')
  }

  return {
    updaters: [circulatingSupplyFormulaUpdater],
    start,
  }
}
