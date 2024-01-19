export interface ChainId extends Number {
  _ChainIdBrand: number
}

export function ChainId(value: number): ChainId {
  if (!(value in CHAIN_IDS)) {
    throw new TypeError('Invalid ChainId')
  }
  return value as unknown as ChainId
}

ChainId.fromName = function (name: string): ChainId {
  const entry = Object.entries(CHAIN_IDS).find(([_, v]) => v === name)
  if (!entry) {
    throw new TypeError('Invalid chain name: ' + name)
  }
  return ChainId(+entry[0])
}

ChainId.getName = function (chainId: ChainId): string {
  const chain = Object.entries(CHAIN_IDS).find(
    ([k]) => k === chainId.toString(),
  )
  if (!chain) {
    throw new TypeError(
      'Programmer error: Invalid chainId: ' + chainId.toString(),
    )
  }
  return chain[1]
}

/**
 * Only to use when defining ChainId.ETHEREUM etc. constants.
 * Will save you from typos, but is annoying to work with strings.
 */
function chainIdFromName(
  name: (typeof CHAIN_IDS)[keyof typeof CHAIN_IDS],
): ChainId {
  return ChainId.fromName(name)
}

const CHAIN_IDS: Record<number, string> = {
  1: 'ethereum',
  42161: 'arbitrum',
  10: 'optimism',
  8453: 'base',
  137: 'polygonpos',
  56: 'bsc',
  957: 'lyra',
  43114: 'avalanche',
  42220: 'celo',
  59144: 'linea',
  1101: 'polygonzkevm',
  100: 'gnosis',
  169: 'mantapacific',
} as const

ChainId.ETHEREUM = chainIdFromName('ethereum')
ChainId.ARBITRUM = chainIdFromName('arbitrum')
ChainId.OPTIMISM = chainIdFromName('optimism')
ChainId.LINEA = chainIdFromName('linea')
ChainId.LYRA = chainIdFromName('lyra')
ChainId.BASE = chainIdFromName('base')
ChainId.MANTAPACIFIC = chainIdFromName('mantapacific')
