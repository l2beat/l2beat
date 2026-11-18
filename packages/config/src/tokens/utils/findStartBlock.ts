import type { EthRpcClient } from '@l2beat/shared'
import type { EthereumAddress } from '@l2beat/shared-pure'

const TOTAL_SUPPLY_SELECTOR = '0x18160ddd'
const UINT256_HEX_LENGTH = 2 + 64

export async function findCreationBlock(
  rpc: EthRpcClient,
  address: EthereumAddress,
  latestBlock: number,
): Promise<number> {
  return await findFirstBlock(0, latestBlock, async (block) => {
    const code = await rpc.getCode(address, BigInt(block))
    return code !== '0x'
  })
}

// A proxy can exist long before its implementation answers totalSupply(),
// and the TVS indexer stalls on any block where the amount is unreadable.
export async function findFirstBlockWithTotalSupply(
  rpc: EthRpcClient,
  address: EthereumAddress,
  fromBlock: number,
  latestBlock: number,
): Promise<number | undefined> {
  const isReadable = async (block: number) => {
    const result = await rpc.call(
      { to: address, input: TOTAL_SUPPLY_SELECTOR },
      BigInt(block),
    )
    return !result.reverted && result.data.length === UINT256_HEX_LENGTH
  }

  if (!(await isReadable(latestBlock))) {
    return undefined
  }
  return await findFirstBlock(fromBlock, latestBlock, isReadable)
}

/**
 * Binary search for the lowest block in [min, max] where `holds` is true.
 * Assumes `holds` is false up to some block and true from then on, and is
 * true at `max`.
 */
async function findFirstBlock(
  min: number,
  max: number,
  holds: (block: number) => Promise<boolean>,
): Promise<number> {
  let low = min
  let high = max
  while (low < high) {
    const mid = Math.floor((low + high) / 2)
    if (await holds(mid)) {
      high = mid
    } else {
      low = mid + 1
    }
  }
  return low
}
