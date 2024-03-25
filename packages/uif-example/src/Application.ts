import { Logger } from '@l2beat/backend-tools'

import { BlockIndexer } from './blocks/BlockIndexer'
import { BlockIndexerRepository } from './blocks/BlockIndexerRepository'
import { BlockRepository } from './blocks/BlockRepository'
import { BlockService } from './blocks/BlockService'
import { HourlyIndexer } from './HourlyIndexer'
import { PriceIndexer } from './prices/PriceIndexer'
import { PriceIndexerRepository } from './prices/PriceIndexerRepository'
import { PriceRepository } from './prices/PriceRepository'
import { PriceService } from './prices/PriceService'
import { msToHours, ONE_HOUR_MS } from './utils'

export class Application {
  start: () => Promise<void>

  constructor() {
    const logger = Logger.DEBUG

    const hourlyIndexer = new HourlyIndexer(logger)

    const priceService = new PriceService(logger)
    const priceRepository = new PriceRepository()
    const priceIndexerRepository = new PriceIndexerRepository()

    const ethereumPriceIndexer = new PriceIndexer(
      'price-ethereum',
      priceService,
      priceRepository,
      priceIndexerRepository,
      hourlyIndexer,
      logger,
      [
        {
          // could be a hash of properties & minHeight instead
          id: 'eth-ethereum',
          properties: { tokenSymbol: 'ETH', apiId: 'ethereum' },
          minHeight: msToHours(Date.now() - 48 * ONE_HOUR_MS),
          maxHeight: null,
        },
        {
          id: 'weth-ethereum',
          properties: { tokenSymbol: 'WETH', apiId: 'ethereum' },
          minHeight: msToHours(Date.now() - 32 * ONE_HOUR_MS),
          maxHeight: null,
        },
      ],
    )
    const bitcoinPriceIndexer = new PriceIndexer(
      'price-bitcoin',
      priceService,
      priceRepository,
      priceIndexerRepository,
      hourlyIndexer,
      logger,
      [
        {
          id: 'btc-bitcoin',
          properties: { tokenSymbol: 'BTC', apiId: 'bitcoin' },
          minHeight: msToHours(Date.now() - 72 * ONE_HOUR_MS),
          maxHeight: null,
        },
      ],
    )

    const blockService = new BlockService()
    const blockRepository = new BlockRepository()
    const blockIndexerRepository = new BlockIndexerRepository()
    const blockIndexer = new BlockIndexer(
      blockService,
      blockRepository,
      blockIndexerRepository,
      msToHours(Date.now() - 72 * ONE_HOUR_MS),
      hourlyIndexer,
      logger,
    )

    this.start = async (): Promise<void> => {
      logger.for('Application').info('Starting')

      await hourlyIndexer.start()
      await ethereumPriceIndexer.start()
      await bitcoinPriceIndexer.start()
      await blockIndexer.start()

      logger.for('Application').info('Started')
    }
  }
}
