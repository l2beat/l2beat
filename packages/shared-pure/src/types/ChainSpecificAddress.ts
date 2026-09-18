// Address format following ERC-3770
// https://eips.ethereum.org/EIPS/eip-3770
// Format: "shortName:address"
// Semantics:
// - shortName is mandatory and MUST be a valid chain short name from https://github.com/ethereum-lists/chains
// - address is mandatory and MUST be a ERC-55 compatible hexadecimal address
// WARNING: currently shortName is not verified against the list of chains

import { validateAddress } from '@mradomski/tinyerc55'
import { EthereumAddress } from './EthereumAddress.js'

// NOTE(radomski): This is a little stupid. Ideally we would have a centralized
// list of all chains with their short names. But currently I don't know how to achieve that.
const SHORT_TO_LONG_CHAIN_NAMES = {
  eth: 'ethereum',
  abstract: 'abstract',
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
  forknet: 'forknet',
  taiko: 'taiko',
  facet: 'facet',
  gateway: 'gateway',
  zama: 'zama',
  ethereal: 'ethereal',
  jovay: 'jovay',
  ethscr: 'ethscriptions',
  lens: 'lens',
  lisk: 'lisk',
  redstone: 'redstone',
  soneium: 'soneium',
  wc: 'worldchain',
  hyperevm: 'hyperevm',
  megaeth: 'megaeth',
  polygon: 'polygon',
  tempo: 'tempo',
  mon: 'monad',
  plasma: 'plasma',
  xlayer: 'xlayer',
  robinhood: 'robinhood',
} as const

const LONG_TO_SHORT_CHAIN_NAMES = Object.fromEntries(
  Object.entries(SHORT_TO_LONG_CHAIN_NAMES).map(([short, long]) => [
    long,
    short,
  ]),
) as Record<LongChainName, ShortChainName>

type ShortChainName = keyof typeof SHORT_TO_LONG_CHAIN_NAMES
export type LongChainName =
  (typeof SHORT_TO_LONG_CHAIN_NAMES)[keyof typeof SHORT_TO_LONG_CHAIN_NAMES]

const SHORT_CHAIN_NAMES = new Set(Object.keys(SHORT_TO_LONG_CHAIN_NAMES))

export type ChainSpecificAddress = string & {
  _ChainSpecificAddressBrand: string
}

export function ChainSpecificAddress(value: string): ChainSpecificAddress {
  const parsed = ChainSpecificAddress.tryParse(value)
  if (parsed === undefined) {
    throw parseFailure(value)
  }

  return parsed
}

// The chain name is checked first because it is far cheaper than the ERC-55
// checksum, and callers reject non-addresses in bulk.
ChainSpecificAddress.tryParse = function tryParse(
  value: string,
): ChainSpecificAddress | undefined {
  const separatorIndex = value.indexOf(':')
  if (separatorIndex === -1) {
    return undefined
  }

  const chain = value.slice(0, separatorIndex)
  if (!SHORT_CHAIN_NAMES.has(chain as ShortChainName)) {
    return undefined
  }

  const address = value.slice(separatorIndex + 1)
  const result = validateAddress(address)
  if (!result.valid) {
    return undefined
  }

  return `${chain}:${result.address}` as unknown as ChainSpecificAddress
}

function parseFailure(value: string): TypeError {
  const separatorIndex = value.indexOf(':')
  if (separatorIndex === -1) {
    return new TypeError(`Incorrect ChainSpecificAddress format: ${value}`)
  }

  const address = value.slice(separatorIndex + 1)
  if (!validateAddress(address).valid) {
    return new TypeError(`Invalid ChainSpecificAddress: ${value}`)
  }

  const chain = value.slice(0, separatorIndex)
  return new TypeError(`Unknown chain name: ${chain}`)
}

ChainSpecificAddress.check = function check(
  value: string,
): value is ChainSpecificAddress {
  return ChainSpecificAddress.tryParse(value) === value
}

ChainSpecificAddress.random = function random(chain: ShortChainName = 'eth') {
  return ChainSpecificAddress.from(chain, EthereumAddress.random())
}

ChainSpecificAddress.from = function from(
  shortChainName: string,
  pureAddress: string | EthereumAddress,
) {
  const pureAddressPadded = EthereumAddress.from(pureAddress)
  return ChainSpecificAddress(`${shortChainName}:${pureAddressPadded}`)
}

ChainSpecificAddress.fromLong = function from(
  longChainName: string,
  pureAddress: string | EthereumAddress,
) {
  const shortChainName =
    LONG_TO_SHORT_CHAIN_NAMES[longChainName as LongChainName]

  if (!shortChainName) {
    throw new TypeError(`Unknown long chain name: ${longChainName}`)
  }

  return ChainSpecificAddress(`${shortChainName}:${pureAddress}`)
}

ChainSpecificAddress.address = function address(
  value: ChainSpecificAddress,
): EthereumAddress {
  return value.slice(value.indexOf(':') + 1) as unknown as EthereumAddress
}

ChainSpecificAddress.chain = function chain(
  value: ChainSpecificAddress,
): ShortChainName {
  return value.slice(0, value.indexOf(':')) as unknown as ShortChainName
}

ChainSpecificAddress.longChain = function longChain(
  value: ChainSpecificAddress,
): LongChainName {
  const short = ChainSpecificAddress.chain(value)
  return SHORT_TO_LONG_CHAIN_NAMES[short]
}

ChainSpecificAddress.ZERO = function ZERO(
  longChainName: string,
): ChainSpecificAddress {
  return ChainSpecificAddress.fromLong(longChainName, EthereumAddress.ZERO)
}
