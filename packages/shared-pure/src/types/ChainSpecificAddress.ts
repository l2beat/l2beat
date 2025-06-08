import { validateAddress } from '@mradomski/tinyerc55'

export type ChainSpecificAddress = string & {
  _ChainSpecificAddressBrand: string
}

// Address format following ERC-3770
// https://eips.ethereum.org/EIPS/eip-3770
// Format: "shortName:address"
// Semantics:
// - shortName is mandatory and MUST be a valid chain short name from https://github.com/ethereum-lists/chains
// - address is mandatory and MUST be a ERC-55 compatible hexadecimal address
// WARNING: currently shortName is not verified against the list of chains
export function ChainSpecificAddress(value: string): ChainSpecificAddress {
  const [chain, address] = value.split(':')
  if (chain === undefined || address === undefined) {
    throw new TypeError(`Incorrect ChainSpecificAddress format: ${value}`)
  }
  const result = validateAddress(address)
  if (!result.valid) {
    throw new TypeError(`Invalid ChainSpecificAddress: ${value}`)
  }

  return `${chain}:${result.address}` as unknown as ChainSpecificAddress
}
