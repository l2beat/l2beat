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
          })
        },
      )
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
