import {
  assert,
  type Block,
  type json,
  type UnixTime,
} from '@l2beat/shared-pure'

import { getBlockNumberAtOrBefore } from '../../tools/getBlockNumberAtOrBefore'
import { ClientCore, type ClientCoreDependencies } from '../ClientCore'
import type { BlockClient } from '../types'
import {
  ZksyncLiteBlocksResult,
  ZksyncLiteError,
  ZksyncLiteTransactionResult,
} from './types'

interface Dependencies extends ClientCoreDependencies {
  url: string
}

interface Transaction {
  txHash: string
  blockIndex: number
  createdAt: UnixTime
}

export class ZksyncLiteClient extends ClientCore implements BlockClient {
  constructor(private $: Dependencies) {
    super($)
  }

  async getLatestBlockNumber() {
    const result = await this.query('blocks/lastFinalized')
    const parsed = ZksyncLiteBlocksResult.safeParse(result)

    if (!parsed.success) {
      throw new TypeError('Invalid Zksync block schema')
    }

    return parsed.data.result.blockNumber
  }

  async getBlockNumberAtOrBefore(timestamp: UnixTime, start = 0) {
    const end = await this.getLatestBlockNumber()

    return await getBlockNumberAtOrBefore(
      timestamp,
      start,
      end,
      async (blockNumber) => {
        const transactions = await this.getTransactionsInBlock(blockNumber)
        return {
          timestamp: Math.min(...transactions.map((t) => t.createdAt)),
        }
      },
    )
  }

  async getBlockWithTransactions(tag: number | 'latest'): Promise<Block> {
    const blockNumber =
      tag === 'latest' ? await this.getLatestBlockNumber() : tag

    const transactions = await this.getTransactionsInBlock(blockNumber)

    return {
      number: blockNumber,
      hash: 'UNSUPPORTED',
      timestamp: Math.min(...transactions.map((t) => t.createdAt)),
      transactions: transactions.map((t) => ({
        hash: t.txHash,
      })),
    }
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
      limit: '100', // our current heuristic, can be changed if needed
      direction: 'older',
    })
    const parsed = ZksyncLiteTransactionResult.safeParse(result)

    if (!parsed.success) {
      throw new TypeError('Invalid Zksync transactions schema')
    }

    return parsed.data.result
  }

  async query(path: string, params?: Record<string, string>) {
    const query = new URLSearchParams(params)
    const url = `${this.$.url}/${path}?${query.toString()}`

    return await this.fetch(url, { timeout: 20_000 })
  }

  override validateResponse(response: json) {
    const parsedError = ZksyncLiteError.safeParse(response)

    if (parsedError.success) {
      this.$.logger.warn('Response validation error', {
        ...parsedError.data.error,
      })
      return { success: false }
    }

    return { success: true }
  }

  get chain() {
    return 'zksync'
  }
}
