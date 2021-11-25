import { ApiServer } from './api/ApiServer'
import { createBlocksRouter } from './api/BlocksRouter'
import { createPricesRouter } from './api/PricesRouter'
import { createStatusRouter } from './api/StatusRouter'
import { Config } from './config'
import { BlockNumberUpdater } from './core/BlockNumberUpdater'
import { AggregatePriceUpdater } from './core/prices/AggregatePriceUpdater'
import { ExchangePriceUpdater } from './core/prices/ExchangePriceUpdater'
import { PriceUpdater } from './core/prices/PriceUpdater'
import { SafeBlockService } from './core/SafeBlockService'
import { StatusService } from './core/StatusService'
import { BlocksView } from './core/views/BlocksView'
import { PricesView } from './core/views/PricesView'
import { AggregatePriceRepository } from './peripherals/database/AggregatePriceRepository'
import { BlockNumberRepository } from './peripherals/database/BlockNumberRepository'
import { DatabaseService } from './peripherals/database/DatabaseService'
import { ExchangePriceRepository } from './peripherals/database/ExchangePriceRepository'
import { AlchemyHttpClient } from './peripherals/ethereum/AlchemyHttpClient'
import { EthereumClient } from './peripherals/ethereum/EthereumClient'
import { MulticallClient } from './peripherals/ethereum/MulticallClient'
import { EtherscanClient } from './peripherals/etherscan'
import { ExchangePriceChecker } from './peripherals/exchanges/ExchangePriceChecker'
import { UniswapV1Client } from './peripherals/exchanges/UniswapV1Client'
import { HttpClient } from './peripherals/HttpClient'
import { Logger } from './tools/Logger'

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
    const exchangePriceChecker = new ExchangePriceChecker(
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
    const exchangePriceUpdater = new ExchangePriceUpdater(
      exchangePriceRepository,
      exchangePriceChecker,
      logger
    )
    const aggregatePriceUpdater = new AggregatePriceUpdater(
      aggregatePriceRepository,
      exchangePriceUpdater,
      logger
    )
    const priceUpdater = new PriceUpdater(
      config.tokens,
      blockNumberUpdater,
      aggregatePriceUpdater,
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

    const blocksView = new BlocksView(blockNumberRepository)
    const pricesView = new PricesView(
      exchangePriceRepository,
      aggregatePriceRepository
    )

    /* - - - - - API - - - - - */

    const apiServer = new ApiServer(config.port, logger, [
      createBlocksRouter(blocksView),
      createPricesRouter(pricesView),
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
