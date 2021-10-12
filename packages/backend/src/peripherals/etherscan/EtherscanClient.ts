import { UnixTime } from '../../model/UnixTime'
import { getErrorMessage, Logger } from '../../tools/Logger'
import { RateLimiter } from '../../tools/RateLimiter'
import { IHttpClient } from '../HttpClient'
import { asBigIntFromString } from './asBigIntFromString'
import { parseEtherscanResponse } from './parseEtherscanResponse'

export class EtherscanError extends Error {}

export interface IEtherscanClient {
  getBlockNumberAtOrBefore(timestamp: UnixTime): Promise<bigint>
}

export class EtherscanClient {
  constructor(
    private etherscanApiKey: string,
    private httpClient: IHttpClient,
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
    return this.rateLimiter.call(() =>
      this.callUnlimited(module, action, params)
    )
  }

  private async callUnlimited(
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
    let res
    try {
      res = await this.httpClient.fetch(url, { timeout: 20_000 })
    } catch (e) {
      this.logger.debug({
        type: 'response',
        error: getErrorMessage(e),
        module,
        action,
      })
      throw e
    }

    const text = await res.text()
    if (!res.ok) {
      this.logger.debug({ type: 'response', error: res.status, module, action })
      throw new Error(`Http error ${res.status}: ${text}`)
    }
    const parsed = parseEtherscanResponse(text)
    if (parsed.message !== 'OK') {
      this.logger.debug({
        type: 'response',
        error: parsed.message,
        module,
        action,
      })
      throw new EtherscanError(parsed.result)
    }
    this.logger.debug({ type: 'response', success: true, module, action })
    return parsed.result
  }
}
