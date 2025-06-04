import { expect } from 'earl'

import { PrefixedEthereumAddress } from './PrefixedEthereumAddress'

describe(PrefixedEthereumAddress.name, () => {
  it('accepts lowercase addresses', () => {
    const address = PrefixedEthereumAddress(
      'ethereum:0xabcdabcd12345678abcdabcd12345678abcdabcd',
    )
    expect(address).toBeA(String)
  })

  it('accepts addresses with checksum', () => {
    const address = PrefixedEthereumAddress(
      'ethereum:0xAbCdABCd12345678abcDabCd12345678ABcdaBcd',
    )
    expect(address).toBeA(String)
  })

  it('checks the checksum', () => {
    expect(() =>
      PrefixedEthereumAddress(
        'ethereum:0xAbCdABCd12345678abcDabCd12345678ABcdaBcD',
      ),
    ).toThrow(
      TypeError,
      'Invalid PrefixedEthereumAddress: ethereum:0xAbCdABCd12345678abcDabCd12345678ABcdaBcD',
    )
  })

  it('does not accept correct addresses but without a chain', () => {
    expect(() =>
      PrefixedEthereumAddress('0xAbCdABCd12345678abcDabCd12345678ABcdaBcd'),
    ).toThrow(
      TypeError,
      'Incorrect PrefixedEthereumAddress format: 0xAbCdABCd12345678abcDabCd12345678ABcdaBcd',
    )
  })

  it('does not accept invalid strings', () => {
    expect(() => PrefixedEthereumAddress('foo')).toThrow(
      TypeError,
      'Incorrect PrefixedEthereumAddress format: foo',
    )
    expect(() => PrefixedEthereumAddress('kk:foo')).toThrow(
      TypeError,
      'Invalid PrefixedEthereumAddress: kk:foo',
    )
  })

  it('converts to a representation with a checksum', () => {
    const address = PrefixedEthereumAddress(
      'ethereum:0xabcdabcd12345678abcdabcd12345678abcdabcd',
    )
    expect(address).toEqual(
      'ethereum:0xAbCdABCd12345678abcDabCd12345678ABcdaBcd' as unknown as PrefixedEthereumAddress,
    )
  })
})
