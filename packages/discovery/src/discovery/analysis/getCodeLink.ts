import { ChainId, EthereumAddress } from '@l2beat/shared-pure'

export function getCodeLink(
  address: EthereumAddress,
  implementations: EthereumAddress[] | undefined,
  chainId: ChainId,
) {
  const addresses = [address]
  if (implementations) {
    addresses.push(...implementations)
  }
  const dethDomain = ChainId.getDethDomain(chainId)
  return `https://${dethDomain}/address/${addresses.join(',')}`
}
