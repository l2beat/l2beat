import { EthereumAddress } from '@l2beat/shared-pure'

export function validateEthereumAddress(
  address: string,
): EthereumAddress | null {
  try {
    return EthereumAddress(address)
  } catch {
    return null
  }
}

export function parseCommaSeparatedAddresses(
  addressString: string,
): EthereumAddress[] | null {
  try {
    return addressString
      .split(',')
      .map((addr) => EthereumAddress(addr.trim()))
  } catch {
    return null
  }
}
