export interface ChainId extends Number {
  _ChainIdBrand: number
}

export function ChainId(value: number): ChainId {
  if (!CHAIN_IDS.map((c) => c.id).includes(value)) {
    throw new TypeError('Invalid ChainId')
  }
  return value as unknown as ChainId
}

interface ChainMetadata {
  id: number
  name: string
}

const CHAIN_IDS: ChainMetadata[] = [
  {
    id: 1,
    name: 'ethereum',
  },
  {
    id: 42161,
    name: 'arbitrum',
  },
  {
    id: -1,
    name: 'native',
  },
]

ChainId.ETHEREUM = ChainId(CHAIN_IDS[0].id)
ChainId.ARBITRUM = ChainId(CHAIN_IDS[1].id)
ChainId.NMV = ChainId(CHAIN_IDS[2].id)

ChainId.getName = function (chainId: ChainId): string {
  const chain = CHAIN_IDS.find((c) => c.id === +chainId)
  if (!chain) {
    throw new TypeError('Invalid ChainId')
  }
  return chain.name
}

ChainId.getId = function (chainName: string): ChainId {
  const chain = CHAIN_IDS.find((c) => c.name === chainName)
  if (!chain) {
    throw new TypeError('Invalid ChainId')
  }
  return ChainId(chain.id)
}

ChainId.getAll = function (): ChainId[] {
  return CHAIN_IDS.map((c) => ChainId(c.id))
}
