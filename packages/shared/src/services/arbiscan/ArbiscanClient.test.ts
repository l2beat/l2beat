import { ChainId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { Response } from 'node-fetch'

import { HttpClient } from '../HttpClient'
import { ArbiscanClient } from './ArbiscanClient'

describe(ArbiscanClient.name, () => {
  describe(ArbiscanClient.prototype.getBlockNumberAtOrBefore.name, () => {
    it('constructs a correct url', async () => {
      const result = 1234
      const httpClient = mockObject<HttpClient>({
        async fetch() {
          return new Response(
            JSON.stringify({ status: '1', message: 'OK', result: `${result}` }),
          )
        },
      })

      const arbiscanClient = new ArbiscanClient(
        httpClient,
        'key',
        new UnixTime(0),
      )
      const blockNumber = await arbiscanClient.getBlockNumberAtOrBefore(
        new UnixTime(3141592653),
      )

      expect(httpClient.fetch).toHaveBeenOnlyCalledWith(
        `${ArbiscanClient.API_URL}?module=block&action=getblocknobytime&timestamp=3141592653&closest=before&apikey=key`,
        expect.anything(),
      )
      expect(blockNumber).toEqual(result)
    })
  })

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
