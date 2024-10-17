import { expect, mockObject } from 'earl'
import nock from 'nock'

import { Logger } from '@l2beat/backend-tools'
import { RetryHandler } from '../../tools'
import { HttpClient2 } from './HttpClient2'

describe(HttpClient2.name, () => {
  describe(HttpClient2.prototype.fetch.name, () => {
    it('parses json', async () => {
      const http = mockClient({})
      nock('https://api')
        .get('/')
        .reply(200, JSON.stringify({ a: 1, b: 2 }))

      const parsed = await http.fetch('https://api')
      expect(parsed).toEqual({ a: 1, b: 2 })
    })

    it('throws error with context', async () => {
      const http = mockClient({})
      nock('https://api').get('/').times(2).reply(404)

      await expect(
        async () => await http.fetch('https://api'),
      ).toBeRejectedWith('HTTP error: 404 Not Found')
    })

    it('supports custom timeout', async function () {
      const http = mockClient({ timeoutMs: 2 })
      nock('https://api').get('/').delay(3).reply(200, { data: 'some data' })

      await expect(async () => await http.fetch('https://api')).toBeRejected()
    })

    it('retries fetch', async () => {
      const retryHandler = mockObject<RetryHandler>({
        retry: async (fn) => fn(),
      })

      const http = mockClient({ retryHandler })
      nock('https://api').get('/').reply(500, { message: 'info' })
      nock('https://api').get('/').reply(200, { data: 'some data' })

      await http.fetch('https://api')
      expect(retryHandler.retry).toHaveBeenCalledTimes(1)
    })
  })
})

function mockClient(deps: {
  timeoutMs?: number
  retryHandler?: RetryHandler
}) {
  return new HttpClient2({
    timeoutMs: deps.timeoutMs ?? 10_000,
    retryHandler:
      deps.retryHandler ??
      new RetryHandler({
        timeoutMs: 1,
        initialRetryDelayMs: 1,
        maxRetries: 1,
        maxRetryDelayMs: Infinity,
        logger: Logger.SILENT,
      }),
  })
}
