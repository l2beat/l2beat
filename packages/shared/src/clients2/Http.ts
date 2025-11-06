import { RateLimiter } from '@l2beat/backend-tools'
import fetch, { Headers, type RequestInit } from 'node-fetch'

export interface HttpOptions {
  timeoutMs: number
  maxCallsPerMinute: number
}

export interface HttpResponse {
  body: string
  /** status is between 200 and 299 inclusive */
  ok: boolean
  status: number
  // Ideally it's Record<string, string>, but that's unnecessary overhead
  // since realistically nobody even uses the headers
  headers: Headers
}

export class Http {
  private timeoutMs: number
  private rateLimiter?: RateLimiter

  constructor(options?: Partial<HttpOptions>) {
    this.timeoutMs = options?.timeoutMs ?? 10_000
    if (options?.maxCallsPerMinute !== undefined) {
      this.rateLimiter = new RateLimiter({
        callsPerMinute: options.maxCallsPerMinute,
      })
    }
  }

  async fetch(url: string, init: RequestInit): Promise<HttpResponse> {
    init = { timeout: this.timeoutMs, ...init }
    if (this.rateLimiter) {
      return await this.rateLimiter.call(() => this._fetch(url, init))
    }
    return await this._fetch(url, init)
  }

  private async _fetch(url: string, init: RequestInit): Promise<HttpResponse> {
    const res = await fetch(url, init)
    // We need to await text because we don't know if someone wants json or not
    // and we need to actually consume the response body not just the headers
    const body = await res.text()
    return {
      body,
      ok: res.ok,
      status: res.status,
      headers: res.headers,
    }
  }
}

export function makeHttpResponse(
  status: number,
  body: string,
  headers = new Headers(),
): HttpResponse {
  return {
    body,
    ok: status >= 200 && status < 300,
    status,
    headers,
  }
}

export class MockHttp extends Http {
  private queue: (HttpResponse | 'NETWORK_ERROR')[] = []

  queueResponse(status: number, body: string, headers = new Headers()) {
    this.queue.push(makeHttpResponse(status, body, headers))
    return this
  }

  queueNetworkError() {
    this.queue.push('NETWORK_ERROR')
  }

  override fetch(_url: string, _init: RequestInit) {
    const res = this.queue.shift()
    if (res === 'NETWORK_ERROR') {
      throw new Error('Failed to fetch: network error.')
    }
    if (res) {
      return Promise.resolve(res)
    }
    throw new Error('No responses queued!')
  }
}
