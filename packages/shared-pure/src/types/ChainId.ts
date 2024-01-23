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
ChainId.OPTIMISM = ChainId(10)
ChainId.LINEA = ChainId(59144)
ChainId.LYRA = ChainId(957)
ChainId.BASE = ChainId(8453)
ChainId.MANTAPACIFIC = ChainId(169)
