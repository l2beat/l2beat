import { assert, Logger } from '@l2beat/backend-tools'
import { tokenList } from '@l2beat/config'
import {
  BlockscoutClient,
  CoingeckoClient,
  CoingeckoQueryService,
  EtherscanClient,
} from '@l2beat/shared'

import { Config } from '../../config'
import { Tvl2Config } from '../../config/Config'
import { Peripherals } from '../../peripherals/Peripherals'
import { Clock } from '../../tools/Clock'
import { IndexerStateRepository } from '../../tools/uif/IndexerStateRepository'
import { ApplicationModule } from '../ApplicationModule'
import { HourlyIndexer } from '../tracked-txs/HourlyIndexer'
import { createTvl2StatusRouter } from './api/Tvl2StatusRouter'
import {
  BlockTimestampIndexer,
  BlockTimestampProvider,
} from './BlockTimestampIndexer'
import { PriceIndexer } from './PriceIndexer'
import { BlockTimestampRepository } from './repositories/BlockTimestampRepository'
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

  const hourlyIndexer = new HourlyIndexer(logger, clock)

  const syncOptimizer = new SyncOptimizer(clock, {
    removeHourlyAfterDays: 10,
    removeSixHourlyAfterDays: 93,
  })

  const priceIndexers = getPriceIndexers(
    config.tvl2,
    logger,
    hourlyIndexer,
    coingeckoQueryService,
    peripherals,
    syncOptimizer,
  )

  const blockTimestampIndexers = getBlockTimestampIndexers(
    config.tvl2,
    peripherals,
    logger,
    hourlyIndexer,
    syncOptimizer,
  )

  const indexers = [...blockTimestampIndexers, ...priceIndexers]

  const statusRouter = createTvl2StatusRouter(config.tvl2, indexers, clock)

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

function getBlockTimestampIndexers(
  config: Tvl2Config,
  peripherals: Peripherals,
  logger: Logger,
  hourlyIndexer: HourlyIndexer,
  syncOptimizer: SyncOptimizer,
): BlockTimestampIndexer[] {
  return config.chains
    .filter((c) => c.config !== undefined)
    .map((chain) => {
      assert(chain.config !== undefined, 'Chain config is required')

      const provider: BlockTimestampProvider =
        chain.config.blockNumberProviderConfig.type === 'etherscan'
          ? peripherals.getClient(EtherscanClient, {
              apiKey: chain.config.blockNumberProviderConfig.etherscanApiKey,
              url: chain.config.blockNumberProviderConfig.etherscanApiUrl,
              minTimestamp: chain.config.minBlockTimestamp,
              chainId: chain.config.chainId,
            })
          : peripherals.getClient(BlockscoutClient, {
              url: chain.config.blockNumberProviderConfig.blockscoutApiUrl,
              minTimestamp: chain.config.minBlockTimestamp,
              chainId: chain.config.chainId,
            })

      return new BlockTimestampIndexer(
        logger.tag(`${chain.chain}`),
        hourlyIndexer,
        provider,
        peripherals.getRepository(IndexerStateRepository),
        peripherals.getRepository(BlockTimestampRepository),
        chain.chain,
        chain.config.minBlockTimestamp,
        syncOptimizer,
      )
    })
}
