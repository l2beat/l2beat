import { expect } from 'chai'

import { EthAddress } from '../../../src/services/ethereum/EthAddress'

describe('Address', () => {
  it('accepts lowercase addresses', () => {
    const address = new EthAddress('0xabcdabcd12345678abcdabcd12345678abcdabcd')
    expect(address).to.be.instanceOf(EthAddress)
  })

  it('accepts addresses with checksum', () => {
    const address = new EthAddress('0xAbCdABCd12345678abcDabCd12345678ABcdaBcd')
    expect(address).to.be.instanceOf(EthAddress)
  })

  it('checks the checksum', () => {
    expect(
      () => new EthAddress('0xAbCdABCd12345678abcDabCd12345678ABcdaBcD')
    ).to.throw(TypeError, 'Invalid address')
  })

  it('does not accept invalid strings', () => {
    expect(() => new EthAddress('foo')).to.throw(TypeError, 'Invalid address')
  })

  it('toString returns a representation with a checksum', () => {
    const address = new EthAddress('0xabcdabcd12345678abcdabcd12345678abcdabcd')
    expect(address.toString()).to.equal(
      '0xAbCdABCd12345678abcDabCd12345678ABcdaBcd'
    )
  })

  it('checks equality', () => {
    const a = new EthAddress('0xabcdabcd12345678abcdabcd12345678abcdabcd')
    const b = new EthAddress('0xAbCdABCd12345678abcDabCd12345678ABcdaBcd')
    expect(a.equals(b)).to.equal(true)
    expect(b.equals(a)).to.equal(true)
    expect(a.equals(EthAddress.ZERO)).to.equal(false)
  })

  it('correctly stringifies to JSON', () => {
    const address = new EthAddress('0xAbCdABCd12345678abcDabCd12345678ABcdaBcd')
    expect(JSON.stringify(address)).to.equal(
      '"0xAbCdABCd12345678abcDabCd12345678ABcdaBcd"'
    )
  })

  it('ZERO is the zero address', () => {
    expect(EthAddress.ZERO.toString()).to.equal('0x' + '0'.repeat(40))
  })
})
