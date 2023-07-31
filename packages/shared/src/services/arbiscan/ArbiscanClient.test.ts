import { ChainId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'

import { HttpClient } from '../HttpClient'
import { ArbiscanClient } from './ArbiscanClient'

describe(ArbiscanClient.name, () => {
  describe(ArbiscanClient.prototype.getChainId.name, () => {
    it('returns arbitrum chainId', async () => {
      const httpClient = mockObject<HttpClient>()
      const arbiscanClient = new ArbiscanClient(
        httpClient,
        'key',
        new UnixTime(0),
      )
      expect(arbiscanClient.getChainId()).toEqual(ChainId.ARBITRUM)
    })
  })
})
