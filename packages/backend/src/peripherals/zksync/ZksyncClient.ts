import { HttpClient, Logger } from '@l2beat/shared'
import {
  assert,
  getErrorMessage,
  RateLimiter,
  UnixTime,
} from '@l2beat/shared-pure'

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

const PAGE_LIMIT = 100
const CALLS_PER_MINUTE = 60

export class ZksyncClient {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly logger: Logger,
    callsPerMinute = CALLS_PER_MINUTE,
  ) {
    this.logger = logger.for(this)
    const rateLimiter = new RateLimiter({
      callsPerMinute,
    })
    this.call = rateLimiter.wrap(this.call.bind(this))
  }

  async getLatestBlock() {
    const result = await this.call('blocks/lastFinalized')

    const parsed = ZksyncBlocksResultSchema.safeParse(result)

    if (!parsed.success) {
      throw new TypeError('Invalid Zksync block schema')
    }

    return parsed.data.blockNumber
  }

  async getTransactionsInBlock(blockNumber: number) {
    const firstPage = await this.getTransactionsPage(blockNumber, 'latest')

    if (firstPage.list.length === 0) {
      throw new Error('Transactions list empty!')
    }

    let transactions = firstPage.list
    const count = firstPage.pagination.count
    while (count - transactions.length > 0) {
      const lastTx = transactions.at(-1)
      assert(lastTx, 'Transactions list empty!')

      const nextPage = await this.getTransactionsPage(
        blockNumber,
        lastTx.txHash,
      )

      if (nextPage.list[0].txHash !== lastTx.txHash) {
        throw new Error('Invalid Zksync first transaction')
      }

      transactions = transactions.concat(nextPage.list.slice(1))
    }

    const filteredTransactions = transactions.filter(
      (t): t is Transaction => t.blockIndex !== null,
    )

    return filteredTransactions
  }

  private async getTransactionsPage(blockNumber: number, from: string) {
    const result = await this.call(`blocks/${blockNumber}/transactions`, {
      from,
      limit: PAGE_LIMIT.toString(),
      direction: 'older',
    })

    const parsed = ZksyncTransactionResultSchema.safeParse(result)

    if (!parsed.success) {
      throw new TypeError('Invalid Zksync transactions schema')
    }

    return parsed.data
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
