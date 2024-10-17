import { Logger } from '@l2beat/backend-tools'

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
    this.$.logger = this.$.logger.for(this)
  }

  async retry<T>(fn: () => Promise<T>): Promise<T> {
    let attempts = 0

    while (true) {
      attempts++
      try {
        return await fn()
      } catch (error) {
        if (attempts > this.$.maxRetries) {
          throw error
        }

        const delay = Math.min(
          this.$.initialRetryDelayMs * Math.pow(2, attempts),
          this.$.maxRetryDelayMs,
        )

        this.$.logger.warn('Retry attempt failed, retrying...', {
          attempt: attempts,
          delay,
          // TODO: log args
        })

        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
  }

  static DEFAULT = (logger: Logger) =>
    new RetryHandler({
      logger,
      ...DEFAULT_RETRY_STRATEGY,
    })
}
