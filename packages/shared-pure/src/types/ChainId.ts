export interface ChainId extends Number {
  _ChainIdBrand: number
}

export function ChainId(value: number): ChainId {
  if (!Number.isInteger(value) || value < 0) {
    throw new TypeError('Invalid ChainId')
  }
  return value as unknown as ChainId
}

ChainId.ETHEREUM = ChainId(1)
ChainId.ARBITRUM = ChainId(42161)
