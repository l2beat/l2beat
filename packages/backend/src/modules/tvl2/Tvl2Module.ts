import { Logger } from '@l2beat/backend-tools'
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
import { HourlyIndexer } from '../liveness/HourlyIndexer'
import { createTvl2StatusRouter } from './api/Tvl2StatusRouter'
import { PriceIndexer } from './PriceIndexer'
import { PricesRepository } from './repositories/PricesRepository'
import { SyncService } from './SyncService'

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
  const pricesRepository = new PricesRepository(database, logger)

  const coingeckoClient = new CoingeckoClient(http, config.tvl.coingeckoApiKey)
  const coingeckoQueryService = new CoingeckoQueryService(coingeckoClient)

  const statusRouter = createTvl2StatusRouter(config.tvl2, clock)
  const hourlyIndexer = new HourlyIndexer(logger, clock)
  const syncService = new SyncService(clock, {
    minTimestamp: config.clock.minBlockTimestamp,
    removeHourlyAfterDays: 10,
    removeSixHourlyAfterDays: 93,
  })

  const indexers = config.tvl2.prices.map(
    (price) =>
      new PriceIndexer(
        logger,
        hourlyIndexer,
        stateRepository,
        price,
        pricesRepository,
        coingeckoQueryService,
        syncService,
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
