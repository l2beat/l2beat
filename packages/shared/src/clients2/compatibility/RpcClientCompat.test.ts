import { EthereumAddress } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { EthRpcClient, RpcBlock } from '../EthRpcClient'
import { RpcClientCompat } from './RpcClientCompat'

describe(RpcClientCompat.name, () => {
  describe(RpcClientCompat.prototype.getBlockTimestamp.name, () => {
    it('fetches the block without transaction bodies', async () => {
      const header = {
        hash: `0x${'ab'.repeat(32)}`,
        number: 100n,
        timestamp: 1_000n,
        logsBloom: '0x',
        transactions: [],
      } as unknown as RpcBlock
      const getBlockByNumber = mockFn().resolvesTo(header)
      const client = new RpcClientCompat(
        mockObject<EthRpcClient>({ getBlockByNumber }),
        'chain',
      )

      const timestamp = await client.getBlockTimestamp(100)

      expect(timestamp).toEqual(1_000)
      expect(getBlockByNumber).toHaveBeenOnlyCalledWith(100n, false)
    })
  })

  describe(RpcClientCompat.prototype.getLogs.name, () => {
    it('treats multiple event signatures as topic zero alternatives', async () => {
      const getLogs = mockFn<EthRpcClient['getLogs']>().resolvesTo([])
      const client = new RpcClientCompat(
        mockObject<EthRpcClient>({ getLogs }),
        'ethereum',
      )
      const addresses = [
        EthereumAddress('0x1111111111111111111111111111111111111111'),
      ]
      const topics = [`0x${'aa'.repeat(32)}`, `0x${'bb'.repeat(32)}`]

      await client.getLogs(100, 200, addresses, topics)

      expect(getLogs).toHaveBeenOnlyCalledWith({
        fromBlock: 100n,
        toBlock: 200n,
        address: addresses,
        topics: [topics],
      })
    })
  })

  describe(RpcClientCompat.prototype.getBlockTimestamps.name, () => {
    it('returns timestamps in bounded batches', async () => {
      let releaseFirstBatch: () => void = () => undefined
      const firstBatch = new Promise<void>((resolve) => {
        releaseFirstBatch = resolve
      })
      const getBlockByNumber = mockFn().executes(
        async (blockNumber: bigint) => {
          if (blockNumber <= 25n) await firstBatch
          return block(Number(blockNumber))
        },
      )
      const client = new RpcClientCompat(
        mockObject<EthRpcClient>({ getBlockByNumber }),
        'ethereum',
      )
      const blockNumbers = Array.from({ length: 26 }, (_, index) => index + 1)

      const resultPromise = client.getBlockTimestamps(blockNumbers)
      await Promise.resolve()

      expect(getBlockByNumber).toHaveBeenCalledTimes(25)
      releaseFirstBatch()

      const result = await resultPromise
      expect(getBlockByNumber).toHaveBeenCalledTimes(26)
      expect(result).toEqual(
        new Map(blockNumbers.map((number) => [number, number * 100])),
      )
    })

    it('rejects a mismatched block number', async () => {
      const client = new RpcClientCompat(
        mockObject<EthRpcClient>({
          getBlockByNumber: mockFn().resolvesTo(block(2)),
        }),
        'ethereum',
      )

      await expect(() => client.getBlockTimestamps([1])).toBeRejectedWith(
        'Invalid response: expected block number 1, got 2',
      )
    })
  })
})

function block(number: number): RpcBlock {
  return {
    number: BigInt(number),
    timestamp: BigInt(number * 100),
    hash: `0x${number.toString(16).padStart(64, '0')}`,
    logsBloom: `0x${'00'.repeat(256)}`,
  } as RpcBlock
}
