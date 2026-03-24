import { EthereumAddress } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import type { EthRpcClient, RpcTransaction } from '../EthRpcClient'
import { RpcClientCompat } from './RpcClientCompat'

describe(RpcClientCompat.name, () => {
  describe(RpcClientCompat.prototype.getTransaction.name, () => {
    it('maps canonical transaction unchanged', async () => {
      const tx = canonicalRpcTransaction()
      const ethRpcClient = mockObject<EthRpcClient>({
        getTransactionByHash: async () => tx,
      })
      const client = new RpcClientCompat(ethRpcClient, 'test')

      const result = await client.getTransaction(tx.hash)

      expect(result).toEqual({
        hash: tx.hash,
        from: tx.from,
        to: tx.to ?? undefined,
        data: '0x1234',
        type: '2',
        value: 9n,
        calls: undefined,
        blobVersionedHashes: undefined,
        blockNumber: 100,
      })
    })

    it('maps bundle transaction with calls', async () => {
      const tx = bundleRpcTransaction()
      const ethRpcClient = mockObject<EthRpcClient>({
        getTransactionByHash: async () => tx,
      })
      const client = new RpcClientCompat(ethRpcClient, 'test')

      const result = await client.getTransaction(tx.hash)

      expect(result).toEqual({
        hash: tx.hash,
        from: tx.from,
        to: tx.to ?? undefined,
        data: undefined,
        type: '118',
        value: undefined,
        calls: [
          {
            to: EthereumAddress('0x0000000000000000000000000000000000000003'),
            value: 5n,
            data: '0xdeadbeef',
          },
        ],
        blobVersionedHashes: undefined,
        blockNumber: 100,
      })
    })

    it('maps unsupported custom envelope transaction without top-level calldata/value', async () => {
      const tx = unsupportedRpcTransaction()
      const ethRpcClient = mockObject<EthRpcClient>({
        getTransactionByHash: async () => tx,
      })
      const client = new RpcClientCompat(ethRpcClient, 'test')

      const result = await client.getTransaction(tx.hash)

      expect(result).toEqual({
        hash: tx.hash,
        from: tx.from,
        to: tx.to ?? undefined,
        data: undefined,
        type: '119',
        value: undefined,
        calls: undefined,
        blobVersionedHashes: undefined,
        blockNumber: 100,
      })
    })
  })
})

function canonicalRpcTransaction(): RpcTransaction {
  return {
    blockHash: `0x${'11'.repeat(32)}`,
    blockNumber: 100n,
    from: EthereumAddress('0x0000000000000000000000000000000000000001'),
    gas: 21_000n,
    hash: `0x${'22'.repeat(32)}`,
    input: '0x1234',
    to: EthereumAddress('0x0000000000000000000000000000000000000002'),
    transactionIndex: 0n,
    value: 9n,
    type: 2n,
  }
}

function bundleRpcTransaction(): RpcTransaction {
  return {
    blockHash: `0x${'11'.repeat(32)}`,
    blockNumber: 100n,
    from: EthereumAddress('0x0000000000000000000000000000000000000001'),
    gas: 21_000n,
    hash: `0x${'33'.repeat(32)}`,
    to: EthereumAddress('0x0000000000000000000000000000000000000002'),
    transactionIndex: 0n,
    type: 118n,
    calls: [
      {
        to: EthereumAddress('0x0000000000000000000000000000000000000003'),
        value: 5n,
        data: '0xdeadbeef',
      },
    ],
  }
}

function unsupportedRpcTransaction(): RpcTransaction {
  return {
    blockHash: `0x${'11'.repeat(32)}`,
    blockNumber: 100n,
    from: EthereumAddress('0x0000000000000000000000000000000000000001'),
    gas: 21_000n,
    hash: `0x${'44'.repeat(32)}`,
    to: EthereumAddress('0x0000000000000000000000000000000000000002'),
    transactionIndex: 0n,
    type: 119n,
  }
}
