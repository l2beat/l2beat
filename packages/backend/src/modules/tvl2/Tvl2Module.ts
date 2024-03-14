import { Logger } from '@l2beat/backend-tools'
import {
  CoingeckoClient,
  CoingeckoQueryService,
  HttpClient,
} from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'

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

  const coingeckoClient = new CoingeckoClient(http, config.tvl2.coingeckoApiKey)
  const coingeckoQueryService = new CoingeckoQueryService(coingeckoClient)

  const statusRouter = createTvl2StatusRouter(config.tvl2, clock)
  const hourlyIndexer = new HourlyIndexer(logger, clock)

  const chainsMinTimestamp: Record<string, UnixTime> = {
    ethereum: UnixTime.now().add(-7, 'days'),
    arbitrum: UnixTime.now().add(-7, 'days'),
    optimism: UnixTime.now().add(-7, 'days'),
    base: UnixTime.now().add(-7, 'days'),
    lyra: UnixTime.now().add(-7, 'days'),
    mantapacific: UnixTime.now().add(-7, 'days'),
    linea: UnixTime.now().add(-7, 'days'),
    zkfair: UnixTime.now().add(-7, 'days'),
    kroma: UnixTime.now().add(-7, 'days'),
    aevo: UnixTime.now().add(-7, 'days'),
    blast: UnixTime.now().add(-7, 'days'),
  }

  const syncService = new SyncService(clock, {
    chainsMinTimestamp,
    removeHourlyAfterDays: 10,
    removeSixHourlyAfterDays: 93,
  })

  const indexers = config.tvl2.prices.map(
    (price) =>
      new PriceIndexer(
        logger,
        hourlyIndexer,
        coingeckoQueryService,
        stateRepository,
        pricesRepository,
        price,
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
