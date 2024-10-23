export type ChainId = number & {
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
ChainId.NOVA = ChainId(42170)
ChainId.OPTIMISM = ChainId(10)
ChainId.BASE = ChainId(8453)
ChainId.POLYGONPOS = ChainId(137)
ChainId.LINEA = ChainId(59144)
ChainId.POLYGONZKEVM = ChainId(1101)
