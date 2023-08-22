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

ChainId.getAll = function (): ChainId[] {
  return Object.keys(CHAIN_IDS).map((c) => ChainId(+c))
}

type ChainIds = typeof CHAIN_IDS

ChainId.fromNameTypesafe = function (name: ChainIds[keyof ChainIds]): ChainId {
  const entry = Object.entries(CHAIN_IDS).find(([_, v]) => v === name)
  if (!entry) {
    throw new TypeError('Programmer error: Invalid chain name: ' + name)
  }
  return ChainId(+entry[0])
}

const CHAIN_IDS = {
  1: 'ethereum',
  42161: 'arbitrum',
  10: 'optimism',
  137: 'polygon-pos',
  56: 'bsc',
  43114: 'avalanche',
  42220: 'celo',
  59144: 'linea',
  8453: 'base',
  1101: 'polygon-zkevm',
  100: 'gnosis',
  '-1': 'native',
} as const

ChainId.ETHEREUM = ChainId.fromNameTypesafe('ethereum')
ChainId.ARBITRUM = ChainId.fromNameTypesafe('arbitrum')
ChainId.OPTIMISM = ChainId.fromNameTypesafe('optimism')
ChainId.POLYGON_POS = ChainId.fromNameTypesafe('polygon-pos')
ChainId.BSC = ChainId.fromNameTypesafe('bsc')
ChainId.AVALANCHE = ChainId.fromNameTypesafe('avalanche')
ChainId.CELO = ChainId.fromNameTypesafe('celo')
ChainId.LINEA = ChainId.fromNameTypesafe('linea')
ChainId.BASE = ChainId.fromNameTypesafe('base')
ChainId.POLYGON_ZKEVM = ChainId.fromNameTypesafe('polygon-zkevm')
ChainId.GNOSIS = ChainId.fromNameTypesafe('gnosis')
ChainId.NMV = ChainId.fromNameTypesafe('native')
