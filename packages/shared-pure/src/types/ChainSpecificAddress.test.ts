import { expect } from 'earl'

import { ChainSpecificAddress } from './ChainSpecificAddress'

describe(ChainSpecificAddress.name, () => {
  it('accepts lowercase addresses', () => {
    const address = ChainSpecificAddress(
      'ethereum:0xabcdabcd12345678abcdabcd12345678abcdabcd',
    )
    expect(address).toBeA(String)
  })

  it('accepts addresses with checksum', () => {
    const address = ChainSpecificAddress(
      'ethereum:0xAbCdABCd12345678abcDabCd12345678ABcdaBcd',
    )
    expect(address).toBeA(String)
  })

  it('checks the checksum', () => {
    expect(() =>
      ChainSpecificAddress(
        'ethereum:0xAbCdABCd12345678abcDabCd12345678ABcdaBcD',
      ),
    ).toThrow(
      TypeError,
      'Invalid ChainSpecificAddress: ethereum:0xAbCdABCd12345678abcDabCd12345678ABcdaBcD',
    )
  })

  it('does not accept correct addresses but without a chain', () => {
    expect(() =>
      ChainSpecificAddress('0xAbCdABCd12345678abcDabCd12345678ABcdaBcd'),
    ).toThrow(
      TypeError,
      'Incorrect ChainSpecificAddress format: 0xAbCdABCd12345678abcDabCd12345678ABcdaBcd',
    )
  })

  it('does not accept invalid strings', () => {
    expect(() => ChainSpecificAddress('foo')).toThrow(
      TypeError,
      'Incorrect ChainSpecificAddress format: foo',
    )
    expect(() => ChainSpecificAddress('kk:foo')).toThrow(
      TypeError,
      'Invalid ChainSpecificAddress: kk:foo',
    )
  })

  it('converts to a representation with a checksum', () => {
    const address = ChainSpecificAddress(
      'ethereum:0xabcdabcd12345678abcdabcd12345678abcdabcd',
    )
    expect(address).toEqual(
      'ethereum:0xAbCdABCd12345678abcDabCd12345678ABcdaBcd' as unknown as ChainSpecificAddress,
    )
  })
})
