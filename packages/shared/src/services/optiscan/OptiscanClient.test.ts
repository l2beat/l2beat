import { ChainId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'

import { HttpClient } from '../HttpClient'
import { OptiscanClient } from './OptiscanClient'

describe(OptiscanClient.name, () => {
  describe(OptiscanClient.prototype.getChainId.name, () => {
    it('returns optimism chainId', async () => {
      const httpClient = mockObject<HttpClient>()
      const optimismClient = new OptiscanClient(
        httpClient,
        'key',
        new UnixTime(0),
      )
      expect(optimismClient.getChainId()).toEqual(ChainId.OPTIMISM)
    })
  })
})
