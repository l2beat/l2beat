import { Logger } from '@l2beat/backend-tools'
import fetch, { RequestInit, Response } from 'node-fetch'

interface HttpClient2Options {
  timeoutMs?: number
  maxRetries?: number
  initialRetryDelayMs?: number
  maxRetryDelayMs?: number
  statusCodesToRetry?: number[]
  logger?: Logger
}

const DEFAULT_HTTP_RETRY_STRATEGY = {
  timeoutMs: 10_000,
  initialRetryDelayMs: 1000,
  maxRetries: 5, // 1 2 4 8 16 = 31s
  maxRetryDelayMs: Infinity,
  statusCodesToRetry: [408, 429, 500, 502, 503, 504],
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

  async fetchJson(url: string, init?: RequestInit): Promise<unknown> {
    let calls = 0
    while (true) {
      try {
        const res = await fetch(url, {
          ...init,
          timeout: this.$.timeoutMs,
        })
        const { success, shouldRetry } = this.assertStatus(calls, res)

        if (success) {
          return res.json()
        }

        if (!shouldRetry) {
          const body = await res.text()
          throw new Error(`HTTP error: ${res.status} ${res.statusText} ${body}`)
        }
      } catch (error) {
        if (!this.shouldRetryFetch(calls)) {
          throw error
        }
      }

      const delay = Math.min(
        this.$.initialRetryDelayMs * Math.pow(2, calls),
        this.$.maxRetryDelayMs,
      )
      this.$.logger.warn('Failed to fetch, scheduling retry...', {
        url,
        body: init?.body,
        attempt: calls + 1,
        delay,
      })
      await new Promise((resolve) => setTimeout(resolve, delay))
      calls++
    }
  }

  private assertStatus(calls: number, res: Response) {
    if (res.ok) {
      return { success: true }
    }

    const shouldRetry =
      this.shouldRetryFetch(calls) &&
      this.$.statusCodesToRetry.includes(res.status)

    return { success: false, shouldRetry }
  }

  private shouldRetryFetch(calls: number): boolean {
    return calls < this.$.maxRetries
  }
}
