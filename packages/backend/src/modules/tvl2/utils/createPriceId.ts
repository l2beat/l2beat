import { EthereumAddress } from '@l2beat/shared-pure'

export function createPriceId(price: {
  address: EthereumAddress | 'native'
  chain: string
}): string {
  return `${price.chain}-${price.address.toString()}`
}
