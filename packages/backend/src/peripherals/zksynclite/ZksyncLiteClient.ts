import { Logger, RateLimiter } from '@l2beat/backend-tools'
import { HttpClient2, RetryHandler } from '@l2beat/shared'
import { assert, UnixTime } from '@l2beat/shared-pure'

import { getBlockNumberAtOrBefore } from '../getBlockNumberAtOrBefore'
import {
  ZksyncLiteBlocksResultSchema,
  ZksyncLiteResponse,
  ZksyncLiteTransactionResultSchema,
} from './schemas'

interface Transaction {
  txHash: string
  blockIndex: number
  createdAt: UnixTime
}

interface Dependencies {
  url: string
  http: HttpClient2
  rateLimiter: RateLimiter
  retryHandler: RetryHandler
  logger: Logger
  chain: string
}

const PAGE_LIMIT = 100

export class ZksyncLiteClient {
  constructor(private readonly $: Dependencies) {
    this.$.logger = this.$.logger.for(this).tag($.chain)
  }

  async getLatestBlock() {
    const result = await this.query('blocks/lastFinalized')

    const parsed = ZksyncLiteBlocksResultSchema.safeParse(result)

    if (!parsed.success) {
      throw new TypeError('Invalid Zksync block schema')
    }

    return parsed.data.blockNumber
  }

  async getBlockNumberAtOrBefore(timestamp: UnixTime, start = 0) {
    const end = await this.getLatestBlock()

    return await getBlockNumberAtOrBefore(
      timestamp,
      start,
      end,
      async (blockNumber) => {
        const transactions = await this.getTransactionsInBlock(blockNumber)
        return {
          timestamp: Math.min(
            ...transactions.map((t) => t.createdAt.toNumber()),
          ),
        }
      },
    )
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
    const result = await this.query(`blocks/${blockNumber}/transactions`, {
      from,
      limit: PAGE_LIMIT.toString(),
      direction: 'older',
    })

    const parsed = ZksyncLiteTransactionResultSchema.safeParse(result)

    if (!parsed.success) {
      throw new TypeError('Invalid Zksync transactions schema')
    }

    return parsed.data
  }

  async query(path: string, params?: Record<string, string>) {
    try {
      return await this.$.rateLimiter.call(() => this._query(path, params))
    } catch {
      return await this.$.retryHandler.retry(() =>
        this.$.rateLimiter.call(() => this._query(path, params)),
      )
    }
  }

  private async _query(path: string, params?: Record<string, string>) {
    const query = new URLSearchParams(params)
    const url = `${this.$.url}/${path}?${query.toString()}`

    const response = await this.$.http.fetch(url, { timeout: 20_000 })

    const zksyncLiteResponse = ZksyncLiteResponse.safeParse(response)

    if (!zksyncLiteResponse.success) {
      const message = 'Invalid Zksync response.'
      throw new TypeError(message)
    }

    if (zksyncLiteResponse.data.status !== 'success') {
      throw new Error(zksyncLiteResponse.data.error.message)
    }

    return zksyncLiteResponse.data.result
  }
}
