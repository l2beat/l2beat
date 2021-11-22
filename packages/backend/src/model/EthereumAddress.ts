import { constants, utils } from 'ethers'

export class EthereumAddress {
  private address: string

  constructor(address: string) {
    try {
      this.address = utils.getAddress(address)
    } catch {
      throw new TypeError('Invalid address')
    }
  }

  static ZERO = new EthereumAddress(constants.AddressZero)

  equals(other: EthereumAddress) {
    return this.address === other.address
  }

  isBefore(other: EthereumAddress) {
    return this.address.toLowerCase() < other.address.toLowerCase()
  }

  toString() {
    return this.address
  }

  toJSON() {
    return this.address
  }
}
