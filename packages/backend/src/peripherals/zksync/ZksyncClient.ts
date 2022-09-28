import {
  getErrorMessage,
  HttpClient,
  Logger,
  RateLimiter,
} from '@l2beat/common'
import { UnixTime } from '@l2beat/types'

import {
  ZksyncBlocksResultSchema,
  ZksyncResponse,
  ZksyncTransactionResultSchema,
} from './schemas'

interface Transaction {
  txHash: string
  blockIndex: number
  createdAt: UnixTime
}

export class ZksyncClient {
  constructor(private httpClient: HttpClient, private logger: Logger) {
    this.logger = logger.for(this)
    const rateLimiter = new RateLimiter({
      callsPerMinute: 3000,
    })
    this.call = rateLimiter.wrap(this.call.bind(this))
  }

  async getLatestBlock() {
    const result = await this.call('blocks/lastFinalized')

    const parsed = ZksyncBlocksResultSchema.safeParse(result)

    if (!parsed.success) {
      throw new TypeError('Invalid zksync block schema')
    }

    return parsed.data.blockNumber
  }

  async getTransactionsInBlock(blockNumber: number) {
    const result = await this.call(`blocks/${blockNumber}/transactions`, {
      from: 'latest',
      limit: '100',
      direction: 'older',
    })

    const parsed = ZksyncTransactionResultSchema.safeParse(result)

    if (!parsed.success) {
      throw new TypeError('Invalid zksync transactions response')
    }

    if (parsed.data.list.length === 0) {
      throw new Error('Transactions list empty!')
    }
    let transactions = parsed.data.list

    const count = parsed.data.pagination.count
    while (count - transactions.length > 0) {
      const lastTx = transactions.at(-1)
      if (!lastTx) {
        throw new Error('Programmer error: Transactions list empty!')
      }

      const nextPage = await this.call(`blocks/${blockNumber}/transactions`, {
        from: lastTx.txHash,
        limit: '100',
        direction: 'older',
      })

      const parsedNextPage = ZksyncTransactionResultSchema.safeParse(nextPage)

      if (!parsedNextPage.success) {
        throw new TypeError('Invalid zksync transactions schema')
      }

      transactions = transactions.concat(parsedNextPage.data.list.slice(1))
    }

    const filteredTransactions = transactions.filter(
      (t): t is Transaction => t.blockIndex !== null,
    )

    return filteredTransactions
  }

  async call(path: string, params?: Record<string, string>) {
    const query = new URLSearchParams(params)
    const url = `https://api.zksync.io/api/v0.2/${path}?${query.toString()}`

    const start = Date.now()
    const { httpResponse, error } = await this.httpClient
      .fetch(url, { timeout: 20_000 })
      .then(
        (httpResponse) => ({ httpResponse, error: undefined }),
        (error: unknown) => ({ httpResponse: undefined, error }),
      )
    const timeMs = Date.now() - start

    if (!httpResponse) {
      const message = getErrorMessage(error)
      this.recordError(path, timeMs, message)
      throw error
    }

    const text = await httpResponse.text()

    if (!httpResponse.ok) {
      this.recordError(path, timeMs, text)
      throw new Error(`Http error ${httpResponse.status}: ${text}`)
    }

    const json: unknown = JSON.parse(text)
    const zksyncResponse = ZksyncResponse.safeParse(json)

    if (!zksyncResponse.success) {
      const message = 'Invalid Zksync response.'
      this.recordError(path, timeMs, message)
      throw new TypeError(message)
    }

    if (zksyncResponse.data.status !== 'success') {
      this.recordError(path, timeMs, zksyncResponse.data.error.message)
      throw new Error(zksyncResponse.data.error.message)
    }

    this.logger.debug({ type: 'success', timeMs, path })

    return zksyncResponse.data.result
  }

  private recordError(path: string, timeMs: number, message: string) {
    this.logger.debug({ type: 'error', message, timeMs, path })
  }
}
