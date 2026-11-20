import { expect } from 'earl'
import { withServer } from '../../test/withServer'
import { HttpClient } from './HttpClient'

describe(HttpClient.name, () => {
  describe(HttpClient.prototype.fetch.name, () => {
    it('parses json', async () => {
      const http = new HttpClient()
      const parsed = await withServer(
        (_, res) => res.end(JSON.stringify({ a: 1, b: 2 })),
        (url) => http.fetch(url, {}),
      )
      expect(parsed).toEqual({ a: 1, b: 2 })
    })

    it('throws error with context', async () => {
      const http = new HttpClient()
      await withServer(
        (_, res) => res.writeHead(404).end(),
        async (url) =>
          expect(async () => await http.fetch(url, {})).toBeRejectedWith(
            'HTTP error: 404 Not Found',
          ),
      )
    })

    it('attaches the sanitized url as the error cause', async () => {
      const http = new HttpClient()
      await withServer(
        (_, res) => res.writeHead(404).end(),
        async (url) => {
          const error = await http
            .fetch(`${url}/feed?key=secret`, {})
            .catch((e: unknown) => e)
          expect((error as Error).cause).toEqual({
            url: `${url}/feed?key=REDACTED`,
            status: 404,
          })
        },
      )
    })

    // Why: a provider that refuses a call says how long to wait and often
    // what its limit is. Dropped here, that never reaches the limiter or
    // the logs, and the limit has to be guessed
    it('attaches what the provider says about its limit to a refusal', async () => {
      const http = new HttpClient()
      await withServer(
        (_, res) =>
          res
            .writeHead(429, {
              'Retry-After': '10',
              'X-RateLimit-Limit': '200',
              'X-Request-Id': 'abc',
            })
            .end(),
        async (url) => {
          const error = await http.fetch(url, {}).catch((e: unknown) => e)
          expect((error as Error).cause).toEqual({
            url: `${url}/`,
            status: 429,
            rateLimit: { 'retry-after': '10', 'x-ratelimit-limit': '200' },
          })
        },
      )
    })

    it('shows the headers of a successful response', async () => {
      const http = new HttpClient()
      const seen: string[] = []
      await withServer(
        (_, res) =>
          res.writeHead(200, { 'X-RateLimit-Limit': '200' }).end('{}'),
        (url) =>
          http.fetch(url, {}, (headers) =>
            seen.push(headers.get('x-ratelimit-limit') ?? ''),
          ),
      )
      expect(seen).toEqual(['200'])
    })

    it('supports custom timeout', async () => {
      const http = new HttpClient()
      await withServer(
        (_, res) => setTimeout(() => res.end('{}'), 50),
        async (url) =>
          expect(
            async () => await http.fetch(url, { timeout: 5 }),
          ).toBeRejectedWith('HTTP timeout'),
      )
    })
  })
})
