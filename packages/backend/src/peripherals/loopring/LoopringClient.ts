import {
  getErrorMessage,
  HttpClient,
  Logger,
  RateLimiter,
} from '@l2beat/common'
import { UnixTime } from '@l2beat/types'

import { LoopringBlockResponse } from './schemas'

interface LoopringBlock {
  number: number
  timestamp: UnixTime
  transactions: number
}

interface LoopringClientOpts {
  callsPerMinute?: number
}

export class LoopringClient {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly logger: Logger,
    opts?: LoopringClientOpts,
  ) {
    this.logger = logger.for(this)
    if (opts?.callsPerMinute) {
      const rateLimiter = new RateLimiter({
        callsPerMinute: opts.callsPerMinute,
      })
      this.call = rateLimiter.wrap(this.call.bind(this))
    }
  }

  async getFinalizedBlock(): Promise<LoopringBlock> {
    const loopringBlock = await this.call('finalized')
    return toBlock(loopringBlock)
  }

  async getBlock(blockNumber: number): Promise<LoopringBlock> {
    const loopringBlock = await this.call(blockNumber)
    return toBlock(loopringBlock)
  }

  private async call(block: number | 'finalized') {
    const query = new URLSearchParams({ id: block.toString() })
    const url = `https://api3.loopring.io/api/v3/block/getBlock?${query.toString()}`

    const start = Date.now()
    const { httpResponse, error } = await this.httpClient
      .fetch(url, { timeout: 10_000 })
      .then(
        (httpResponse) => ({ httpResponse, error: undefined }),
        (error: unknown) => ({ httpResponse: undefined, error }),
      )
    const timeMs = Date.now() - start

    if (!httpResponse) {
      const message = getErrorMessage(error)
      this.recordError(block, timeMs, message)
      throw error
    }

    const text = await httpResponse.text()

    if (!httpResponse.ok) {
      this.recordError(block, timeMs, text)
      throw new Error(`Http error ${httpResponse.status}: ${text}`)
    }

    const json: unknown = JSON.parse(text)
    const loopringResponse = LoopringBlockResponse.safeParse(json)

    if (!loopringResponse.success) {
      const message = 'Invalid Loopring response.'
      this.recordError(block, timeMs, message)
      throw new TypeError(message)
    }

    this.logger.debug({ type: 'success', timeMs, block: block.toString() })

    return loopringResponse.data
  }

  private recordError(
    block: number | 'finalized',
    timeMs: number,
    message: string,
  ) {
    this.logger.debug({
      type: 'error',
      message,
      timeMs,
      block: block.toString(),
    })
  }
}

function toBlock(loopringBlock: LoopringBlockResponse): LoopringBlock {
  return {
    number: loopringBlock.blockId,
    timestamp: loopringBlock.createdAt,
    transactions: loopringBlock.transactions,
  }
}
