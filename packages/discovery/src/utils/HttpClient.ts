import fetch, { RequestInit, Response } from 'node-fetch'

export class HttpClient {
  constructor(private readonly defaultTimeoutMs = 10_000) {}

  fetch(url: string, init?: RequestInit): Promise<Response> {
    return fetch(url, {
      ...init,
      timeout: init?.timeout ?? this.defaultTimeoutMs,
    })
  }
}
