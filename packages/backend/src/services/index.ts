import { Config } from '../config'
import { AlchemyHttpClient, EthereumClient } from './ethereum'
import { HelloService } from './HelloService'
import { HttpClient } from './HttpClient'
import { Logger } from './Logger'

export type Services = ReturnType<typeof createServices>

export function createServices(config: Config) {
  const logger = new Logger(config.logger)

  const httpClient = new HttpClient()
  const alchemyHttpClient = new AlchemyHttpClient(
    config.ethereumJsonRpcUrl,
    httpClient,
    logger
  )
  const ethereumClient = new EthereumClient(alchemyHttpClient)

  const helloService = new HelloService(config.name, ethereumClient)

  return {
    logger,
    helloService,
  }
}
