import { UnixTime } from '../../model/UnixTime'
import { Logger } from '../../tools/Logger'
import { RateLimiter } from '../../tools/RateLimiter'
import { retry } from '../../tools/retry'
import { HttpClient } from '../HttpClient'
import { asBigIntFromString } from './asBigIntFromString'
import { parseEtherscanResponse } from './parseEtherscanResponse'

export class EtherscanError extends Error {}

export class EtherscanClient {
  constructor(
    private etherscanApiKey: string,
    private httpClient: HttpClient,
    private logger: Logger
  ) {
    this.logger = this.logger.for(this)
  }

  private rateLimiter = new RateLimiter({
    callsPerMinute: 150,
  })

  async getBlockNumberAtOrBefore(timestamp: UnixTime): Promise<bigint> {
    const result = await this.call('block', 'getblocknobytime', {
      timestamp: timestamp.toString(),
      closest: 'before',
    })
    return asBigIntFromString(result)
  }

  private async call(
    module: string,
    action: string,
    params: Record<string, string>
  ) {
    return retry(
      () =>
        this.rateLimiter.call(() => this.callUnsafe(module, action, params)),
      {
        maxRetryCount: 5,
        minTimeout: 100,
      }
    )
  }

  private async callUnsafe(
    module: string,
    action: string,
    params: Record<string, string>
  ) {
    const query = new URLSearchParams({
      module,
      action,
      ...params,
      apikey: this.etherscanApiKey,
    })

    this.logger.debug({ type: 'request', module, action })
    const url = `https://api.etherscan.io/api?${query}`
    const res = await this.httpClient.fetch(url)
    this.logger.debug({ type: 'response', status: res.status, module, action })

    const text = await res.text()
    if (!res.ok) {
      throw new Error(`Http error ${res.status}: ${text}`)
    }
    const parsed = parseEtherscanResponse(text)
    if (parsed.message !== 'OK') {
      throw new EtherscanError(parsed.result)
    }
    return parsed.result
  }
}
