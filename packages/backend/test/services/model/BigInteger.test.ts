import { expect } from 'chai'

import { BigInteger } from '../../../src/services/model'

describe('BigInteger', () => {
  it('can be constructed from a string', () => {
    const big = BigInteger.from('123')
    expect(big.toString()).to.equal('123')
  })

  it('can be constructed from a hex string', () => {
    const big = BigInteger.from('0xa455')
    expect(big.toString()).to.equal('42069')
  })

  it('can be constructed from a number', () => {
    const big = BigInteger.from(42069)
    expect(big.toString()).to.equal('42069')
  })

  const A = BigInteger.from(420)
  const B = BigInteger.from(69)

  it('add', () => {
    expect(A.add(B)).to.deep.equal(BigInteger.from(420 + 69))
  })

  it('sub', () => {
    expect(A.sub(B)).to.deep.equal(BigInteger.from(420 - 69))
  })

  it('mul', () => {
    expect(A.mul(B)).to.deep.equal(BigInteger.from(420 * 69))
  })

  it('pow', () => {
    expect(A.pow(B)).to.deep.equal(
      BigInteger.from(
        '0x026eefae1a3ac12829f0af23725fc04aa1bd0040cb104f6233fb9b2e380d6dd962eac192a7d78081211d256a2dd8e1d842ec31a291dcd27b0ffa240000000000000000000000000000000000'
      )
    )
  })

  it('mod', () => {
    expect(A.mod(B)).to.deep.equal(BigInteger.from(420 % 69))
  })

  it('equals', () => {
    expect(A.equals(B)).to.equal(false)
    expect(A.equals(BigInteger.from(420))).to.equal(true)
  })

  it('lt', () => {
    expect(A.lt(B)).to.equal(false)
    expect(A.lt(A)).to.equal(false)
    expect(B.lt(A)).to.equal(true)
  })

  it('lte', () => {
    expect(A.lte(B)).to.equal(false)
    expect(A.lte(A)).to.equal(true)
    expect(B.lte(A)).to.equal(true)
  })

  it('gt', () => {
    expect(A.gt(B)).to.equal(true)
    expect(A.gt(A)).to.equal(false)
    expect(B.gt(A)).to.equal(false)
  })

  it('gte', () => {
    expect(A.gte(B)).to.equal(true)
    expect(A.gte(A)).to.equal(true)
    expect(B.gte(A)).to.equal(false)
  })

  it('isZero', () => {
    expect(A.isZero()).to.equal(false)
    expect(BigInteger.from(0).isZero()).to.equal(true)
  })

  it('isNegative', () => {
    expect(A.isNegative()).to.equal(false)
    expect(BigInteger.from(0).isNegative()).to.equal(false)
    expect(BigInteger.from(-5).isNegative()).to.equal(true)
  })

  it('toString', () => {
    expect(A.toString()).to.equal('420')
    expect(BigInteger.from(-3).toString()).to.equal('-3')
  })

  it('toHex', () => {
    expect(A.toHex()).to.equal('0x1a4')
    expect(BigInteger.from(0).toHex()).to.equal('0x0')
    expect(BigInteger.from(-298).toHex()).to.equal('-0x12a')
    expect(BigInteger.from(12345).toHex()).to.equal('0x3039')
  })

  it('toJSON', () => {
    expect(A.toJSON()).to.equal(A.toString())
  })
})
