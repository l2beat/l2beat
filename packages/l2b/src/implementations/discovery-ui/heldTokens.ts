import { ChainSpecificAddress } from '@l2beat/shared-pure'
import type { Token } from '../estimateTVL'

// The gas token has no contract the holder index could list.
export function toTokenAddresses(tokens: Token[]): ChainSpecificAddress[] {
  const addresses: ChainSpecificAddress[] = []
  for (const token of tokens) {
    if (token.address !== undefined) {
      addresses.push(token.address)
    }
  }
  return addresses
}

// The gas token is always kept: it moves without emitting the events the index
// is built from.
export function selectHeldTokens(
  tokens: Token[],
  held: ChainSpecificAddress[],
): Token[] {
  const heldAddresses = new Set(held.map(toComparable))
  return tokens.filter(
    (token) =>
      token.address === undefined ||
      heldAddresses.has(toComparable(token.address)),
  )
}

function toComparable(address: ChainSpecificAddress): string {
  return ChainSpecificAddress.address(address).toLowerCase()
}
