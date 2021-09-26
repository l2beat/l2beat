import { Config } from '../config'
import { AlchemyEthereumClient } from './ethereum'
import { HelloService } from './HelloService'
import { HttpClient } from './HttpClient'
import { JsonRpcHttpClient } from './jsonrpc'
import { Logger } from './Logger'

export type Services = ReturnType<typeof createServices>

export function createServices(config: Config) {
  const logger = new Logger(config.logger)

  const httpClient = new HttpClient()
  const jsonRpcHttpClient = new JsonRpcHttpClient(
    config.ethereumJsonRpcUrl,
    httpClient,
    logger
  )
  const alchemyEthereumClient = new AlchemyEthereumClient(
    jsonRpcHttpClient,
    logger
  )

  const helloService = new HelloService(config.name, alchemyEthereumClient)

  return {
    logger,
    helloService,
  }
}
