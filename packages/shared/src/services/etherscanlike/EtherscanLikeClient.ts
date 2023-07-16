import { getErrorMessage, RateLimiter } from '@l2beat/shared-pure'

import { Logger } from '../../tools'
import { HttpClient } from '../HttpClient'
import { parseEtherscanResponse } from './model'

export class EtherscanError extends Error {}

export class EtherscanLikeClient {
  private readonly rateLimiter = new RateLimiter({
    callsPerMinute: 150,
  })
  private readonly timeoutMs = 20_000

  constructor(
    private readonly httpClient: HttpClient,
    private readonly url: string,
    private readonly apiKey: string,
    private readonly logger = Logger.SILENT,
  ) {
    this.call = this.rateLimiter.wrap(this.call.bind(this))
  }

  async call(module: string, action: string, params: Record<string, string>) {
    const query = new URLSearchParams({
      module,
      action,
      ...params,
      apikey: this.apiKey,
    })
    const url = `${this.url}?${query.toString()}`

    const start = Date.now()
    const { httpResponse, error } = await this.httpClient
      .fetch(url, { timeout: this.timeoutMs })
      .then(
        (httpResponse) => ({ httpResponse, error: undefined }),
        (error: unknown) => ({ httpResponse: undefined, error }),
      )
    const timeMs = Date.now() - start

    if (!httpResponse) {
      const message = getErrorMessage(error)
      this.recordError(module, action, timeMs, message)
      throw error
    }

    const text = await httpResponse.text()
    const etherscanResponse = tryParseEtherscanResponse(text)

    if (!httpResponse.ok) {
      this.recordError(module, action, timeMs, text)
      throw new Error(
        `Server responded with non-2XX result: ${httpResponse.status} ${httpResponse.statusText}`,
      )
    }

    if (!etherscanResponse) {
      const message = 'Invalid Etherscan response.'
      this.recordError(module, action, timeMs, message)
      throw new TypeError(message)
    }

    if (etherscanResponse.message !== 'OK') {
      this.recordError(module, action, timeMs, etherscanResponse.result)
      throw new EtherscanError(etherscanResponse.result)
    }

    this.logger.debug({ type: 'success', timeMs, module, action })
    return etherscanResponse.result
  }

  private recordError(
    module: string,
    action: string,
    timeMs: number,
    message: string,
  ) {
    this.logger.debug({ type: 'error', message, timeMs, module, action })
  }
}

function tryParseEtherscanResponse(text: string) {
  try {
    return parseEtherscanResponse(text)
  } catch {
    return undefined
  }
}
