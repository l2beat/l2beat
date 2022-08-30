import fetch, { RequestInit, Response } from 'node-fetch'

export class HttpClient {
  fetch(url: string, init?: RequestInit): Promise<Response> {
    return fetch(url, init)
  }

  async timedFetch(url: string, init?: RequestInit, timeout = 10000) {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)
    const start = process.hrtime.bigint()
    const response = await this.fetch(url, {
      /* @ts-expect-error @types/node and @types/node-fetch incompatibility */
      signal: controller.signal,
      ...init,
    })
    clearTimeout(timeoutId)
    const end = process.hrtime.bigint()
    return { response, time: end - start }
  }
}
