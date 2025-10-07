import type { Log } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { RpcClient } from '../../clients'
import { LogsProvider } from './LogsProvider'

describe(LogsProvider.name, () => {
  describe(LogsProvider.prototype.getLogs.name, () => {
    it('returns log', async () => {
      const rpc = mockObject<RpcClient>({
        getLogs: async () => [log(1)],
      })
      const provider = new LogsProvider('chain', [rpc])

      const result = await provider.getLogs(1, 1)

      expect(rpc.getLogs).toHaveBeenOnlyCalledWith(1, 1, undefined, undefined)
      expect(result).toEqual([log(1)])
    })

    it('calls other client when there are errors', async () => {
      const rpc_one = mockObject<RpcClient>({
        getLogs: mockFn().rejectsWith(new Error()),
      })
      const rpc_two = mockObject<RpcClient>({
        getLogs: mockFn().rejectsWith(new Error()),
      })
      const rpc_three = mockObject<RpcClient>({
        getLogs: async () => [log(1)],
      })

      const provider = new LogsProvider('chain', [rpc_one, rpc_two, rpc_three])

      const result = await provider.getLogs(1, 1)

      expect(rpc_one.getLogs).toHaveBeenOnlyCalledWith(
        1,
        1,
        undefined,
        undefined,
      )
      expect(rpc_two.getLogs).toHaveBeenOnlyCalledWith(
        1,
        1,
        undefined,
        undefined,
      )
      expect(rpc_three.getLogs).toHaveBeenOnlyCalledWith(
        1,
        1,
        undefined,
        undefined,
      )

      expect(result).toEqual([log(1)])
    })

    it('throws when ran out of fallbacks', async () => {
      const rpc_one = mockObject<RpcClient>({
        getLogs: mockFn().rejectsWith(new Error()),
      })
      const rpc_two = mockObject<RpcClient>({
        getLogs: mockFn().rejectsWith(new Error()),
      })
      const rpc_three = mockObject<RpcClient>({
        getLogs: mockFn().rejectsWith(new Error('ERROR')),
      })

      const provider = new LogsProvider('chain', [rpc_one, rpc_two, rpc_three])

      await expect(() => provider.getLogs(1, 1)).toBeRejectedWith('ERROR')

      expect(rpc_one.getLogs).toHaveBeenOnlyCalledWith(
        1,
        1,
        undefined,
        undefined,
      )
      expect(rpc_two.getLogs).toHaveBeenOnlyCalledWith(
        1,
        1,
        undefined,
        undefined,
      )
      expect(rpc_three.getLogs).toHaveBeenOnlyCalledWith(
        1,
        1,
        undefined,
        undefined,
      )
    })
  })
})

function log(blockNumber: number): Log {
  return {
    address: `0x${blockNumber.toString(16)}`,
    topics: [],
    blockNumber,
    blockHash: `0x${'0'.repeat(64)}`,
    transactionHash: '0xTxHash',
    data: `0x${blockNumber.toString(16)}`,
    logIndex: 0,
  }
}
