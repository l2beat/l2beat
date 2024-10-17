import fetch, { RequestInit } from 'node-fetch'
import { RetryHandler } from '../../tools'

interface Deps {
  timeoutMs: number
  retryHandler: RetryHandler
}

export class HttpClient2 {
  constructor(private $: Deps) {}

  /**
   * Sends request to the provided url with init params.
   * Use this method only when you expect server to return valid JSON.
   * Provides retries, in most cases this will be RetryHandler.HTTP
   */
  async fetch(url: string, init?: RequestInit): Promise<unknown> {
    try {
      return await this.fetchJson(url, init)
    } catch (_) {
      return await this.$.retryHandler.retry(() => this.fetchJson(url, init))
    }
  }

  private async fetchJson(url: string, init?: RequestInit) {
    const res = await fetch(url, {
      ...init,
      timeout: this.$.timeoutMs,
    })

    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status} ${res.statusText}`)
    }

    return res.json()
  }
}
