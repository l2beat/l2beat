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

  describe(EthereumAddress.from.name, () => {
    it('pads a short string to a full address', () => {
      expect(EthereumAddress.from('0x1234567890abc').toString()).toEqual(
        '0x0000000000000000000000000001234567890AbC',
      )
    })

    it('rejects every non-hex ascii character', () => {
      const hexDigits = '0123456789abcdefABCDEF'
      for (let code = 0x20; code < 0x80; code++) {
        const char = String.fromCharCode(code)
        if (hexDigits.includes(char)) {
          continue
        }
        expect(() => EthereumAddress.from(`0x${char.repeat(40)}`)).toThrow(
          TypeError,
          'Invalid EthereumAddress',
        )
      }
    })

    it('rejects a non-hex character in any position', () => {
      const valid = `0x${'1'.repeat(40)}`
      for (let position = 2; position < valid.length; position++) {
        const withZ = `${valid.slice(0, position)}z${valid.slice(position + 1)}`
        expect(() => EthereumAddress.from(withZ)).toThrow(
          TypeError,
          'Invalid EthereumAddress',
        )
      }
    })

    it('rejects non-ascii characters', () => {
      for (const char of ['é', '一', '\uD800', '\u{1F600}']) {
        expect(() => EthereumAddress.from(`0x${char.repeat(40)}`)).toThrow(
          TypeError,
          'Invalid EthereumAddress',
        )
      }
    })

    it('rejects a string longer than an address', () => {
      expect(() => EthereumAddress.from(`0x${'1'.repeat(41)}`)).toThrow(
        TypeError,
        'Invalid EthereumAddress',
      )
    })
  })

  describe(EthereumAddress.tryParse.name, () => {
    it('returns the checksummed value', () => {
      expect(
        EthereumAddress.tryParse('0xabcdabcd12345678abcdabcd12345678abcdabcd'),
      ).toEqual(
        '0xAbCdABCd12345678abcDabCd12345678ABcdaBcd' as unknown as EthereumAddress,
      )
    })

    it('returns undefined instead of throwing', () => {
      const invalid = [
        'foo',
        '',
        'OptimismPortal',
        '0x123',
        '0xAbCdABCd12345678abcDabCd12345678ABcdaBcD',
        'eth:0xAbCdABCd12345678abcDabCd12345678ABcdaBcd',
      ]
      for (const value of invalid) {
        expect(EthereumAddress.tryParse(value)).toEqual(undefined)
        expect(() => EthereumAddress(value)).toThrow(TypeError)
      }
    })

    it('agrees with the constructor on valid values', () => {
      for (let i = 0; i < 64; i++) {
        const value = EthereumAddress.random()
        expect(EthereumAddress.tryParse(value)).toEqual(EthereumAddress(value))
      }
    })
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
