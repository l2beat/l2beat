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
  const entry = Object.entries(CHAIN_IDS).find(([_, v]) => v.name === name)
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
  return chain[1].name
}

ChainId.getExplorer = function (chainId: ChainId): string {
  const chain = Object.entries(CHAIN_IDS).find(
    ([k]) => k === chainId.toString(),
  )
  if (!chain) {
    throw new TypeError(
      'Programmer error: Invalid chainId: ' + chainId.toString(),
    )
  }
  if (!chain[1].explorer) {
    throw new TypeError(
      'Programmer error: No explorer provided for chainId: ' +
        chainId.toString(),
    )
  }

  return chain[1].explorer
}

ChainId.getAll = function (): ChainId[] {
  return Object.keys(CHAIN_IDS).map((c) => ChainId(+c))
}

type ChainIds = typeof CHAIN_IDS

/**
 * Only to use when defining ChainId.ETHEREUM etc. constants.
 * Will save you from typos, but is annoying to work with strings.
 */
function chainIdFromName(name: ChainIds[keyof ChainIds]['name']): ChainId {
  const entry = Object.entries(CHAIN_IDS).find(([_, v]) => v.name === name)
  if (!entry) {
    throw new TypeError('Programmer error: Invalid chain name: ' + name)
  }
  return ChainId(+entry[0])
}

const CHAIN_IDS: Record<number, { name: string; explorer: string }> = {
  1: {
    name: 'ethereum',
    explorer: 'https://etherscan.io',
  },
  42161: {
    name: 'arbitrum',
    explorer: 'https://arbiscan.io',
  },
  10: {
    name: 'optimism',
    explorer: 'https://optimistic.etherscan.io',
  },
  8453: {
    name: 'base',
    explorer: 'https://basescan.org',
  },
  137: {
    name: 'polygon-pos',
    explorer: 'https://polygonscan.com',
  },
  56: {
    name: 'bsc',
    explorer: 'https://bscscan.com',
  },
  43114: {
    name: 'avalanche',
    explorer: 'https://snowtrace.io',
  },
  42220: {
    name: 'celo',
    explorer: 'https://celoscan.io',
  },
  59144: {
    name: 'linea',
    explorer: 'https://lineascan.build',
  },
  1101: {
    name: 'polygon-zkevm',
    explorer: 'https://zkevm.polygonscan.com',
  },
  100: {
    name: 'gnosis',
    explorer: 'https://gnosisscan.io',
  },
} as const

ChainId.ETHEREUM = chainIdFromName('ethereum')
ChainId.ARBITRUM = chainIdFromName('arbitrum')
ChainId.OPTIMISM = chainIdFromName('optimism')
ChainId.POLYGON_POS = chainIdFromName('polygon-pos')
ChainId.BSC = chainIdFromName('bsc')
ChainId.AVALANCHE = chainIdFromName('avalanche')
ChainId.CELO = chainIdFromName('celo')
ChainId.LINEA = chainIdFromName('linea')
ChainId.BASE = chainIdFromName('base')
ChainId.POLYGON_ZKEVM = chainIdFromName('polygon-zkevm')
ChainId.GNOSIS = chainIdFromName('gnosis')
