import { Address32 } from '@l2beat/shared-pure'
import { getAddTokenLinkOptions } from '../transfers-details/utils'

function isNativeOrZeroAddress(address: string) {
  return address === Address32.NATIVE || address === Address32.ZERO
}

export function formatMissingTokenAddress(address: string) {
  if (isNativeOrZeroAddress(address)) {
    return address
  }

  return Address32.cropToEthereumAddress(Address32(address))
}

export function getMissingTokenExplorerAddress(address: string) {
  if (isNativeOrZeroAddress(address)) {
    return undefined
  }

  return Address32.cropToEthereumAddress(Address32(address))
}

export function getMissingTokenAddTokenLink(
  chain: string,
  tokenAddress: string,
): {
  href: string
  label: string
} | null {
  if (isNativeOrZeroAddress(tokenAddress)) {
    const params = new URLSearchParams({
      tab: 'deployed',
      chain,
      address: 'native',
    })

    return {
      href: `https://tokens.l2beat.com/tokens/new?${params.toString()}`,
      label: 'add token',
    }
  }

  return getAddTokenLinkOptions({
    address: tokenAddress,
    chain,
    otherSideAbstractTokenId: undefined,
  })
}
