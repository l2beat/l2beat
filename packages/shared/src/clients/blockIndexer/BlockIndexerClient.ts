import type { Logger, RateLimiter } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
import type { HttpClient } from '../http/HttpClient'
import { BlockTimestampResponse, EtherscanResponse } from './types'

interface EtherscanOptions {
  type: 'etherscan'
  url: string
  apiKey: string
  chain: string
  chainId: number
}

interface BlockscoutOptions {
  type: 'blockscout'
  url: string
  chain: string
}

interface RoutescanOptions {
  type: 'routescan'
  url: string
  chain: string
}

// TODO: add retries, use HttpClient
export class BlockIndexerClient {
  chain: string

  // If you ask for a timestamp
  // and there were no blocks for <timestamp - binTimeWidth, timestamp>
  // API will return the error
  private readonly binTimeWidth
  private readonly maximumCallsForBlockTimestamp

  constructor(
    private readonly httpClient: HttpClient,
    private readonly rateLimiter: RateLimiter,
    private readonly options:
      | EtherscanOptions
      | BlockscoutOptions
      | RoutescanOptions,
  ) {
    this.call = this.rateLimiter.wrap(this.call.bind(this))
    this.binTimeWidth =
      options.type === 'etherscan' || options.type === 'routescan' ? 10 : 1
    this.maximumCallsForBlockTimestamp =
      options.type === 'etherscan' || options.type === 'routescan' ? 3 : 10
    this.chain = options.chain
  }

  static create(
    services: { httpClient: HttpClient; logger: Logger },
    rateLimiter: RateLimiter,
    options: EtherscanOptions | BlockscoutOptions | RoutescanOptions,
  ) {
    return new BlockIndexerClient(services.httpClient, rateLimiter, options)
  }

  // There is a case when there is not enough activity on a given chain
  // so that blocks come in a greater than timestampIndexingInterval intervals
  async getBlockNumberAtOrBefore(timestamp: UnixTime): Promise<number> {
    let current = UnixTime(timestamp)

    let counter = 1
    while (counter <= this.maximumCallsForBlockTimestamp) {
      try {
        const result = await this.call('block', 'getblocknobytime', {
          timestamp: current.toString(),
          closest: 'before',
        })

        return BlockTimestampResponse.parse(result)
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

        current -= this.binTimeWidth * UnixTime.MINUTE
      }
      counter++
    }

    throw new Error('Could not fetch block number', {
      cause: {
        current,
        timestamp,
        calls: this.maximumCallsForBlockTimestamp,
      },
    })
  }

  async call(module: string, action: string, params: Record<string, string>) {
    const query = new URLSearchParams({
      module,
      action,
      ...params,
    })

    if (this.options.type === 'etherscan') {
      query.append('apikey', this.options.apiKey)
      query.append('chainId', this.options.chainId.toString())
    }
    const url = `${this.options.url}?${query.toString()}`

    const response = await this.httpClient.fetch(url, {})

    const etherscanResponse = EtherscanResponse.safeParse(response)

    if (etherscanResponse.success === false) {
      const message = `Invalid Etherscan response [${JSON.stringify(response)}] for request [${url}].`
      throw new TypeError(message)
    }

    if (etherscanResponse.data.message === 'NOTOK') {
      throw new Error(JSON.stringify(etherscanResponse.data.result))
    }

    return etherscanResponse.data.result
  }
}
