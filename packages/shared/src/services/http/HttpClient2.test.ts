import { expect } from 'earl'
import nock from 'nock'

import { HttpClient2 } from './HttpClient2'

describe(HttpClient2.name, () => {
  describe(HttpClient2.prototype.fetchJson.name, () => {
    it('supports custom timeout', async function () {
      const http = new HttpClient2(200)

      nock('https://timeout')
        .get('/')
        .delay(300)
        .reply(200, { data: 'some data' })

      await expect(
        async () => await http.fetchJson('https://timeout'),
      ).toBeRejected()
    })
  })
})
