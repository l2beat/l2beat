import { ApiServer, createHelloRouter, createReportRouter } from './api'
import { Config } from './config'
import { HelloService } from './core/HelloService'
import { ReportCreator } from './core/report/ReportCreator'
import { ReportRangeService } from './core/report/ReportRangeService'
import { BlockNumberRepository } from './peripherals/database/BlockNumberRepository'
import { DatabaseService } from './peripherals/database/DatabaseService'
import { AlchemyHttpClient } from './peripherals/ethereum/AlchemyHttpClient'
import { EthereumClient } from './peripherals/ethereum/EthereumClient'
import { EtherscanClient } from './peripherals/etherscan'
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
    const blockNumberRepository = new BlockNumberRepository(knex)

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

    /* - - - - - CORE - - - - - */

    const helloService = new HelloService(config.name)

    const reportRangeService = new ReportRangeService(
      etherscanClient,
      blockNumberRepository
    )
    const reportCreator = new ReportCreator(
      ethereumClient,
      reportRangeService,
      logger
    )

    /* - - - - - API - - - - - */

    const helloRouter = createHelloRouter(helloService)
    const reportRouter = createReportRouter(reportCreator)
    const apiServer = new ApiServer(config.port, logger, [
      helloRouter,
      reportRouter,
    ])

    /* - - - - - START - - - - - */

    this.start = async () => {
      logger.for(this).info('Starting')

      await databaseService.migrateToLatest()
      await reportRangeService.initialize()

      await apiServer.listen()
      reportCreator.startBackgroundWork()

      logger.for(this).info('Started')
    }
  }
}
