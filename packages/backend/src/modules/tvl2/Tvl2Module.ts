import { Logger } from '@l2beat/backend-tools'
import { tokenList } from '@l2beat/config'
import { CoingeckoClient, CoingeckoQueryService } from '@l2beat/shared'

import { Config } from '../../config'
import { Tvl2Config } from '../../config/Config'
import { Peripherals } from '../../peripherals/Peripherals'
import { Clock } from '../../tools/Clock'
import { IndexerConfigurationRepository } from '../../tools/uif/IndexerConfigurationRepository'
import { IndexerService } from '../../tools/uif/IndexerService'
import { IndexerStateRepository } from '../../tools/uif/IndexerStateRepository'
import { ApplicationModule } from '../ApplicationModule'
import { HourlyIndexer } from '../tracked-txs/HourlyIndexer'
import { createTvl2StatusRouter } from './api/Tvl2StatusRouter'
import { createChainIndexers } from './ChainModule'
import { PriceIndexer } from './PriceIndexer'
import { PriceRepository } from './repositories/PriceRepository'
import { SyncOptimizer } from './SyncOptimizer'

export function createTvl2Module(
  config: Config,
  logger: Logger,
  peripherals: Peripherals,
  clock: Clock,
): ApplicationModule | undefined {
  if (!config.tvl2) {
    logger.info('Tvl2Module disabled')
    return
  }

  const coingeckoClient = peripherals.getClient(CoingeckoClient, {
    apiKey: config.tvl2.coingeckoApiKey,
  })
  const coingeckoQueryService = new CoingeckoQueryService(coingeckoClient)

  const syncOptimizer = new SyncOptimizer(clock, {
    removeHourlyAfterDays: 10,
    removeSixHourlyAfterDays: 93,
  })

  const indexerStateRepository = peripherals.getRepository(
    IndexerStateRepository,
  )
  const configurationsRepository = peripherals.getRepository(
    IndexerConfigurationRepository,
  )
  const indexerService = new IndexerService(
    indexerStateRepository,
    configurationsRepository,
  )

  const hourlyIndexer = new HourlyIndexer(logger, clock)

  const priceIndexers = getPriceIndexers(
    config.tvl2,
    logger,
    hourlyIndexer,
    coingeckoQueryService,
    peripherals,
    syncOptimizer,
  )

  const chainIndexers = createChainIndexers(
    config.tvl2,
    peripherals,
    logger,
    hourlyIndexer,
    syncOptimizer,
    indexerService,
  )

  const statusRouter = createTvl2StatusRouter(
    config.tvl2,
    [...priceIndexers, ...chainIndexers],
    clock,
  )

  const start = async () => {
    logger = logger.for('Tvl2Module')

    await hourlyIndexer.start()

    for (const priceIndexer of priceIndexers) {
      await priceIndexer.start()
    }

    for (const chainModule of chainIndexers) {
      await chainModule.start()
    }

    logger.info('Started')
  }

  return {
    routers: [statusRouter],
    start,
  }
}

function getPriceIndexers(
  config: Tvl2Config,
  logger: Logger,
  hourlyIndexer: HourlyIndexer,
  coingeckoQueryService: CoingeckoQueryService,
  peripherals: Peripherals,
  syncOptimizer: SyncOptimizer,
): PriceIndexer[] {
  return config.prices.map(
    (price) =>
      new PriceIndexer(
        // TODO: write it correctly
        logger.tag(
          `${price.chain}:${
            tokenList.find((t) => t.address === price.address)?.symbol ??
            'native'
          }`,
        ),
        hourlyIndexer,
        coingeckoQueryService,
        peripherals.getRepository(IndexerStateRepository),
        peripherals.getRepository(PriceRepository),
        price,
        syncOptimizer,
      ),
  )
}
