import { constants, utils } from 'ethers'

export class EthAddress {
  private address: string

  constructor(address: string) {
    try {
      this.address = utils.getAddress(address)
    } catch {
      throw new TypeError('Invalid address')
    }
  }

  static ZERO = new EthAddress(constants.AddressZero)

  equals(other: EthAddress) {
    return this.address === other.address
  }

  toString() {
    return this.address
  }

  toJSON() {
    return this.address
  }
}
