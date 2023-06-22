export interface ChainId extends String {
  _ChainIdBrand: string
}

export function ChainId(value: string): ChainId {
  if (!CHAIN_IDS.includes(value)) {
    throw new TypeError('Invalid ChainId')
  }
  return value as unknown as ChainId
}

const CHAIN_IDS = [
  '0x1', // Ethereum Mainnet
  '0xa4b1', // Arbitrum One
]

ChainId.ETHEREUM = ChainId(CHAIN_IDS[0])
ChainId.ARBITRUM = ChainId(CHAIN_IDS[1])
