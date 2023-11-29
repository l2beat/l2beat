import { Logger } from '@l2beat/backend-tools'
import { getErrorMessage, RateLimiter, UnixTime } from '@l2beat/shared-pure'

import { HttpClient } from '../HttpClient'
import { parseRoutescanResponse, RoutescanGetBlockNoByTime } from './model'

class RoutescanError extends Error {}

export class RoutescanLikeClient {
  private readonly rateLimiter = new RateLimiter({
    callsPerMinute: 150,
  })
  private readonly timeoutMs = 20_000

  constructor(
    private readonly httpClient: HttpClient,
    private readonly url: string,
    readonly minTimestamp: UnixTime,
    private readonly logger = Logger.SILENT,
  ) {
    this.call = this.rateLimiter.wrap(this.call.bind(this))
  }

  // Etherscan API is not stable enough to trust it to return "closest" block.
  // There is a case when there is not enough activity on a given chain
  // so that blocks come in a greater than 10 minutes intervals,
  // e.g block 0 @ 22:45 and block 1 @ 23:15
  // if you query for 23:00 Routescan API returns "No closes block found".
  // To mitigate this, we need to go back in time by 10 minutes until we find a block
  //
  // Since Etherscan and Routescan have very similar API we don't know if this
  // issue persists, so to be safe just leave the same logic.
  async getBlockNumberAtOrBefore(timestamp: UnixTime): Promise<number> {
    let current = new UnixTime(timestamp.toNumber())

    while (current.gte(this.minTimestamp)) {
      try {
        const result = await this.call('block', 'getblocknobytime', {
          timestamp: current.toString(),
          closest: 'before',
        })

        return RoutescanGetBlockNoByTime.parse(result).blockNumber
      } catch (error) {
        if (typeof error !== 'object') {
          const errorString =
            typeof error === 'string' ? error : 'Unknown error type caught'
          throw new Error(errorString)
        }

        const errorObject = error as RoutescanError
        if (!errorObject.message.includes('No closest block found')) {
          throw new Error(errorObject.message)
        }

        current = current.add(-10, 'minutes')
      }
    }

    throw new Error('Could not fetch block number')
  }

  async call(module: string, action: string, params: Record<string, string>) {
    const query = new URLSearchParams({
      module,
      action,
      ...params,
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
    const etherscanResponse = tryParseRoutescanResponse(text)

    if (!httpResponse.ok) {
      this.recordError(module, action, timeMs, text)
      throw new Error(
        `Server responded with non-2XX result: ${httpResponse.status} ${httpResponse.statusText}`,
      )
    }

    if (!etherscanResponse) {
      const message = `Invalid Routescan response [${text}] for request [${url}].`
      this.recordError(module, action, timeMs, message)
      throw new TypeError(message)
    }

    if (etherscanResponse.message !== 'OK') {
      this.recordError(module, action, timeMs, etherscanResponse.result)
      throw new RoutescanError(etherscanResponse.result)
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

function tryParseRoutescanResponse(text: string) {
  try {
    return parseRoutescanResponse(text)
  } catch {
    return undefined
  }
}
