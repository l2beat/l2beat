import type { Logger, RateLimiter } from '@l2beat/backend-tools'
import { UnixTime, type json } from '@l2beat/shared-pure'
import { ClientCore, type ClientCoreDependencies } from '../ClientCore'
import { BlockTimestampResponse, EtherscanResponse } from './types'

interface EtherscanOptions {
  type: 'etherscan'
  url: string
  apiKey: string
  chain: string
}

interface BlockscoutOptions {
  type: 'blockscout'
  url: string
  chain: string
}

interface Dependencies extends ClientCoreDependencies {
  options: EtherscanOptions | BlockscoutOptions
}

export class BlockIndexerClient extends ClientCore {
  private readonly binTimeWidth: number
  private readonly maximumCallsForBlockTimestamp: number
  private readonly options: EtherscanOptions | BlockscoutOptions

  constructor(private readonly $: Dependencies) {
    super($)
    this.options = $.options
    this.binTimeWidth = this.options.type === 'etherscan' ? 10 : 1
    this.maximumCallsForBlockTimestamp = this.options.type === 'etherscan' ? 3 : 10
  }

  static create(
    services: { httpClient: HttpClient; logger: Logger },
    rateLimiter: RateLimiter,
    options: EtherscanOptions | BlockscoutOptions,
  ) {
    return new BlockIndexerClient({
      http: services.httpClient,
      logger: services.logger,
      sourceName: options.chain,
      callsPerMinute: rateLimiter.callsPerMinute,
      retryStrategy: 'RELIABLE',
      options,
    })
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

        current = current.add(-this.binTimeWidth * UnixTime.MINUTE)
      }
      counter++
    }

    throw new Error('Could not fetch block number')
  }

  async call(module: string, action: string, params: Record<string, string>) {
    const query = new URLSearchParams({
      module,
      action,
      ...params,
    })

    if (this.options.type === 'etherscan') {
      query.append('apikey', this.options.apiKey)
    }
    const url = `${this.options.url}?${query.toString()}`

    const response = await this.fetch(url, {})
    return response
  }

  override validateResponse(response: json): {
    success: boolean
    message?: string
  } {
    const etherscanResponse = EtherscanResponse.safeParse(response)

    if (etherscanResponse.success === false) {
      return {
        success: false,
        message: `Invalid Etherscan response [${JSON.stringify(response)}]`,
      }
    }

    if (etherscanResponse.data.message === 'NOTOK') {
      return {
        success: false,
        message: JSON.stringify(etherscanResponse.data.result),
      }
    }

    return { success: true }
  }

  get chain(): string {
    return this.options.chain
  }
}

// This is needed for type checking in the constructor
interface HttpClient {
  fetch(url: string, init: Record<string, unknown>): Promise<json>
}
