import { EthereumAddress } from '@l2beat/common'

export function getCodeLink(
  address: EthereumAddress,
  implementations: EthereumAddress[] | undefined,
) {
  const addresses = [address]
  if (implementations) {
    addresses.push(...implementations)
  }
  return `https://etherscan.deth.net/address/${addresses.join(',')}`
}
