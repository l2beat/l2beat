import { expect } from 'earl'
import nock from 'nock'
import { HttpClient2 } from './HttpClient2'

describe(HttpClient2.name, () => {
  describe(HttpClient2.prototype.fetch.name, () => {
    it('parses json', async () => {
      const http = mockClient()
      nock('https://api')
        .get('/')
        .reply(200, JSON.stringify({ a: 1, b: 2 }))

      const parsed = await http.fetch('https://api')
      expect(parsed).toEqual({ a: 1, b: 2 })
    })

    it('throws error with context', async () => {
      const http = mockClient()
      nock('https://api').get('/').times(2).reply(404)

      await expect(
        async () => await http.fetch('https://api'),
      ).toBeRejectedWith('HTTP error: 404 Not Found')
    })

    it('supports custom timeout', async function () {
      const http = mockClient(2)
      nock('https://api').get('/').delay(3).reply(200, { data: 'some data' })

      await expect(async () => await http.fetch('https://api')).toBeRejected()
    })
  })
})

function mockClient(timeoutMs?: number) {
  return new HttpClient2(timeoutMs ?? 10_000)
}
