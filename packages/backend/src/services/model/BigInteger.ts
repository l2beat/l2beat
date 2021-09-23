import { BigNumber } from 'ethers'

export class BigInteger {
  private constructor(private bn: BigNumber) {}

  static from(value: string | number) {
    try {
      return new BigInteger(BigNumber.from(value))
    } catch {
      throw new TypeError('Cannot create BigInteger')
    }
  }

  add(other: BigInteger) {
    return new BigInteger(this.bn.add(other.bn))
  }

  sub(other: BigInteger) {
    return new BigInteger(this.bn.sub(other.bn))
  }

  mul(other: BigInteger) {
    return new BigInteger(this.bn.mul(other.bn))
  }

  div(other: BigInteger) {
    return new BigInteger(this.bn.div(other.bn))
  }

  pow(other: BigInteger) {
    return new BigInteger(this.bn.pow(other.bn))
  }

  mod(other: BigInteger) {
    return new BigInteger(this.bn.mod(other.bn))
  }

  equals(other: BigInteger) {
    return this.bn.eq(other.bn)
  }

  lt(other: BigInteger) {
    return this.bn.lt(other.bn)
  }

  lte(other: BigInteger) {
    return this.bn.lte(other.bn)
  }

  gt(other: BigInteger) {
    return this.bn.gt(other.bn)
  }

  gte(other: BigInteger) {
    return this.bn.gte(other.bn)
  }

  isZero() {
    return this.bn.isZero()
  }

  isNegative() {
    return this.bn.isNegative()
  }

  toString() {
    return this.bn.toString()
  }

  toHex() {
    const str = this.bn.toHexString()
    if (this.isZero()) {
      return '0x0'
    }
    if (str.startsWith('0x0')) {
      return `0x${str.slice(3)}`
    }
    if (str.startsWith('-0x0')) {
      return `-0x${str.slice(4)}`
    }
    return str
  }

  toJSON() {
    return this.toString()
  }
}
