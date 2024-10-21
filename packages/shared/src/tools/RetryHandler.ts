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
    let attempt = 0

    while (true) {
      const delay = Math.min(
        this.$.initialRetryDelayMs * Math.pow(2, attempt),
        this.$.maxRetryDelayMs,
      )
      attempt++
      this.$.logger.warn('Scheduling retry', {
        attempt: attempt,
        delay,
      })
      await new Promise((resolve) => setTimeout(resolve, delay))

      try {
        return await fn()
      } catch (error) {
        if (attempt >= this.$.maxRetries) {
          throw error
        }
      }
    }
  }

  static RELIABLE_API = (logger: Logger) =>
    new RetryHandler({
      logger,
      initialRetryDelayMs: 1000,
      maxRetries: 3, // 1 2 4
      maxRetryDelayMs: Infinity,
    })

  static UNRELIABLE_API = (logger: Logger) =>
    new RetryHandler({
      logger,
      initialRetryDelayMs: 5000,
      maxRetries: 4, // 5 10 20 40
      maxRetryDelayMs: Infinity,
    })

  static TEST = new RetryHandler({
    logger: Logger.SILENT,
    initialRetryDelayMs: 1,
    maxRetries: 1,
    maxRetryDelayMs: Infinity,
  })
}
