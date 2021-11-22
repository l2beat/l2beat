import { expect } from 'chai'

import { EthereumAddress } from '../../src/model'

describe('EthereumAddress', () => {
  it('accepts lowercase addresses', () => {
    const address = new EthereumAddress(
      '0xabcdabcd12345678abcdabcd12345678abcdabcd'
    )
    expect(address).to.be.instanceOf(EthereumAddress)
  })

  it('accepts addresses with checksum', () => {
    const address = new EthereumAddress(
      '0xAbCdABCd12345678abcDabCd12345678ABcdaBcd'
    )
    expect(address).to.be.instanceOf(EthereumAddress)
  })

  it('checks the checksum', () => {
    expect(
      () => new EthereumAddress('0xAbCdABCd12345678abcDabCd12345678ABcdaBcD')
    ).to.throw(TypeError, 'Invalid address')
  })

  it('does not accept invalid strings', () => {
    expect(() => new EthereumAddress('foo')).to.throw(
      TypeError,
      'Invalid address'
    )
  })

  it('toString returns a representation with a checksum', () => {
    const address = new EthereumAddress(
      '0xabcdabcd12345678abcdabcd12345678abcdabcd'
    )
    expect(address.toString()).to.equal(
      '0xAbCdABCd12345678abcDabCd12345678ABcdaBcd'
    )
  })

  it('checks equality', () => {
    const a = new EthereumAddress('0xabcdabcd12345678abcdabcd12345678abcdabcd')
    const b = new EthereumAddress('0xAbCdABCd12345678abcDabCd12345678ABcdaBcd')
    expect(a.equals(b)).to.equal(true)
    expect(b.equals(a)).to.equal(true)
    expect(a.equals(EthereumAddress.ZERO)).to.equal(false)
  })

  it('checks ordering', () => {
    const a = new EthereumAddress('0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
    const b = new EthereumAddress('0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb')
    expect(a.isBefore(b)).to.equal(true)
    expect(b.isBefore(a)).to.equal(false)
    expect(a.isBefore(a)).to.equal(false)
  })

  it('correctly stringifies to JSON', () => {
    const address = new EthereumAddress(
      '0xAbCdABCd12345678abcDabCd12345678ABcdaBcd'
    )
    expect(JSON.stringify(address)).to.equal(
      '"0xAbCdABCd12345678abcDabCd12345678ABcdaBcd"'
    )
  })

  it('ZERO is the zero address', () => {
    expect(EthereumAddress.ZERO.toString()).to.equal('0x' + '0'.repeat(40))
  })
})
