import type { UnixTime } from '@l2beat/shared-pure'
import type { RpcClient } from './RpcClient'

export async function getDeploymentTimestampFromRpc(
  rpc: RpcClient,
  address: string,
): Promise<UnixTime | undefined> {
  const latest = await rpc.getBlockNumber()
  const codeAtLatest = await rpc.getCode(address, latest)
  if (codeAtLatest === '0x') return undefined

  const creationBlock = await bisectCreationBlock(rpc, address, 0, latest)
  return rpc.getBlockTimestamp(creationBlock)
}

async function bisectCreationBlock(
  rpc: RpcClient,
  address: string,
  min: number,
  max: number,
): Promise<number> {
  while (min < max) {
    const mid = Math.floor((min + max) / 2)
    const code = await rpc.getCode(address, mid)
    if (code !== '0x') {
      max = mid
    } else {
      min = mid + 1
    }
  }
  return min
}
