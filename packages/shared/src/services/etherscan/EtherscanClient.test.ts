import { ChainId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'

import { HttpClient } from '../HttpClient'
import { EtherscanClient } from './EtherscanClient'

describe(EtherscanClient.name, () => {
  describe(EtherscanClient.prototype.getChainId.name, () => {
    it('returns ethereum chainId', async () => {
      const httpClient = mockObject<HttpClient>()
      const etherscanClient = new EtherscanClient(
        httpClient,
        'key',
        new UnixTime(0),
      )
      expect(etherscanClient.getChainId()).toEqual(ChainId.ETHEREUM)
    })
  })
})
