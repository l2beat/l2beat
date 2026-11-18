import type { EthereumAddress } from '@l2beat/shared-pure'
import { type providers, utils } from 'ethers'

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

// eth_call goes through send() because ethers' call() reports any failure,
// a 503 included, as CALL_EXCEPTION and returns revert data as a result.
async function isTotalSupplyReadable(
  provider: providers.JsonRpcProvider,
  address: EthereumAddress,
  block: number,
): Promise<boolean> {
  try {
    const result: unknown = await provider.send('eth_call', [
      { to: address.toString(), data: TOTAL_SUPPLY_SELECTOR },
      utils.hexValue(block),
    ])
    return isUint256(result)
  } catch (error) {
    if (isEvmRevert(error)) {
      return false
    }
    throw error
  }
}

function isUint256(result: unknown): boolean {
  return utils.isHexString(result, 32)
}

// A revert is a JSON-RPC error from the node. Anything else (HTTP status,
// timeout) is an outage, and treating it as a revert would silently move the
// start later.
function isEvmRevert(error: unknown): boolean {
  const rpcError = (error as { error?: { message?: unknown } } | null)?.error
  return (
    typeof rpcError?.message === 'string' && /revert/i.test(rpcError.message)
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
