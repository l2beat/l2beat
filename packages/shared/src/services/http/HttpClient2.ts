import fetch, { RequestInit } from 'node-fetch'

interface HttpClient2Options {
  timeoutMs?: number
  maxRetries?: number
  initialRetryDelayMs?: number
  maxRetryDelayMs?: number
  statusCodesToRetry?: number[]
}

export class HttpClient2 {
  private readonly options: Required<HttpClient2Options>

  constructor(options: HttpClient2Options = {}) {
    this.options = {
      timeoutMs: 10_000,
      maxRetries: 10,
      initialRetryDelayMs: 1000,
      maxRetryDelayMs: 30000,
      statusCodesToRetry: [408, 429, 500, 502, 503, 504],
      ...options,
    }
  }

  async fetchJson(url: string, init?: RequestInit): Promise<unknown> {
    let retries = 0
    while (true) {
      try {
        const res = await fetch(url, {
          ...init,
          timeout: this.options.timeoutMs,
        })

        if (!res.ok) {
          const body = await res.text()
          throw new Error(`HTTP error: ${res.status} ${res.statusText} ${body}`)
        }

        return res.json()
      } catch (error) {
        if (retries >= this.options.maxRetries) {
          throw error
        }

        const delay = Math.min(
          this.options.initialRetryDelayMs * Math.pow(2, retries),
          this.options.maxRetryDelayMs,
        )
        await new Promise((resolve) => setTimeout(resolve, delay))
        retries++
      }
    }
  }
}
