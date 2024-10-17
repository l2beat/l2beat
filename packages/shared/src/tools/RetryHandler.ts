import { Logger } from '@l2beat/backend-tools'
import { assert } from '@l2beat/shared-pure'

interface Deps {
  maxRetries: number
  initialRetryDelayMs: number
  maxRetryDelayMs: number
  logger: Logger
}

export class RetryHandler {
  constructor(private readonly $: Deps) {
    assert($.maxRetries > 0, 'maxRetries must be > 0')
    assert($.initialRetryDelayMs > 0, 'initialRetryDelayMs must be > 0')
    assert($.maxRetryDelayMs > 0, 'maxRetryDelayMs must be > 0')
    this.$.logger = this.$.logger.for(this)
  }

  async retry<T>(fn: () => Promise<T>): Promise<T> {
    let attempt = 1

    while (true) {
      const delay = Math.min(
        this.$.initialRetryDelayMs * Math.pow(2, attempt),
        this.$.maxRetryDelayMs,
      )
      this.$.logger.warn('Scheduling retry', {
        attempt: attempt,
        delay,
        // TODO: log args
      })
      await new Promise((resolve) => setTimeout(resolve, delay))

      try {
        return await fn()
      } catch (error) {
        attempt++
        if (attempt > this.$.maxRetries) {
          throw error
        }
      }
    }
  }

  static HTTP = (logger: Logger) =>
    new RetryHandler({
      logger,
      initialRetryDelayMs: 1000,
      maxRetries: 5, // 2 4 8 16 32 ~ 1min
      maxRetryDelayMs: Infinity,
    })

  static RPC = (logger: Logger) =>
    new RetryHandler({
      logger,
      initialRetryDelayMs: 5000,
      maxRetries: 3, // 10 20 40 ~ 1min
      maxRetryDelayMs: Infinity,
    })

  static TEST = new RetryHandler({
    logger: Logger.SILENT,
    initialRetryDelayMs: 1,
    maxRetries: 1,
    maxRetryDelayMs: Infinity,
  })
}
