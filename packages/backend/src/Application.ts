import { Logger } from '@l2beat/common'

import { ApiServer } from './api/ApiServer'
import { BlocksController } from './api/controllers/BlocksController'
import { PricesController } from './api/controllers/PricesController'
import { createBlocksRouter } from './api/routers/BlocksRouter'
import { createPricesRouter } from './api/routers/PricesRouter'
import { createStatusRouter } from './api/routers/StatusRouter'
import { Config } from './config'
import { BlockNumberUpdater } from './core/BlockNumberUpdater'
import { AggregatePriceService } from './core/prices/AggregatePriceService'
import { ExchangePriceService } from './core/prices/ExchangePriceService'
import { PriceUpdater } from './core/prices/PriceUpdater'
import { SafeBlockService } from './core/SafeBlockService'
import { StatusService } from './core/StatusService'
import { AggregatePriceRepository } from './peripherals/database/AggregatePriceRepository'
import { BlockNumberRepository } from './peripherals/database/BlockNumberRepository'
import { DatabaseService } from './peripherals/database/DatabaseService'
import { ExchangePriceRepository } from './peripherals/database/ExchangePriceRepository'
import { AlchemyHttpClient } from './peripherals/ethereum/AlchemyHttpClient'
import { EthereumClient } from './peripherals/ethereum/EthereumClient'
import { MulticallClient } from './peripherals/ethereum/MulticallClient'
import { EtherscanClient } from './peripherals/etherscan'
import { ExchangeQueryService } from './peripherals/exchanges/ExchangeQueryService'
import { UniswapV1Client } from './peripherals/exchanges/UniswapV1Client'
import { HttpClient } from './peripherals/HttpClient'

export class Application {
  start: () => Promise<void>

  constructor(config: Config) {
    /* - - - - - TOOLS - - - - - */

    const logger = new Logger(config.logger)

    /* - - - - - PERIPHERALS - - - - - */

    const knex = DatabaseService.createKnexInstance(config.databaseUrl)
    const databaseService = new DatabaseService(knex, logger)

    const aggregatePriceRepository = new AggregatePriceRepository(knex, logger)
    const blockNumberRepository = new BlockNumberRepository(knex, logger)
    const exchangePriceRepository = new ExchangePriceRepository(knex, logger)

    const httpClient = new HttpClient()

    const alchemyHttpClient = new AlchemyHttpClient(
      config.alchemyApiKey,
      httpClient,
      logger
    )
    const ethereumClient = new EthereumClient(alchemyHttpClient)
    const etherscanClient = new EtherscanClient(
      config.etherscanApiKey,
      httpClient,
      logger
    )
    const multicallClient = new MulticallClient(ethereumClient)

    const uniswapV1Client = new UniswapV1Client(multicallClient)
    const exchangeQueryService = new ExchangeQueryService(
      uniswapV1Client,
      multicallClient
    )

    /* - - - - - CORE - - - - - */

    const safeBlockService = new SafeBlockService(
      config.core.safeBlockRefreshIntervalMs,
      config.core.safeBlockBlockOffset,
      ethereumClient,
      logger
    )
    const blockNumberUpdater = new BlockNumberUpdater(
      config.core.minBlockTimestamp,
      safeBlockService,
      etherscanClient,
      blockNumberRepository,
      logger
    )
    const exchangePriceService = new ExchangePriceService(
      exchangePriceRepository,
      exchangeQueryService,
      logger
    )
    const aggregatePriceService = new AggregatePriceService(
      aggregatePriceRepository,
      exchangePriceService,
      logger
    )
    const priceUpdater = new PriceUpdater(
      config.tokens,
      blockNumberUpdater,
      aggregatePriceService,
      logger
    )

    const statusService = new StatusService({
      alchemyHttpClient,
      blockNumberUpdater,
      databaseService,
      etherscanClient,
      priceUpdater,
      safeBlockService,
    })

    /* - - - - - API - - - - - */

    const blocksController = new BlocksController(blockNumberRepository)
    const pricesController = new PricesController(
      exchangePriceRepository,
      aggregatePriceRepository
    )

    const apiServer = new ApiServer(config.port, logger, [
      createBlocksRouter(blocksController),
      createPricesRouter(pricesController),
      createStatusRouter(statusService),
    ])

    /* - - - - - START - - - - - */

    this.start = async () => {
      logger.for(this).info('Starting')

      await databaseService.migrateToLatest()

      await apiServer.listen()

      await safeBlockService.start()
      await blockNumberUpdater.start()
      await priceUpdater.start()

      logger.for(this).info('Started')
    }
  }
}
