import { Config } from '../config'
import { HelloService } from './HelloService'
import { HttpClient } from './HttpClient'
import { JsonRpcHttpClient } from './jsonrpc/JsonRpcHttpClient'
import { Logger } from './Logger'

export type Services = ReturnType<typeof createServices>

export function createServices(config: Config) {
  const logger = new Logger(config.logLevel)

  // This key was provided to ethers.js by Alchemy. Remove it ASAP
  const apiKey = '_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC'
  const url = `https://eth-mainnet.alchemyapi.io/v2/${apiKey}`

  const httpClient = new HttpClient()
  const jsonRpcHttpClient = new JsonRpcHttpClient(url, httpClient, logger)

  const helloService = new HelloService(config.name, jsonRpcHttpClient)

  return {
    logger,
    helloService,
  }
}
