import { Config } from '../config'
import { AlchemyHttpClient, EthereumClient } from './ethereum'
import { HelloService } from './HelloService'
import { ApiServer, createHelloRouter } from './http'
import { HttpClient } from './HttpClient'
import { Logger } from './Logger'

export type Services = ReturnType<typeof createServices>

export function createServices(config: Config) {
  const logger = new Logger(config.logger)

  const httpClient = new HttpClient()
  const alchemyHttpClient = new AlchemyHttpClient(
    config.alchemyApiKey,
    httpClient,
    logger
  )
  const ethereumClient = new EthereumClient(alchemyHttpClient)

  const helloService = new HelloService(config.name, ethereumClient)

  const helloRouter = createHelloRouter(helloService)
  const apiServer = new ApiServer(config.port, logger, [helloRouter])

  return {
    logger,
    apiServer,
  }
}
