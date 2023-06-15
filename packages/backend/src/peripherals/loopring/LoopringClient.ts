import { HttpClient, Logger } from '@l2beat/shared'
import { getErrorMessage, RateLimiter } from '@l2beat/shared-pure'

import { LoopringResponse } from './schemas'

type Block = number | 'finalized'

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

  async getFinalizedBlockNumber() {
    const block = await this.call('finalized')
    return block.blockId
  }

  async getBlock(blockNumber: number) {
    return await this.call(blockNumber)
  }

  private async call(block: Block) {
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
    const loopringResponse = LoopringResponse.safeParse(json)

    if (!loopringResponse.success) {
      const message = 'Invalid Loopring response.'
      this.recordError(block, timeMs, message)
      throw new TypeError(message)
    }

    this.logger.debug({ type: 'success', timeMs, block: block.toString() })

    return loopringResponse.data
  }

  private recordError(block: Block, timeMs: number, message: string) {
    this.logger.debug({
      type: 'error',
      message,
      timeMs,
      block: block.toString(),
    })
  }
}
