import { HttpClient } from '../HttpClient'
import { JsonRpcHttpClient, JsonRpcRequest } from '../jsonrpc'
import { Logger } from '../Logger'
import { RateLimiter } from '../utils/RateLimiter'
import { retry } from '../utils/retry'

export class AlchemyHttpClient extends JsonRpcHttpClient {
  constructor(apiKey: string, httpClient: HttpClient, logger: Logger) {
    super(`https://eth-mainnet.alchemyapi.io/v2/${apiKey}`, httpClient, logger)
  }

  private rateLimiter = new RateLimiter({
    callsPerMinute: 500,
  })

  execute(request: JsonRpcRequest | JsonRpcRequest[]) {
    return retry(() => this.rateLimiter.call(() => super.execute(request)), {
      minTimeout: 100,
      maxTimeout: 60_000,
      maxRetryCount: 5,
      onError: (e) => this.logger.error(e),
    })
  }
}
