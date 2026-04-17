import { expect, mockFn, mockObject } from 'earl'
import { getDeploymentTimestampFromRpc } from './getDeploymentTimestampFromRpc'
import type { RpcClient } from './RpcClient'

describe(getDeploymentTimestampFromRpc.name, () => {
  it('returns undefined when address has no code at head', async () => {
    const rpc = mockObject<RpcClient>({
      getBlockNumber: mockFn().resolvesTo(100),
      getCode: mockFn().resolvesTo('0x'),
      getBlockTimestamp: mockFn(),
    })

    const result = await getDeploymentTimestampFromRpc(rpc, '0xabc')

    expect(result).toEqual(undefined)
    expect(rpc.getBlockTimestamp).toHaveBeenCalledTimes(0)
  })

  it('bisects to the creation block and returns its timestamp', async () => {
    const creationBlock = 37
    const timestamp = 1700000000
    const rpc = mockObject<RpcClient>({
      getBlockNumber: mockFn().resolvesTo(100),
      getCode: mockFn().executes(async (_: string, block: number) =>
        block >= creationBlock ? '0xdead' : '0x',
      ),
      getBlockTimestamp: mockFn().resolvesTo(timestamp),
    })

    const result = await getDeploymentTimestampFromRpc(rpc, '0xabc')

    expect(result).toEqual(timestamp)
    expect(rpc.getBlockTimestamp).toHaveBeenCalledWith(creationBlock)
  })
})
