import fetch, { RequestInit, Response } from 'node-fetch'

export class HttpClient {
  fetch(url: string, init?: RequestInit): Promise<Response> {
    return fetch(url, init)
  }

  async timedFetch(url: string, init?: RequestInit) {
    const start = process.hrtime.bigint()
    const response = await this.fetch(url, init)
    const end = process.hrtime.bigint()
    return { response, time: end - start }
  }
}
