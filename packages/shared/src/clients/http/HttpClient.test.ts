import { expect } from 'earl'
import nock from 'nock'
import { HttpClient, sanitizeUrl } from './HttpClient'

describe(HttpClient.name, () => {
  describe(HttpClient.prototype.fetch.name, () => {
    it('parses json', async () => {
      const http = new HttpClient()
      nock('https://api')
        .get('/')
        .reply(200, JSON.stringify({ a: 1, b: 2 }))

      const parsed = await http.fetch('https://api', {})
      expect(parsed).toEqual({ a: 1, b: 2 })
    })

    it('throws error with context', async () => {
      const http = new HttpClient()
      nock('https://api').get('/').times(2).reply(404)

      await expect(
        async () => await http.fetch('https://api', {}),
      ).toBeRejectedWith('HTTP error: 404 Not Found')
    })

    it('attaches the sanitized url as the error cause', async () => {
      const http = new HttpClient()
      nock('https://api').get('/feed').query({ key: 'secret' }).reply(404)

      const error = await http
        .fetch('https://api/feed?key=secret', {})
        .catch((e: unknown) => e)

      expect((error as Error).cause).toEqual({
        url: 'https://api/feed?key=REDACTED',
      })
    })

    it('supports custom timeout', async function () {
      const http = new HttpClient()
      nock('https://api').get('/').delay(3).reply(200, { data: 'some data' })

      await expect(
        async () => await http.fetch('https://api', { timeout: 2 }),
      ).toBeRejected()
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
