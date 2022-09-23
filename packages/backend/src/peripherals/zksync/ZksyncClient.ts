import { getErrorMessage, HttpClient, Logger } from '@l2beat/common'

import { parseZksyncResponse } from './parseZksyncResponse'
import {
  ZksyncBlocksResultSchema,
  ZksyncTransactionResultSchema,
} from './schemas'

export class ZksyncClient {
  constructor(private httpClient: HttpClient, private logger: Logger) {
    this.logger = logger.for(this)
  }

  async getLatestBlock() {
    const result = await this.call('/blocks/lastFinalized')

    const parsed = ZksyncBlocksResultSchema.parse(result)

    return parsed.blockNumber
  }

  async getTransactionsInBlock(blockNumber: number) {
    const result = await this.call(`/blocks/${blockNumber}/transactions`, {
      from: 'latest',
      limit: '100',
      direction: 'older',
    })

    const parsed = ZksyncTransactionResultSchema.parse(result)

    if (parsed.list.length === 0) {
      throw new Error('Transactions list empty!')
    }

    // TODO: pagination

    return parsed.list
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
    const zksyncResponse = tryParseZksyncResponse(text)

    if (!httpResponse.ok) {
      this.recordError(path, timeMs, text)
      throw new Error(`Http error ${httpResponse.status}: ${text}`)
    }

    if (!zksyncResponse) {
      const message = 'Invalid Zksync response.'
      this.recordError(path, timeMs, message)
      throw new TypeError(message)
    }

    if (zksyncResponse.status !== 'success') {
      this.recordError(path, timeMs, zksyncResponse.error.message)
      throw new Error(zksyncResponse.error.message)
    }

    this.logger.debug({ type: 'success', timeMs, path })

    return zksyncResponse.result
  }

  private recordError(path: string, timeMs: number, message: string) {
    this.logger.debug({ type: 'error', message, timeMs, path })
  }
}

function tryParseZksyncResponse(text: string) {
  try {
    return parseZksyncResponse(text)
  } catch {
    return undefined
  }
}
