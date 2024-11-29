export class HttpClient {
  constructor(private readonly defaultTimeoutMs = 10_000) {}

  fetch(
    url: string,
    init?: RequestInit & { timeout?: number },
  ): Promise<Response> {
    return fetch(url, {
      ...init,
      signal: AbortSignal.timeout(init?.timeout ?? this.defaultTimeoutMs),
    })
  }
}
