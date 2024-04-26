import { constants, utils } from 'ethers'

// eslint-disable-next-line @typescript-eslint/ban-types
export interface EthereumAddress extends String {
  _EthereumAddressBrand: string
}

export function EthereumAddress(value: string): EthereumAddress {
  try {
    return utils.getAddress(value) as unknown as EthereumAddress
  } catch {
    throw new TypeError('Invalid EthereumAddress')
  }
}

EthereumAddress.ZERO = EthereumAddress(constants.AddressZero)

EthereumAddress.check = function check(value: string) {
  try {
    return EthereumAddress(value).toString() === value
  } catch {
    return false
  }
}

EthereumAddress.isBefore = function isBefore(
  a: EthereumAddress,
  b: EthereumAddress,
) {
  return a.toLowerCase() < b.toLowerCase()
}

EthereumAddress.inOrder = function inOrder(
  a: EthereumAddress,
  b: EthereumAddress,
): [EthereumAddress, EthereumAddress] {
  return EthereumAddress.isBefore(a, b) ? [a, b] : [b, a]
}

EthereumAddress.random = function random() {
  const digit = (): string | undefined =>
    '0123456789abcdef'[Math.floor(Math.random() * 16)]
  return EthereumAddress('0x' + Array.from({ length: 40 }).map(digit).join(''))
}

EthereumAddress.unsafe = function unsafe(address: string) {
  return address as unknown as EthereumAddress
}
