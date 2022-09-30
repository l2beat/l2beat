import fetch, { RequestInit, Response } from 'node-fetch'

export class HttpClient {
  fetch(url: string, init?: RequestInit): Promise<Response> {
    return fetch(url, init)
  }

  async fetchJson(url: string, init?: RequestInit): Promise<string> {
    const response = await this.fetch(url, init)
    if (!response.ok) {
      throw new Error(
        `Could not get data from api (received status ${response.status})`,
      )
    }
    const json: unknown = await response.json()

    return JSON.stringify(json)
  }
}
