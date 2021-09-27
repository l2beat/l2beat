import { JsonRpcHttpClient, JsonRpcRequest } from '../jsonrpc'
import { RateLimiter } from '../utils/RateLimiter'
import { retry } from '../utils/retry'

export class AlchemyHttpClient extends JsonRpcHttpClient {
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
