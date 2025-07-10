// Address format following ERC-3770
// https://eips.ethereum.org/EIPS/eip-3770
// Format: "shortName:address"
// Semantics:
// - shortName is mandatory and MUST be a valid chain short name from https://github.com/ethereum-lists/chains
// - address is mandatory and MUST be a ERC-55 compatible hexadecimal address
// WARNING: currently shortName is not verified against the list of chains

import { validateAddress } from '@mradomski/tinyerc55'
import { EthereumAddress } from './EthereumAddress'

// NOTE(radomski): This is a little stupid. Ideally we would have a centralized
// list of all chains with their short names. But currently I don't know how to
// achieve that.
const SHORT_CHAIN_NAMES = new Set([
  'eth',
  'arb1',
  'arb-nova',
  'oeth',
  'matic',
  'bnb',
  'avax',
  'celo',
  'linea',
  'base',
  'zkevm',
  'gno',
  'zksync',
  'sep',
  'scr',
  'mantle',
  'metis-andromeda',
  'boba',
  'mode',
  'zora',
  'manta',
  'blastmainnet',
  'kinto',
  'unichain',
  'ink',
  'everclear',
  'zircuit',
] as const)

export type SHORT_CHAIN_NAME = Parameters<typeof SHORT_CHAIN_NAMES.has>[0]

export type ChainSpecificAddress = string & {
  _ChainSpecificAddressBrand: string
}

export function ChainSpecificAddress(value: string): ChainSpecificAddress {
  const [chain, address] = value.split(':')
  if (chain === undefined || address === undefined) {
    throw new TypeError(`Incorrect ChainSpecificAddress format: ${value}`)
  }

  const result = validateAddress(address)
  if (!result.valid) {
    throw new TypeError(`Invalid ChainSpecificAddress: ${value}`)
  }

  if (!SHORT_CHAIN_NAMES.has(chain as SHORT_CHAIN_NAME)) {
    throw new TypeError(`Unknown chain name: ${chain}`)
  }

  return `${chain}:${result.address}` as unknown as ChainSpecificAddress
}

ChainSpecificAddress.check = function check(value: string) {
  try {
    return ChainSpecificAddress(value).toString() === value
  } catch {
    return false
  }
}

ChainSpecificAddress.random = function random(chain: SHORT_CHAIN_NAME = 'eth') {
  return ChainSpecificAddress.from(chain, EthereumAddress.random())
}

ChainSpecificAddress.from = function from(
  shortChainName: string,
  pureAddress: string | EthereumAddress,
) {
  return ChainSpecificAddress(`${shortChainName}:${pureAddress}`)
}

ChainSpecificAddress.address = function address(
  value: ChainSpecificAddress,
): EthereumAddress {
  return value.slice(value.indexOf(':') + 1) as unknown as EthereumAddress
}

ChainSpecificAddress.chain = function chain(
  value: ChainSpecificAddress,
): string {
  return value.slice(0, value.indexOf(':'))
}
