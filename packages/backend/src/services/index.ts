import { Config } from '../config'
import { BlockNumberRepository } from './database/BlockNumberRepository'
import { DatabaseService } from './database/DatabaseService'
import { AlchemyHttpClient, EthereumClient } from './ethereum'
import { EtherscanClient } from './etherscan'
import { HelloService } from './HelloService'
import { ApiServer, createHelloRouter, createReportRouter } from './http'
import { HttpClient } from './HttpClient'
import { Logger } from './Logger'
import { ReportCreator } from './report/ReportCreator'
import { ReportRangeService } from './report/ReportRangeService'

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
