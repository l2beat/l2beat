import { Logger } from '@l2beat/backend-tools'
import {
  ChainId,
  getErrorMessage,
  RateLimiter,
  UnixTime,
} from '@l2beat/shared-pure'

import { HttpClient } from '../HttpClient'
import { BlockscoutGetBlockNoByTime, parseBlockscoutResponse } from './model'

class BlockscoutError extends Error {}

export class BlockscoutClient {
  private readonly rateLimiter = new RateLimiter({
    callsPerMinute: 150,
  })
  private readonly timeoutMs = 20_000

  constructor(
    private readonly httpClient: HttpClient,
    private readonly url: string,
    readonly minTimestamp: UnixTime,
    private readonly chainId: ChainId,
    private readonly logger = Logger.SILENT,
  ) {
    this.call = this.rateLimiter.wrap(this.call.bind(this))
  }

  getChainId(): ChainId {
    return this.chainId
  }

  async getBlockNumberAtOrBefore(timestamp: UnixTime): Promise<number> {
    let current = new UnixTime(timestamp.toNumber())

    while (current.gte(this.minTimestamp)) {
      try {
        const result = await this.call('block', 'getblocknobytime', {
          timestamp: current.toString(),
          closest: 'before',
        })

        return BlockscoutGetBlockNoByTime.parse(result).blockNumber
      } catch (error) {
        if (typeof error !== 'object') {
          const errorString =
            typeof error === 'string' ? error : 'Unknown error type caught'
          throw new Error(errorString)
        }

        const errorObject = error as BlockscoutError
        if (!errorObject.message.includes('Block does not exist')) {
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
    const blockscoutResponse = tryParseBlockscoutResponse(text)

    if (!httpResponse.ok) {
      this.recordError(module, action, timeMs, text)
      throw new Error(
        `Server responded with non-2XX result: ${httpResponse.status} ${httpResponse.statusText}`,
      )
    }

    if (!blockscoutResponse) {
      const message = `Invalid Blockscout response [${text}] for request [${url}].`
      this.recordError(module, action, timeMs, message)
      throw new TypeError(message)
    }

    if (blockscoutResponse.message !== 'OK') {
      this.recordError(module, action, timeMs, blockscoutResponse.result)
      throw new BlockscoutError(blockscoutResponse.result)
    }

    this.logger.debug({ type: 'success', timeMs, module, action })
    return blockscoutResponse.result
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

function tryParseBlockscoutResponse(text: string) {
  try {
    return parseBlockscoutResponse(text)
  } catch {
    return undefined
  }
}
