import { Logger } from '@l2beat/backend-tools'
import { tokenList } from '@l2beat/config'
import {
  CoingeckoClient,
  CoingeckoQueryService,
  HttpClient,
} from '@l2beat/shared'

import { Config } from '../../config'
import { Database } from '../../peripherals/database/Database'
import { IndexerStateRepository } from '../../peripherals/database/repositories/IndexerStateRepository'
import { Clock } from '../../tools/Clock'
import { ApplicationModule } from '../ApplicationModule'
import { HourlyIndexer } from '../tracked-txs/HourlyIndexer'
import { createTvl2StatusRouter } from './api/Tvl2StatusRouter'
import { PriceIndexer } from './PriceIndexer'
import { PriceRepository } from './repositories/PriceRepository'
import { SyncOptimizer } from './SyncOptimizer'

export function createTvl2Module(
  config: Config,
  logger: Logger,
  http: HttpClient,
  database: Database,
  clock: Clock,
): ApplicationModule | undefined {
  if (!config.tvl2) {
    logger.info('Tvl2Module disabled')
    return
  }

  const stateRepository = new IndexerStateRepository(database, logger)
  const priceRepository = new PriceRepository(database, logger)

  const coingeckoClient = new CoingeckoClient(http, config.tvl2.coingeckoApiKey)
  const coingeckoQueryService = new CoingeckoQueryService(coingeckoClient)

  const statusRouter = createTvl2StatusRouter(config.tvl2, clock)
  const hourlyIndexer = new HourlyIndexer(logger, clock)

  const syncOptimizer = new SyncOptimizer(clock, {
    removeHourlyAfterDays: 10,
    removeSixHourlyAfterDays: 93,
  })

  const indexers = config.tvl2.prices.map(
    (price) =>
      new PriceIndexer(
        // TODO: write it correctly
        logger.tag(
          `${price.chain}:${
            tokenList.find((t) => t.address === price.address)?.symbol
          }`,
        ),
        hourlyIndexer,
        coingeckoQueryService,
        stateRepository,
        priceRepository,
        price,
        syncOptimizer,
      ),
  )

  const start = async () => {
    logger = logger.for('Tvl2Module')

    await hourlyIndexer.start()

    for (const indexer of indexers) {
      await indexer.start()
    }

    logger.info('Started')
  }

  return {
    routers: [statusRouter],
    start,
  }
}
