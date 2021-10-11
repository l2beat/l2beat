import { Logger } from '../../tools/Logger'
import { RateLimiter } from '../../tools/RateLimiter'
import { HttpClient } from '../HttpClient'
import { JsonRpcHttpClient, JsonRpcRequest } from '../jsonrpc'

export class AlchemyHttpClient extends JsonRpcHttpClient {
  constructor(apiKey: string, httpClient: HttpClient, logger: Logger) {
    super(`https://eth-mainnet.alchemyapi.io/v2/${apiKey}`, httpClient, logger)
  }

  private rateLimiter = new RateLimiter({
    callsPerMinute: 500,
  })

  execute(request: JsonRpcRequest | JsonRpcRequest[]) {
    return this.rateLimiter.call(() => super.execute(request))
  }
}
