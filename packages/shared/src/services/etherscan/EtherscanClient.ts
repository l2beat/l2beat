import { Logger } from '@l2beat/backend-tools'
import {
  EthereumAddress,
  RateLimiter,
  UnixTime,
  stringAsInt,
} from '@l2beat/shared-pure'

import { z } from 'zod'
import { HttpClient } from '../HttpClient'
import { ContractSourceResult, EtherscanResponse } from './EtherscanResponse'

interface EtherscanOptions {
  type: 'Etherscan'
  url: string
  apiKey: string
}

interface BlockscoutOptions {
  type: 'Blockscout'
  url: string
}

export class EtherscanClient {
  private readonly rateLimiter = new RateLimiter({
    callsPerMinute: 150,
  })
  private readonly timeoutMs = 20_000
  private readonly maximumCallForBlockTimestamp
  private readonly minimumTimestampInterval

  constructor(
    private readonly httpClient: HttpClient,
    private readonly options: EtherscanOptions | BlockscoutOptions,
  ) {
    this.call = this.rateLimiter.wrap(this.call.bind(this))
    this.minimumTimestampInterval = options.type === 'Etherscan' ? 10 : 1
    this.maximumCallForBlockTimestamp = options.type === 'Etherscan' ? 3 : 30
  }

  static create(
    services: { httpClient: HttpClient; logger: Logger },
    options: EtherscanOptions | BlockscoutOptions,
  ) {
    return new EtherscanClient(services.httpClient, options)
  }

  // There is a case when there is not enough activity on a given chain
  // so that blocks come in a greater than minimumTimestampInterval intervals
  async getBlockNumberAtOrBefore(timestamp: UnixTime): Promise<number> {
    let current = new UnixTime(timestamp.toNumber())

    let counter = 1
    while (counter <= this.maximumCallForBlockTimestamp) {
      try {
        const result = await this.call('block', 'getblocknobytime', {
          timestamp: current.toString(),
          closest: 'before',
        })

        return this.options.type === 'Etherscan'
          ? stringAsInt().parse(result)
          : z
              .object({
                blockNumber: z.coerce.number(),
              })
              .parse(result).blockNumber
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

        current = current.add(-this.minimumTimestampInterval, 'minutes')
      }
      counter++
    }

    throw new Error('Could not fetch block number', {
      cause: {
        current,
        timestamp,
        calls: this.maximumCallForBlockTimestamp,
      },
    })
  }

  async getContractSource(address: EthereumAddress) {
    const response = await this.call('contract', 'getsourcecode', {
      address: address.toString(),
    })
    return ContractSourceResult.parse(response)[0]
  }

  async call(module: string, action: string, params: Record<string, string>) {
    const query = new URLSearchParams({
      module,
      action,
      ...params,
    })

    if (this.options.type === 'Etherscan') {
      query.append('apikey', this.options.apiKey)
    }
    const url = `${this.options.url}?${query.toString()}`

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
