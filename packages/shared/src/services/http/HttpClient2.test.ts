import { expect } from 'earl'
import nock from 'nock'

import { HttpClient2 } from './HttpClient2'

describe(HttpClient2.name, () => {
  const http = new HttpClient2()

  describe(HttpClient2.prototype.fetchJson.name, () => {
    it('parses json', async () => {
      nock('https://api')
        .get('/')
        .reply(200, JSON.stringify({ a: 1, b: 2 }))

      const parsed = await http.fetchJson('https://api')

      expect(parsed).toEqual({ a: 1, b: 2 })
    })
    it('throws error with context', async () => {})
    it('supports custom timeout', async function () {
      const http = new HttpClient2({ maxRetries: 0, timeoutMs: 200 })

      nock('https://api').get('/').delay(300).reply(200, { data: 'some data' })

      await expect(
        async () => await http.fetchJson('https://api'),
      ).toBeRejected()
    })
  })
  it('retries fetch')
  it('supports max retry delay')
})
