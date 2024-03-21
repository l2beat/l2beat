import { Logger } from '@l2beat/backend-tools'
import { HttpClient } from '@l2beat/shared'
import { getErrorMessage, RateLimiter } from '@l2beat/shared-pure'

import { DegateResponse } from './schemas'

type Block = number | 'latest'

interface DegateClientOpts {
  callsPerMinute?: number
}

export class DegateClient {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly logger: Logger,
    private readonly url: string,
    opts?: DegateClientOpts,
  ) {
    this.logger = logger.for(this)
    if (opts?.callsPerMinute) {
      const rateLimiter = new RateLimiter({
        callsPerMinute: opts.callsPerMinute,
      })
      this.call = rateLimiter.wrap(this.call.bind(this))
    }
  }

  static create(
    services: { httpClient: HttpClient; logger: Logger },
    options: { url: string; callsPerMinute: number | undefined },
  ): DegateClient {
    return new DegateClient(
      services.httpClient,
      services.logger,
      options.url,
      options,
    )
  }

  async getLatestBlockNumber() {
    const block = await this.call('latest')
    return block.blockId
  }

  async getBlock(blockNumber: number) {
    return await this.call(blockNumber)
  }

  private async call(block: Block) {
    const query = new URLSearchParams({ id: block.toString() })
    const url = `${this.url}/block/getBlock?${query.toString()}`

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
    const degateResponse = DegateResponse.safeParse(json)

    if (!degateResponse.success) {
      const message = 'Invalid Degate response.'
      this.recordError(block, timeMs, message)
      throw new TypeError(message)
    }

    this.logger.debug({ type: 'success', timeMs, block: block.toString() })

    return degateResponse.data.data
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
