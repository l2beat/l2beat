import { getErrorMessage, HttpClient, Logger } from '@l2beat/common'

import {
  ZksyncBlocksResultSchema,
  ZksyncResponse,
  ZksyncTransactionResultSchema,
} from './schemas'

export class ZksyncClient {
  constructor(private httpClient: HttpClient, private logger: Logger) {
    this.logger = logger.for(this)
  }

  async getLatestBlock() {
    const result = await this.call('blocks/lastFinalized')

    const parsed = ZksyncBlocksResultSchema.parse(result)

    return parsed.blockNumber
  }

  async getTransactionsInBlock(blockNumber: number) {
    const result = await this.call(`blocks/${blockNumber}/transactions`, {
      from: 'latest',
      limit: '100',
      direction: 'older',
    })

    const parsed = ZksyncTransactionResultSchema.parse(result)

    if (parsed.list.length === 0) {
      throw new Error('Transactions list empty!')
    }
    let transactions = parsed.list

    let count = parsed.pagination.count
    while (count > 100) {
      const lastTx = transactions.at(-1)
      if (!lastTx) {
        throw new Error('Programmer error: Transactions list empty!')
      }

      const nextPage = await this.call(`blocks/${blockNumber}/transactions`, {
        from: lastTx.txHash,
        limit: '100',
        direction: 'older',
      })

      const parsedNextPage = ZksyncTransactionResultSchema.parse(nextPage)
      transactions = transactions.concat(parsedNextPage.list.slice(1))

      count -= 99
    }

    return transactions
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
