export interface ChainId extends Number {
  _ChainIdBrand: number
}

export function ChainId(value: number): ChainId {
  if (!CHAIN_IDS.includes(value)) {
    throw new TypeError('Invalid ChainId')
  }
  return value as unknown as ChainId
}

const CHAIN_IDS = [
  1, // Ethereum Mainnet
  42161, // Arbitrum One
  -1, // All native tokens fall under this ChainId
]

ChainId.ETHEREUM = ChainId(CHAIN_IDS[0])
ChainId.ARBITRUM = ChainId(CHAIN_IDS[1])
ChainId.NMV = ChainId(CHAIN_IDS[2])
