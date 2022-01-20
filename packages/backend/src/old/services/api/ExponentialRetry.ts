import { Logger, retry } from '@l2beat/common'

export interface RetryOptions {
  startTimeout: number
  maxRetryCount: number
}

export class ExponentialRetry {
  constructor(private options: RetryOptions, private logger?: Logger) {}

  async call<T>(fn: () => Promise<T>, name?: string): Promise<T> {
    return retry(fn, {
      minTimeout: this.options.startTimeout,
      maxRetryCount: this.options.maxRetryCount,
      onError: (e) => {
        if (this.logger && name) {
          const msg = e instanceof Error ? e.message : '' + e
          this.logger.error(`${name} ${msg}`)
        }
      },
    })
  }
}
