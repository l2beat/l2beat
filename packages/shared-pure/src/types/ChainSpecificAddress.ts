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
// list of all chains with their short names. But currently I don't know how to achieve that.
const SHORT_TO_LONG_CHAIN_NAMES = {
  eth: 'ethereum',
  arb1: 'arbitrum',
  'arb-nova': 'nova',
  oeth: 'optimism',
  matic: 'polygonpos',
  bnb: 'bsc',
  avax: 'avalanche',
  celo: 'celo',
  linea: 'linea',
  base: 'base',
  zkevm: 'polygonzkevm',
  gno: 'gnosis',
  zksync: 'zksync2',
  sep: 'sepolia',
  scr: 'scroll',
  mantle: 'mantle',
  'metis-andromeda': 'metis',
  boba: 'bobanetwork',
  mode: 'mode',
  zora: 'zora',
  manta: 'mantapacific',
  blastmainnet: 'blast',
  kinto: 'kinto',
  unichain: 'unichain',
  ink: 'ink',
  everclear: 'everclear',
  zircuit: 'zircuit',
  katana: 'katana',
  gateway: 'gateway',
} as const

const LONG_TO_SHORT_CHAIN_NAMES = Object.fromEntries(
  Object.entries(SHORT_TO_LONG_CHAIN_NAMES).map(([short, long]) => [
    long,
    short,
  ]),
) as Record<LONG_CHAIN_NAME, SHORT_CHAIN_NAME>

type SHORT_CHAIN_NAME = keyof typeof SHORT_TO_LONG_CHAIN_NAMES
type LONG_CHAIN_NAME =
  (typeof SHORT_TO_LONG_CHAIN_NAMES)[keyof typeof SHORT_TO_LONG_CHAIN_NAMES]

const SHORT_CHAIN_NAMES = new Set(Object.keys(SHORT_TO_LONG_CHAIN_NAMES))

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

ChainSpecificAddress.check = function check(
  value: string,
): value is ChainSpecificAddress {
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

ChainSpecificAddress.fromLong = function from(
  longChainName: string,
  pureAddress: string | EthereumAddress,
) {
  const shortChainName =
    LONG_TO_SHORT_CHAIN_NAMES[longChainName as LONG_CHAIN_NAME]
  return ChainSpecificAddress(`${shortChainName}:${pureAddress}`)
}

ChainSpecificAddress.address = function address(
  value: ChainSpecificAddress,
): EthereumAddress {
  return value.slice(value.indexOf(':') + 1) as unknown as EthereumAddress
}

ChainSpecificAddress.chain = function chain(
  value: ChainSpecificAddress,
): SHORT_CHAIN_NAME {
  return value.slice(0, value.indexOf(':')) as unknown as SHORT_CHAIN_NAME
}

ChainSpecificAddress.longChain = function longChain(
  value: ChainSpecificAddress,
): LONG_CHAIN_NAME {
  const short = ChainSpecificAddress.chain(value)
  return SHORT_TO_LONG_CHAIN_NAMES[short]
}

ChainSpecificAddress.ZERO = function ZERO(
  longChainName: string,
): ChainSpecificAddress {
  return ChainSpecificAddress.fromLong(longChainName, EthereumAddress.ZERO)
}
