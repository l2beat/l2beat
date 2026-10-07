import { expect } from 'earl'

import { ChainSpecificAddress } from './ChainSpecificAddress.js'
import { EthereumAddress } from './EthereumAddress.js'

describe(ChainSpecificAddress.name, () => {
  describe('creation', () => {
    it('accepts lowercase addresses', () => {
      const address = ChainSpecificAddress(
        'eth:0xabcdabcd12345678abcdabcd12345678abcdabcd',
      )
      expect(address).toBeA(String)
    })

    it('accepts addresses with checksum', () => {
      const address = ChainSpecificAddress(
        'eth:0xAbCdABCd12345678abcDabCd12345678ABcdaBcd',
      )
      expect(address).toBeA(String)
    })

    it('checks the checksum', () => {
      expect(() =>
        ChainSpecificAddress('eth:0xAbCdABCd12345678abcDabCd12345678ABcdaBcD'),
      ).toThrow(
        TypeError,
        'Invalid ChainSpecificAddress: eth:0xAbCdABCd12345678abcDabCd12345678ABcdaBcD',
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
        'eth:0xabcdabcd12345678abcdabcd12345678abcdabcd',
      )
      expect(address).toEqual(
        'eth:0xAbCdABCd12345678abcDabCd12345678ABcdaBcd' as unknown as ChainSpecificAddress,
      )
    })

    it('does not accept a trailing segment after the address', () => {
      expect(() =>
        ChainSpecificAddress(
          'eth:0xAbCdABCd12345678abcDabCd12345678ABcdaBcd:extra',
        ),
      ).toThrow(
        TypeError,
        'Invalid ChainSpecificAddress: eth:0xAbCdABCd12345678abcDabCd12345678ABcdaBcd:extra',
      )
    })
  })

  describe(ChainSpecificAddress.tryParse.name, () => {
    it('returns the checksummed value', () => {
      expect(
        ChainSpecificAddress.tryParse(
          'eth:0xabcdabcd12345678abcdabcd12345678abcdabcd',
        ),
      ).toEqual(
        'eth:0xAbCdABCd12345678abcDabCd12345678ABcdaBcd' as unknown as ChainSpecificAddress,
      )
    })

    it('returns undefined instead of throwing', () => {
      const invalid = [
        'foo',
        '',
        '0xAbCdABCd12345678abcDabCd12345678ABcdaBcd',
        'kk:foo',
        'kk:0xAbCdABCd12345678abcDabCd12345678ABcdaBcd',
        'eth:0xAbCdABCd12345678abcDabCd12345678ABcdaBcD',
        'eth:0xAbCdABCd12345678abcDabCd12345678ABcdaBcd:extra',
        'eth:',
        ':0xAbCdABCd12345678abcDabCd12345678ABcdaBcd',
      ]
      for (const value of invalid) {
        expect(ChainSpecificAddress.tryParse(value)).toEqual(undefined)
        expect(() => ChainSpecificAddress(value)).toThrow(TypeError)
      }
    })

    it('agrees with the constructor on valid values', () => {
      for (let i = 0; i < 64; i++) {
        const value = ChainSpecificAddress.random()
        expect(ChainSpecificAddress.tryParse(value)).toEqual(
          ChainSpecificAddress(value),
        )
      }
    })

    it('agrees with check', () => {
      const values = [
        'eth:0xAbCdABCd12345678abcDabCd12345678ABcdaBcd',
        'eth:0xabcdabcd12345678abcdabcd12345678abcdabcd',
        'kk:0xAbCdABCd12345678abcDabCd12345678ABcdaBcd',
        'foo',
      ]
      for (const value of values) {
        expect(ChainSpecificAddress.tryParse(value) === value).toEqual(
          ChainSpecificAddress.check(value),
        )
      }
    })
  })

  describe(ChainSpecificAddress.random.name, () => {
    it('creates a random address', () => {
      const address = ChainSpecificAddress.random()
      expect(address).toBeA(String)
      expect(ChainSpecificAddress.check(address)).toEqual(true)
    })

    it('creates a random address on different chain', () => {
      const address = ChainSpecificAddress.random('arb1')
      expect(address).toBeA(String)
      expect(address.startsWith('arb1:')).toEqual(true)
      expect(ChainSpecificAddress.check(address)).toEqual(true)
    })

    it('creates different addresses', () => {
      const addresses = Array.from({ length: 100 }, () =>
        ChainSpecificAddress.random(),
      ).map((address) => address.toString())
      const uniqueAddresses = new Set(addresses)
      expect(uniqueAddresses.size).toBeGreaterThan(80)
    })
  })

  describe(ChainSpecificAddress.from.name, () => {
    it('creates an address', () => {
      const address = ChainSpecificAddress.from(
        'eth',
        '0xAbCdABCd12345678abcDabCd12345678ABcdaBcd',
      )
      expect(address).toBeA(String)
      expect(ChainSpecificAddress.check(address)).toEqual(true)
      expect(address.toString()).toEqual(
        'eth:0xAbCdABCd12345678abcDabCd12345678ABcdaBcd',
      )
    })

    it('creates an address on different chain', () => {
      const address = ChainSpecificAddress.from(
        'base',
        '0x33D66941465ac776C38096cb1bc496C673aE7390',
      )
      expect(address).toBeA(String)
      expect(ChainSpecificAddress.check(address)).toEqual(true)
      expect(address.toString()).toEqual(
        'base:0x33D66941465ac776C38096cb1bc496C673aE7390',
      )
    })
  })

  describe(ChainSpecificAddress.fromLong.name, () => {
    it('creates an address from long chain name', () => {
      const address = ChainSpecificAddress.fromLong(
        'ethereum',
        '0xAbCdABCd12345678abcDabCd12345678ABcdaBcd',
      )
      expect(address).toBeA(String)
      expect(ChainSpecificAddress.check(address)).toEqual(true)
      expect(address.toString()).toEqual(
        'eth:0xAbCdABCd12345678abcDabCd12345678ABcdaBcd',
      )
    })

    it('throws on unknown long chain name', () => {
      expect(() =>
        ChainSpecificAddress.fromLong(
          'unknown-chain',
          '0xAbCdABCd12345678abcDabCd12345678ABcdaBcd',
        ),
      ).toThrow(TypeError, 'Unknown long chain name: unknown-chain')
    })
  })

  describe(ChainSpecificAddress.chain.name, () => {
    it('eth', () => {
      const address = ChainSpecificAddress.random('eth')
      expect(ChainSpecificAddress.chain(address)).toEqual('eth')
    })

    it('arb1', () => {
      const address = ChainSpecificAddress.random('arb1')
      expect(ChainSpecificAddress.chain(address)).toEqual('arb1')
    })
  })

  describe(ChainSpecificAddress.address.name, () => {
    it('works on eth', () => {
      const rawAddress = EthereumAddress(
        '0xAbCdABCd12345678abcDabCd12345678ABcdaBcd',
      )
      const address = ChainSpecificAddress.from('eth', rawAddress)
      expect(ChainSpecificAddress.address(address)).toEqual(rawAddress)
    })

    it('works on something different', () => {
      const rawAddress = EthereumAddress(
        '0x33D66941465ac776C38096cb1bc496C673aE7390',
      )
      const address = ChainSpecificAddress.from('base', rawAddress)
      expect(ChainSpecificAddress.address(address)).toEqual(rawAddress)
    })
  })
})
