import { expect } from 'chai'

import { EthereumClient, KeccakHash } from '../../../src/services/ethereum'
import { JsonRpcClient, JsonRpcParams } from '../../../src/services/jsonrpc'
import latestBlockAlchemy from './examples/latestBlockAlchemy.json'

describe('EthereumClient', () => {
  function makeTestRpc(
    call: (method: string, params?: JsonRpcParams) => Promise<unknown>
  ) {
    class TestRpcClient extends JsonRpcClient {
      execute(): Promise<never> {
        throw new Error('Not implemented!')
      }
      call = call
    }
    return new TestRpcClient()
  }

  describe('getBlockNumber', () => {
    it('returns a block number', async () => {
      const testRpc = makeTestRpc(async (method, params) => {
        expect(method).to.equal('eth_blockNumber')
        expect(params).to.equal(undefined)
        return '0xa455'
      })
      const client = new EthereumClient(testRpc)
      const result = await client.getBlockNumber()
      expect(result).to.equal(42069n)
    })
  })

  describe('getBlock', () => {
    it('can return a block by hash', async () => {
      const hash = new KeccakHash('0x' + '12ab'.repeat(16))
      const testRpc = makeTestRpc(async (method, params) => {
        expect(method).to.equal('eth_getBlockByHash')
        expect(params).to.deep.equal([hash.toString(), false])
        return latestBlockAlchemy
      })
      const client = new EthereumClient(testRpc)
      const result = await client.getBlock(hash)
      expect(result.number).to.equal(13326971n)
    })

    it('can return a block by number', async () => {
      const testRpc = makeTestRpc(async (method, params) => {
        expect(method).to.equal('eth_getBlockByNumber')
        expect(params).to.deep.equal(['0xcb5a7b', false])
        return latestBlockAlchemy
      })
      const client = new EthereumClient(testRpc)
      const result = await client.getBlock(13326971n)
      expect(result.number).to.equal(13326971n)
    })

    it('can return a block by tag', async () => {
      const testRpc = makeTestRpc(async (method, params) => {
        expect(method).to.equal('eth_getBlockByNumber')
        expect(params).to.deep.equal(['latest', false])
        return latestBlockAlchemy
      })
      const client = new EthereumClient(testRpc)
      const result = await client.getBlock('latest')
      expect(result.number).to.equal(13326971n)
    })
  })
})
