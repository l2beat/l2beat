export interface ChainName extends String {
  _ChainNameBrand: string
}

export function ChainName(value: string): ChainName {
  if (!CHAIN_NAMES.includes(value)) {
    throw new TypeError('Invalid ChainName')
  }
  return value as unknown as ChainName
}

const CHAIN_NAMES = [
  'ethereum', // Ethereum Mainnet
]

ChainName.ETHEREUM = ChainName(CHAIN_NAMES[0])
