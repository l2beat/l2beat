import { expect, mockFn, mockObject } from 'earl'
import type { EthRpcClient, RpcBlock } from '../EthRpcClient'
import { RpcClientCompat } from './RpcClientCompat'

describe(RpcClientCompat.name, () => {
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
