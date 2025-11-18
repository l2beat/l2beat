import type { Logger } from '@l2beat/backend-tools'
import { assert } from '@l2beat/shared-pure'
import type { RequestInit } from 'node-fetch'

interface Deps {
  maxRetries: number
  initialRetryDelayMs: number
  maxRetryDelayMs: number
  logger: Logger
}

export type RetryHandlerVariant =
  | 'RELIABLE'
  | 'UNRELIABLE'
  | 'SCRIPT'
  | 'TEST'
  | 'RELIABLE_BIGGER_DELAY'

export class RetryHandler {
  constructor(private readonly $: Deps) {
    assert($.maxRetries > 0, 'maxRetries must be > 0')
    assert($.initialRetryDelayMs > 0, 'initialRetryDelayMs must be > 0')
    assert($.maxRetryDelayMs > 0, 'maxRetryDelayMs must be > 0')
    this.$.logger = this.$.logger.for(this)
  }

  async retry<T>(
    fn: () => Promise<T>,
    metadata?: { error?: unknown; url?: string; init?: RequestInit },
  ): Promise<T> {
    let attempt = 0
    let error = metadata?.error
    while (true) {
      const delay = Math.min(
        this.$.initialRetryDelayMs * Math.pow(2, attempt),
        this.$.maxRetryDelayMs,
      )
      attempt++
      this.$.logger.warn('Scheduling retry', {
        attempt: attempt,
        delay,
        error: error instanceof Error ? error.message : error,
        url: metadata?.url,
        init: metadata?.init,
      })
      await new Promise((resolve) => setTimeout(resolve, delay))

      try {
        return await fn()
      } catch (retryError) {
        error = retryError
        if (attempt >= this.$.maxRetries) {
          throw retryError
        }
      }
    }
  }

  static create = (retryStrategy: RetryHandlerVariant, logger: Logger) => {
    switch (retryStrategy) {
      case 'RELIABLE':
        return this.RELIABLE_API(logger)
      case 'UNRELIABLE':
        return this.UNRELIABLE_API(logger)
      case 'SCRIPT':
        return this.SCRIPT(logger)
      case 'TEST':
        return this.TEST(logger)
      case 'RELIABLE_BIGGER_DELAY':
        return this.RELIABLE_API_BIGGER_DELAY(logger)
    }
  }

  static RELIABLE_API = (logger: Logger) =>
    new RetryHandler({
      logger,
      initialRetryDelayMs: 1000,
      maxRetries: 3, // 1 2 4
      maxRetryDelayMs: Number.POSITIVE_INFINITY,
    })

  static RELIABLE_API_BIGGER_DELAY = (logger: Logger) =>
    new RetryHandler({
      logger,
      initialRetryDelayMs: 5000,
      maxRetries: 2, // 5 10
      maxRetryDelayMs: Number.POSITIVE_INFINITY,
    })

  static UNRELIABLE_API = (logger: Logger) =>
    new RetryHandler({
      logger,
      initialRetryDelayMs: 5000,
      maxRetries: 7, // 5 10 20 40 80 160 320
      maxRetryDelayMs: Number.POSITIVE_INFINITY,
    })

  static SCRIPT = (logger: Logger) =>
    new RetryHandler({
      logger: logger,
      initialRetryDelayMs: 1,
      maxRetries: 3,
      maxRetryDelayMs: Number.POSITIVE_INFINITY,
    })

  static TEST = (logger: Logger) =>
    new RetryHandler({
      logger: logger,
      initialRetryDelayMs: 1,
      maxRetries: 1,
      maxRetryDelayMs: Number.POSITIVE_INFINITY,
    })
}
