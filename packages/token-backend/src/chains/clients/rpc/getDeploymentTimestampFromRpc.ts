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

  // Bisection assumes eth_getCode is monotonic — empty before deployment,
  // non-empty forever after. Metamorphic contracts and SELFDESTRUCT+redeploy
  // break that assumption, which would make the bisection result misleading
  // rather than unknown. Sample the supposedly-empty prefix; if any sample
  // has code we bail out instead of returning a confidently-wrong timestamp.
  if (!(await hasEmptyPrefix(rpc, address, creationBlock))) {
    return undefined
  }

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

async function hasEmptyPrefix(
  rpc: RpcClient,
  address: string,
  creationBlock: number,
): Promise<boolean> {
  if (creationBlock <= 1) return true

  const samples = new Set<number>([0])
  for (let b = Math.floor(creationBlock / 2); b > 0; b = Math.floor(b / 2)) {
    samples.add(b)
  }

  const codes = await Promise.all(
    [...samples].map((b) => rpc.getCode(address, b)),
  )
  return codes.every((c) => c === '0x')
}
