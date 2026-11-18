import type { EthereumAddress } from '@l2beat/shared-pure'
import type { providers } from 'ethers'

const TOTAL_SUPPLY_SELECTOR = '0x18160ddd'

export async function findCreationBlock(
  provider: providers.JsonRpcProvider,
  address: EthereumAddress,
  latestBlock: number,
): Promise<number> {
  return await findFirstBlock(0, latestBlock, async (block) => {
    const code = await provider.getCode(address.toString(), block)
    return code !== '0x'
  })
}

// A proxy can exist long before its implementation answers totalSupply(),
// and the TVS indexer stalls on any block where the amount is unreadable.
export async function findFirstBlockWithTotalSupply(
  provider: providers.JsonRpcProvider,
  address: EthereumAddress,
  fromBlock: number,
  latestBlock: number,
): Promise<number | undefined> {
  const isReadable = (block: number) =>
    isTotalSupplyReadable(provider, address, block)

  if (!(await isReadable(latestBlock))) {
    return undefined
  }
  return await findFirstBlock(fromBlock, latestBlock, isReadable)
}

async function isTotalSupplyReadable(
  provider: providers.JsonRpcProvider,
  address: EthereumAddress,
  block: number,
): Promise<boolean> {
  try {
    const result = await provider.call(
      { to: address.toString(), data: TOTAL_SUPPLY_SELECTOR },
      block,
    )
    return result !== '0x'
  } catch (error) {
    if (isRevert(error)) {
      return false
    }
    throw error
  }
}

// Treating an RPC outage as a revert would silently move the start later.
function isRevert(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 'CALL_EXCEPTION'
  )
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
