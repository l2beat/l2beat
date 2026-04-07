import { Address32 } from '@l2beat/shared-pure'

export function getMissingTokenAddressDisplay(address: string) {
  if (address === Address32.NATIVE) {
    return 'native'
  }

  if (address === Address32.ZERO) {
    return '0x0'
  }

  return Address32.cropToEthereumAddress(Address32(address))
}

export function getMissingTokenExplorerHref(options: {
  address: string
  explorerUrl: string | undefined
}) {
  if (
    !options.explorerUrl ||
    options.address === Address32.NATIVE ||
    options.address === Address32.ZERO
  ) {
    return undefined
  }

  const address = Address32.cropToEthereumAddress(Address32(options.address))
  return `${options.explorerUrl}/address/${address}`
}

export function getAddMissingTokenHref(options: {
  chain: string
  address: string
}) {
  const address =
    options.address === Address32.NATIVE || options.address === Address32.ZERO
      ? 'native'
      : Address32.cropToEthereumAddress(Address32(options.address))

  const params = new URLSearchParams({
    tab: 'deployed',
    chain: options.chain,
    address,
  })

  return `https://tokens.l2beat.com/tokens/new?${params.toString()}`
}
