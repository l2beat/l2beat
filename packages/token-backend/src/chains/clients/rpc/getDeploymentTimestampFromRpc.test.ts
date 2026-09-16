import { mockObject } from '@l2beat/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { getDeploymentTimestampFromRpc } from './getDeploymentTimestampFromRpc'
import type { RpcClient } from './RpcClient'

describe(getDeploymentTimestampFromRpc.name, () => {
  it('returns undefined when address has no code at head', async () => {
    const rpc = mockObject<RpcClient>({
      getBlockNumber: vi.fn().mockResolvedValue(100),
      getCode: vi.fn().mockResolvedValue('0x'),
      getBlockTimestamp: vi.fn(),
    })

    const result = await getDeploymentTimestampFromRpc(rpc, '0xabc')

    expect(result).toStrictEqual(undefined)
    expect(rpc.getBlockTimestamp).toHaveBeenCalledTimes(0)
  })

  it('bisects to the creation block and returns its timestamp', async () => {
    const creationBlock = 37
    const timestamp = 1700000000
    const rpc = mockObject<RpcClient>({
      getBlockNumber: vi.fn().mockResolvedValue(100),
      getCode: vi
        .fn()
        .mockImplementation(async (_: string, block: number) =>
          block >= creationBlock ? '0xdead' : '0x',
        ),
      getBlockTimestamp: vi.fn().mockResolvedValue(timestamp),
    })

    const result = await getDeploymentTimestampFromRpc(rpc, '0xabc')

    expect(result).toStrictEqual(timestamp)
    expect(rpc.getBlockTimestamp).toHaveBeenCalledWith(creationBlock)
  })

  it('returns undefined when the address has a non-monotonic code history', async () => {
    // Code present in two disjoint ranges — e.g. a metamorphic contract
    // that was deployed, SELFDESTRUCTed, then redeployed at the same address.
    // Bisection converges to 37, but the earlier [5, 10] interval means we
    // cannot trust that as the true first-deployment block.
    const rpc = mockObject<RpcClient>({
      getBlockNumber: vi.fn().mockResolvedValue(100),
      getCode: vi.fn().mockImplementation(async (_: string, block: number) => {
        const hasCode = (block >= 5 && block <= 10) || block >= 37
        return hasCode ? '0xdead' : '0x'
      }),
      getBlockTimestamp: vi.fn(),
    })

    const result = await getDeploymentTimestampFromRpc(rpc, '0xabc')

    expect(result).toStrictEqual(undefined)
    expect(rpc.getBlockTimestamp).toHaveBeenCalledTimes(0)
  })
})
