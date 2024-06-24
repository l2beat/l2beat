import { Logger } from '@l2beat/backend-tools'
import {
  ChainId,
  RateLimiter,
  UnixTime,
  stringAsInt,
} from '@l2beat/shared-pure'

import { HttpClient } from '../HttpClient'
import { EtherscanResponse } from './EtherscanResponse'

const MAXIMUM_CALLS_FOR_BLOCK_TIMESTAMP = 6

export class EtherscanClient {
  private readonly rateLimiter = new RateLimiter({
    callsPerMinute: 150,
  })
  private readonly timeoutMs = 20_000

  constructor(
    private readonly httpClient: HttpClient,
    private readonly url: string,
    private readonly apiKey: string,
  ) {
    this.call = this.rateLimiter.wrap(this.call.bind(this))
  }

  static create(
    services: { httpClient: HttpClient; logger: Logger },
    options: {
      url: string
      apiKey: string
      chainId: ChainId
    },
  ) {
    return new EtherscanClient(services.httpClient, options.url, options.apiKey)
  }

  // Etherscan API is not stable enough to trust it to return "closest" block.
  // There is a case when there is not enough activity on a given chain
  // so that blocks come in a greater than 10 minutes intervals,
  // e.g block 0 @ 22:45 and block 1 @ 23:15
  // if you query for 23:00 Etherscan API returns "No closes block found".
  //
  // To mitigate this, we need to go back in time by 10 minutes until we find a block
  async getBlockNumberAtOrBefore(timestamp: UnixTime): Promise<number> {
    let current = new UnixTime(timestamp.toNumber())

    let counter = 1
    while (counter <= MAXIMUM_CALLS_FOR_BLOCK_TIMESTAMP) {
      try {
        const result = await this.call('block', 'getblocknobytime', {
          timestamp: current.toString(),
          closest: 'before',
        })

        return stringAsInt().parse(result)
      } catch (error) {
        if (typeof error !== 'object') {
          const errorString =
            typeof error === 'string' ? error : 'Unknown error type caught'
          throw new Error(errorString)
        }

        const errorObject = error as Error
        if (!errorObject.message.includes('No closest block found')) {
          throw new Error(errorObject.message)
        }

        current = current.add(-10, 'minutes')
      }
      counter++
    }

    throw new Error('Could not fetch block number', {
      cause: {
        current,
        timestamp,
        calls: MAXIMUM_CALLS_FOR_BLOCK_TIMESTAMP,
      },
    })
  }

  async call(module: string, action: string, params: Record<string, string>) {
    const query = new URLSearchParams({
      module,
      action,
      ...params,
      apikey: this.apiKey,
    })
    const url = `${this.url}?${query.toString()}`

    const { httpResponse, error } = await this.httpClient
      .fetch(url, { timeout: this.timeoutMs })
      .then(
        (httpResponse) => ({ httpResponse, error: undefined }),
        (error: unknown) => ({ httpResponse: undefined, error }),
      )

    if (!httpResponse) {
      throw error
    }

    if (!httpResponse.ok) {
      throw new Error(
        `Server responded with non-2XX result: ${httpResponse.status} ${httpResponse.statusText}`,
      )
    }

    const text = await httpResponse.text()
    const etherscanResponse = EtherscanResponse.safeParse(JSON.parse(text))

    if (etherscanResponse.success === false) {
      const message = `Invalid Etherscan response [${text}] for request [${url}].`
      throw new TypeError(message)
    }

    if (etherscanResponse.data.message === 'NOTOK') {
      throw new Error(JSON.stringify(etherscanResponse.data.result))
    }

    return etherscanResponse.data.result
  }
}
