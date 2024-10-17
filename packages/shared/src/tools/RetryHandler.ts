import { Logger } from '@l2beat/backend-tools'
import { assert } from '@l2beat/shared-pure'

interface Deps {
  timeoutMs: number
  maxRetries: number
  initialRetryDelayMs: number
  maxRetryDelayMs: number
  logger: Logger
}

const DEFAULT_RETRY_STRATEGY = {
  timeoutMs: 10_000,
  initialRetryDelayMs: 1000,
  maxRetries: 5, // 2 4 8 16 32 ~ 1min
  maxRetryDelayMs: Infinity,
}

export class RetryHandler {
  constructor(private readonly $: Deps) {
    assert($.maxRetries > 0, 'Max retries cannot be zero')
    this.$.logger = this.$.logger.for(this)
  }

  async retry<T>(fn: () => Promise<T>): Promise<T> {
    let attempt = 1

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

    while (true) {
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

  static DEFAULT = (logger: Logger) =>
    new RetryHandler({
      logger,
      ...DEFAULT_RETRY_STRATEGY,
    })
}
