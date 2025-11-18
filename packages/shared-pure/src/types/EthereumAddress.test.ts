import { expect } from 'earl'

import { EthereumAddress } from './EthereumAddress.js'

describe(EthereumAddress.name, () => {
  it('accepts lowercase addresses', () => {
    const address = EthereumAddress(
      '0xabcdabcd12345678abcdabcd12345678abcdabcd',
    )
    expect(address).toBeA(String)
  })

  it('accepts addresses with checksum', () => {
    const address = EthereumAddress(
      '0xAbCdABCd12345678abcDabCd12345678ABcdaBcd',
    )
    expect(address).toBeA(String)
  })

  it('checks the checksum', () => {
    expect(() =>
      EthereumAddress('0xAbCdABCd12345678abcDabCd12345678ABcdaBcD'),
    ).toThrow(TypeError, 'Invalid EthereumAddress')
  })

  it('does not accept invalid strings', () => {
    expect(() => EthereumAddress('foo')).toThrow(
      TypeError,
      'Invalid EthereumAddress',
    )
  })

  it('converts to a representation with a checksum', () => {
    const address = EthereumAddress(
      '0xabcdabcd12345678abcdabcd12345678abcdabcd',
    )
    expect(address).toEqual(
      '0xAbCdABCd12345678abcDabCd12345678ABcdaBcd' as unknown as EthereumAddress,
    )
  })

  describe(EthereumAddress.isBefore.name, () => {
    it('checks ordering', () => {
      const a = EthereumAddress('0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
      const b = EthereumAddress('0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb')
      expect(EthereumAddress.isBefore(a, b)).toEqual(true)
      expect(EthereumAddress.isBefore(b, a)).toEqual(false)
      expect(EthereumAddress.isBefore(a, a)).toEqual(false)
    })

    it('works for WETH & USDT', () => {
      const weth = EthereumAddress('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2')
      const usdt = EthereumAddress('0xdAC17F958D2ee523a2206206994597C13D831ec7')
      expect(EthereumAddress.isBefore(weth, usdt)).toEqual(true)
      expect(EthereumAddress.isBefore(usdt, weth)).toEqual(false)
    })
  })

  it('ZERO is the zero address', () => {
    expect(EthereumAddress.ZERO).toEqual(
      ('0x' + '0'.repeat(40)) as unknown as EthereumAddress,
    )
  })

  it('Properly converts a short string to ethereum address using .from', () => {
    const address = EthereumAddress.from('0x1234567890abc')
    expect(address.toString()).toEqual(
      '0x0000000000000000000000000001234567890AbC',
    )
  })

  it('properly checks ignoring case', () => {
    expect(
      EthereumAddress.checkIgnoringCase(
        '0xc2819dc788505aac350142a7a707bf9d03e3bd03',
      ),
    ).toEqual(true)
    expect(EthereumAddress.checkIgnoringCase('test')).toEqual(false)
  })
})
