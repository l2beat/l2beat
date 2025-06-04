import { validateAddress } from '@mradomski/tinyerc55'

export type PrefixedEthereumAddress = string & {
  _PrefixedEthereumAddressBrand: string
}

export function PrefixedEthereumAddress(
  value: string,
): PrefixedEthereumAddress {
  const [chain, address] = value.split(':')
  if (chain === undefined || address === undefined) {
    throw new TypeError(`Incorrect PrefixedEthereumAddress format: ${value}`)
  }
  const result = validateAddress(address)
  if (!result.valid) {
    throw new TypeError(`Invalid PrefixedEthereumAddress: ${value}`)
  }

  return `${chain}:${result.address}` as unknown as PrefixedEthereumAddress
}
