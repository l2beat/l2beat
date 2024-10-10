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

export class HttpClient2 {
  private readonly $: Required<HttpClient2Options>

  constructor($: HttpClient2Options = {}) {
    this.$ = {
      timeoutMs: 10_000,
      maxRetries: 10,
      initialRetryDelayMs: 1000,
      maxRetryDelayMs: 30000,
      statusCodesToRetry: [408, 429, 500, 502, 503, 504],
      logger: Logger.SILENT,
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
