import { expect } from 'earl'
import nock from 'nock'

import { HttpClient2 } from './HttpClient2'

describe(HttpClient2.name, () => {
  describe(HttpClient2.prototype.fetch.name, () => {
    it('parses json', async () => {
      const http = new HttpClient2()
      nock('https://api')
        .get('/')
        .reply(200, JSON.stringify({ a: 1, b: 2 }))

      const parsed = await http.fetch('https://api')
      expect(parsed).toEqual({ a: 1, b: 2 })
    })

    it('throws error with context', async () => {
      const http = new HttpClient2({ maxRetries: 0 })
      nock('https://api').get('/').reply(404, { message: 'info' })

      await expect(
        async () => await http.fetch('https://api'),
      ).toBeRejectedWith('HTTP error: 404 Not Found {"message":"info"}')
    })

    it('supports custom timeout', async function () {
      const http = new HttpClient2({ maxRetries: 0, timeoutMs: 200 })
      nock('https://api').get('/').delay(300).reply(200, { data: 'some data' })

      await expect(async () => await http.fetch('https://api')).toBeRejected()
    })
  })

  it('retries fetch', async () => {
    const http = new HttpClient2({ maxRetries: 2, maxRetryDelayMs: 10 })
    nock('https://api').get('/').times(2).reply(500, { message: 'info' })
    nock('https://api').get('/').reply(200, { data: 'some data' })

    const result = await http.fetch('https://api')
    expect(result).toEqual({ data: 'some data' })
  })

  it('supports max retry delay', async () => {
    const http = new HttpClient2({
      maxRetries: 2,
      initialRetryDelayMs: 100_000,
      maxRetryDelayMs: 10, // if not for this test would timeout
    })
    nock('https://api').get('/').times(1).reply(500, { message: 'info' })
    nock('https://api').get('/').reply(200, { data: 'some data' })

    const result = await http.fetch('https://api')
    expect(result).toEqual({ data: 'some data' })
  })
})
