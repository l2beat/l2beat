import { Bytes, EthereumAddress, KeccakHash, mock } from '@l2beat/common'
import { expect } from 'earljs'

import { EthereumClient } from '../../../src/peripherals/ethereum/EthereumClient'
import { JsonRpcClient } from '../../../src/peripherals/jsonrpc'
import latestBlockAlchemy from './examples/latestBlockAlchemy.json'

describe(EthereumClient.name, () => {
  describe(EthereumClient.prototype.getBlockNumber.name, () => {
    it('returns a block number', async () => {
      const testRpc = mock<JsonRpcClient>({
        async call(method, params) {
          expect(method).toEqual('eth_blockNumber')
          expect(params).toEqual(undefined)
          return '0xa455'
        },
      })
      const client = new EthereumClient(testRpc)
      const result = await client.getBlockNumber()
      expect(result).toEqual(42069n)
    })
  })

  describe(EthereumClient.prototype.getBlock.name, () => {
    it('can return a block by hash', async () => {
      const hash = new KeccakHash('0x' + '12ab'.repeat(16))
      const testRpc = mock<JsonRpcClient>({
        async call(method, params) {
          expect(method).toEqual('eth_getBlockByHash')
          expect(params).toEqual([hash.toString(), false])
          return latestBlockAlchemy
        },
      })
      const client = new EthereumClient(testRpc)
      const result = await client.getBlock(hash)
      expect(result.number).toEqual(13326971n)
    })

    it('can return a block by number', async () => {
      const testRpc = mock<JsonRpcClient>({
        async call(method, params) {
          expect(method).toEqual('eth_getBlockByNumber')
          expect(params).toEqual(['0xcb5a7b', false])
          return latestBlockAlchemy
        },
      })
      const client = new EthereumClient(testRpc)
      const result = await client.getBlock(13326971n)
      expect(result.number).toEqual(13326971n)
    })

    it('can return a block by tag', async () => {
      const testRpc = mock<JsonRpcClient>({
        async call(method, params) {
          expect(method).toEqual('eth_getBlockByNumber')
          expect(params).toEqual(['latest', false])
          return latestBlockAlchemy
        },
      })
      const client = new EthereumClient(testRpc)
      const result = await client.getBlock('latest')
      expect(result.number).toEqual(13326971n)
    })
  })

  describe(EthereumClient.prototype.call.name, () => {
    it('can call a contract', async () => {
      const to = EthereumAddress('0x' + '34cd'.repeat(10))
      const data = Bytes.fromHex('0xabcdef123456')

      const testRpc = mock<JsonRpcClient>({
        async call(method, params) {
          expect(method).toEqual('eth_call')
          expect(params).toEqual([
            {
              to: to.toString().toLowerCase(),
              data: data.toString(),
            },
            '0x123',
          ])
          return '0x1234'
        },
      })
      const client = new EthereumClient(testRpc)
      const result = await client.call(
        {
          to,
          data,
        },
        0x123n
      )
      expect(result).toEqual(Bytes.fromHex('0x1234'))
    })
  })
})
