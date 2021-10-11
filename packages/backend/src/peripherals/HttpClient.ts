import fetch, { RequestInit, Response } from 'node-fetch'

export interface IHttpClient {
  fetch(url: string, init?: RequestInit): Promise<Response>
}

export class HttpClient implements IHttpClient {
  fetch(url: string, init?: RequestInit): Promise<Response> {
    return fetch(url, init)
  }
}
