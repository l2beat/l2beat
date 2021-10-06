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

export type Services = ReturnType<typeof createServices>

export function createServices(config: Config) {
  const logger = new Logger(config.logger)

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

  const helloService = new HelloService(config.name, ethereumClient)

  const reportRangeService = new ReportRangeService(
    etherscanClient,
    blockNumberRepository
  )
  const reportCreator = new ReportCreator(
    ethereumClient,
    reportRangeService,
    logger
  )

  const helloRouter = createHelloRouter(helloService)
  const reportRouter = createReportRouter(reportCreator)
  const apiServer = new ApiServer(config.port, logger, [
    helloRouter,
    reportRouter,
  ])

  return {
    logger,
    databaseService,
    apiServer,
    reportRangeService,
    reportCreator,
  }
}
