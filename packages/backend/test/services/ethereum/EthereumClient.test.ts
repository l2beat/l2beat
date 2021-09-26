import { expect } from 'chai'

import { EthereumClient } from '../../../src/services/ethereum'
import { JsonRpcClient, JsonRpcParams } from '../../../src/services/jsonrpc'
import { BigInteger } from '../../../src/services/model'

describe('EthereumClient', () => {
  describe('getBlockNumber', () => {
    it('returns a block number', async () => {
      class TestJsonRpc extends JsonRpcClient {
        async execute() {}
        async call(method: string, params?: JsonRpcParams) {
          expect(method).to.equal('eth_blockNumber')
          expect(params).to.equal(undefined)
          return '0xa455'
        }
      }
      const client = new EthereumClient(new TestJsonRpc())
      const result = await client.getBlockNumber()
      expect(result).to.deep.equal(BigInteger.from(42069))
    })
  })
})
