import fetch, { RequestInit, Response } from 'node-fetch'

export class HttpClient {
  fetch(url: string, init?: RequestInit): Promise<Response> {
    return fetch(url, init)
  }
}
