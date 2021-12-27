import { constants, utils } from 'ethers'

export interface EthereumAddress extends String {
  _ethereumAddressBrand: string
}

export function EthereumAddress(value: string) {
  try {
    return utils.getAddress(value) as unknown as EthereumAddress
  } catch {
    throw new TypeError('Invalid EthereumAddress')
  }
}

EthereumAddress.ZERO = EthereumAddress(constants.AddressZero)

EthereumAddress.isBefore = function (a: EthereumAddress, b: EthereumAddress) {
  return a.toLowerCase() < b.toLowerCase()
}

EthereumAddress.inOrder = function (
  a: EthereumAddress,
  b: EthereumAddress
): [EthereumAddress, EthereumAddress] {
  return EthereumAddress.isBefore(a, b) ? [a, b] : [b, a]
}
