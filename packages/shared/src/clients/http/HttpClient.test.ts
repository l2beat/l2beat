import { expect } from 'earl'
import { HttpClient, sanitizeUrl } from './HttpClient'
import { withServer } from './testServer'

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
      const error = await withServer(
        (_, res) => res.writeHead(404).end(),
        (url) =>
          http.fetch(`${url}/feed?key=secret`, {}).catch((e: unknown) => e),
      )

      expect((error as Error).cause).toEqual({
        url: expect.a(String),
      })
      expect(((error as Error).cause as { url: string }).url).toInclude(
        '/feed?key=REDACTED',
      )
    })

    it('supports custom timeout', async () => {
      const http = new HttpClient()
      await withServer(
        (_, res) => setTimeout(() => res.end('{}'), 50),
        async (url) =>
          expect(
            async () => await http.fetch(url, { timeout: 5 }),
          ).toBeRejectedWith(/Timeout: no data from .* for 5ms/),
      )
    })
  })

  describe(sanitizeUrl.name, () => {
    it('redacts sensitive query param values', () => {
      expect(
        sanitizeUrl('https://api.starkex.com/v1/blocks?key=secret'),
      ).toEqual('https://api.starkex.com/v1/blocks?key=REDACTED')
    })

    it('preserves non-sensitive query params', () => {
      expect(sanitizeUrl('https://api/feed?from=1&to=2&apiKey=secret')).toEqual(
        'https://api/feed?from=1&to=2&apiKey=REDACTED',
      )
    })

    it('redacts key-like path segments (e.g. RPC provider keys)', () => {
      expect(
        sanitizeUrl(
          'https://eth-mainnet.g.alchemy.com/v2/AbCdEf0123456789AbCdEf0123456789',
        ),
      ).toEqual('https://eth-mainnet.g.alchemy.com/v2/REDACTED')
    })

    it('preserves 0x-prefixed identifiers and normal path segments', () => {
      const url =
        'https://api/api/v2/transactions/0x1234567890abcdef1234567890abcdef'
      expect(sanitizeUrl(url)).toEqual(url)
    })

    it('returns the input unchanged when it is not a valid url', () => {
      expect(sanitizeUrl('not a url')).toEqual('not a url')
    })
  })
})
