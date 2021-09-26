import { JsonRpcHttpClient, JsonRpcParams } from '../jsonrpc'
import { Logger } from '../Logger'
import { RateLimiter } from '../utils/RateLimiter'
import { retry } from '../utils/retry'
import { EthereumClient } from './EthereumClient'

export class AlchemyEthereumClient extends EthereumClient {
  constructor(jsonRpcHttpClient: JsonRpcHttpClient, private logger: Logger) {
    super(jsonRpcHttpClient)
    this.logger = this.logger.for(this)
  }

  private rateLimiter = new RateLimiter({
    callsPerMinute: 500,
  })

  protected execute(method: string, params?: JsonRpcParams) {
    return retry(
      () => this.rateLimiter.call(() => super.execute(method, params)),
      {
        minTimeout: 100,
        maxTimeout: 60_000,
        maxRetryCount: 5,
        onError: (e) => this.logger.error(e),
      }
    )
  }
}
