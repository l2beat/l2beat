import { Logger } from '@l2beat/backend-tools'
import fetch, { RequestInit } from 'node-fetch'

interface HttpClient2Options {
  timeoutMs?: number
  maxRetries?: number
  initialRetryDelayMs?: number
  maxRetryDelayMs?: number
  logger?: Logger
}

const DEFAULT_HTTP_RETRY_STRATEGY = {
  timeoutMs: 10_000,
  initialRetryDelayMs: 1000,
  maxRetries: 5, // 1 2 4 8 16 = 31s
  maxRetryDelayMs: Infinity,
}

export class HttpClient2 {
  private readonly $: Required<HttpClient2Options>

  constructor($: HttpClient2Options = {}) {
    this.$ = {
      logger: Logger.SILENT,
      ...DEFAULT_HTTP_RETRY_STRATEGY,
      ...$,
    }
    this.$.logger = this.$.logger.for(this)
  }

  /**
   * Sends request to the provided url with init params.
   * Use this method only when you expect server to return valid JSON.
   * Provides retries, in most cases this will be DEFAULT_HTTP_RETRY_STRATEGY
   */
  async fetch(url: string, init?: RequestInit): Promise<unknown> {
    let calls = 0
    while (true) {
      try {
        return await this.fetchJson(url, init)
      } catch (error) {
        if (calls >= this.$.maxRetries) {
          throw error
        }

        const delay = this.calculateDelay(calls)
        this.logAttempt(url, init, calls, delay)
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
      calls++
    }
  }

  private async fetchJson(url: string, init?: RequestInit) {
    const res = await fetch(url, {
      ...init,
      timeout: this.$.timeoutMs,
    })

    if (!res.ok) {
      const body = await res.text().catch(() => '')
      throw new Error(`HTTP error: ${res.status} ${res.statusText} ${body}`)
    }

    return res.json()
  }

  private calculateDelay(calls: number) {
    return Math.min(
      this.$.initialRetryDelayMs * Math.pow(2, calls),
      this.$.maxRetryDelayMs,
    )
  }

  private logAttempt(
    url: string,
    init: RequestInit | undefined,
    calls: number,
    delay: number,
  ) {
    this.$.logger.warn('Failed to fetch, scheduling retry', {
      url,
      body: init?.body,
      attempt: calls + 1,
      delay,
    })
  }
}
