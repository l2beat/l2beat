import { expect } from 'chai'
import { Response } from 'node-fetch'

import { EtherscanClient } from '../../../src/services/etherscan/EtherscanClient'
import { HttpClient } from '../../../src/services/HttpClient'

describe('EtherscanClient', () => {
  describe('getBlockNumberAtOrBefore', () => {
    it('returns the block number', async () => {
      const httpClient = new HttpClient()
      const apiKey = 'xXApiKeyXx'
      const timestamp = 1578638524

      const params = new URLSearchParams({
        module: 'block',
        action: 'getblocknobytime',
        timestamp: timestamp.toString(),
        closest: 'before',
        apikey: apiKey,
      })

      httpClient.fetch = async (url) => {
        expect(url).to.equal(`https://api.etherscan.io/api?${params}`)
        return new Response(
          JSON.stringify({ status: '1', message: 'OK', result: '9251482' })
        )
      }

      const etherscanClient = new EtherscanClient(apiKey, httpClient)
      const result = await etherscanClient.getBlockNumberAtOrBefore(timestamp)
      expect(result).to.equal(9251482n)
    })
  })
})
