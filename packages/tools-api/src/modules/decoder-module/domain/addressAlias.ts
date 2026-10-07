import type { Address, DiscoveredConfig } from '../../../config/types'

export interface AddressAlias {
  address: `0x${string}`
  chainId: number
  name: string
  context: 'l2' | 'unknown'
}

// Ethereum-settled OP Stack and Arbitrum chains supported by the decoder.
// Do not apply this to arbitrary chains or L3s with a different parent.
const ETHEREUM_ALIAS_CHAINS = new Set([
  10, 130, 480, 1868, 8453, 42161, 42170, 57073, 81457, 7777777,
])
const OFFSET = 0x1111000000000000000000000000000000001111n
const MOD = 2n ** 160n

export function findAddressAlias(
  address: `0x${string}`,
  chainId: number,
  names: DiscoveredConfig['names'],
): AddressAlias | undefined {
  if (chainId !== 1 && !ETHEREUM_ALIAS_CHAINS.has(chainId)) return
  if (!/^0x[\da-f]{40}$/i.test(address)) return
  const original =
    `0x${((BigInt(address) - OFFSET + MOD) % MOD).toString(16).padStart(40, '0')}` as const
  const name = names[`eth:${original}` as Address]
  if (!name) return
  return {
    address: original,
    chainId: 1,
    name,
    // L1 calldata may contain an L2 address, but its execution context is unknown.
    context: chainId === 1 ? 'unknown' : 'l2',
  }
}
