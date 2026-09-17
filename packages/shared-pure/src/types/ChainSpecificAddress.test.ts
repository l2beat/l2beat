import { describe, expect, it } from 'vitest'

import { ChainSpecificAddress } from './ChainSpecificAddress.js'
import { EthereumAddress } from './EthereumAddress.js'

describe(ChainSpecificAddress.name, () => {
  describe('creation', () => {
    it('accepts lowercase addresses', () => {
      const address = ChainSpecificAddress(
        'eth:0xabcdabcd12345678abcdabcd12345678abcdabcd',
      )
      expect(address).toBeTypeOf('string')
    })

    it('accepts addresses with checksum', () => {
      const address = ChainSpecificAddress(
        'eth:0xAbCdABCd12345678abcDabCd12345678ABcdaBcd',
      )
      expect(address).toBeTypeOf('string')
    })

    it('checks the checksum', () => {
      expect(() =>
        ChainSpecificAddress('eth:0xAbCdABCd12345678abcDabCd12345678ABcdaBcD'),
      ).toThrow(TypeError)
      expect(() =>
        ChainSpecificAddress('eth:0xAbCdABCd12345678abcDabCd12345678ABcdaBcD'),
      ).toThrow(
        'Invalid ChainSpecificAddress: eth:0xAbCdABCd12345678abcDabCd12345678ABcdaBcD',
      )
    })

    it('does not accept correct addresses but without a chain', () => {
      expect(() =>
        ChainSpecificAddress('0xAbCdABCd12345678abcDabCd12345678ABcdaBcd'),
      ).toThrow(TypeError)
      expect(() =>
        ChainSpecificAddress('0xAbCdABCd12345678abcDabCd12345678ABcdaBcd'),
      ).toThrow(
        'Incorrect ChainSpecificAddress format: 0xAbCdABCd12345678abcDabCd12345678ABcdaBcd',
      )
    })

    it('does not accept invalid strings', () => {
      expect(() => ChainSpecificAddress('foo')).toThrow(TypeError)
      expect(() => ChainSpecificAddress('foo')).toThrow(
        'Incorrect ChainSpecificAddress format: foo',
      )
      expect(() => ChainSpecificAddress('kk:foo')).toThrow(TypeError)
      expect(() => ChainSpecificAddress('kk:foo')).toThrow(
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
  })

  describe(ChainSpecificAddress.random.name, () => {
    it('creates a random address', () => {
      const address = ChainSpecificAddress.random()
      expect(address).toBeTypeOf('string')
      expect(ChainSpecificAddress.check(address)).toBe(true)
    })

    it('creates a random address on different chain', () => {
      const address = ChainSpecificAddress.random('arb1')
      expect(address).toBeTypeOf('string')
      expect(address.startsWith('arb1:')).toBe(true)
      expect(ChainSpecificAddress.check(address)).toBe(true)
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
      expect(address).toBeTypeOf('string')
      expect(ChainSpecificAddress.check(address)).toBe(true)
      expect(address.toString()).toBe(
        'eth:0xAbCdABCd12345678abcDabCd12345678ABcdaBcd',
      )
    })

    it('creates an address on different chain', () => {
      const address = ChainSpecificAddress.from(
        'base',
        '0x33D66941465ac776C38096cb1bc496C673aE7390',
      )
      expect(address).toBeTypeOf('string')
      expect(ChainSpecificAddress.check(address)).toBe(true)
      expect(address.toString()).toBe(
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
      expect(address).toBeTypeOf('string')
      expect(ChainSpecificAddress.check(address)).toBe(true)
      expect(address.toString()).toBe(
        'eth:0xAbCdABCd12345678abcDabCd12345678ABcdaBcd',
      )
    })

    it('throws on unknown long chain name', () => {
      expect(() =>
        ChainSpecificAddress.fromLong(
          'unknown-chain',
          '0xAbCdABCd12345678abcDabCd12345678ABcdaBcd',
        ),
      ).toThrow(TypeError)
      expect(() =>
        ChainSpecificAddress.fromLong(
          'unknown-chain',
          '0xAbCdABCd12345678abcDabCd12345678ABcdaBcd',
        ),
      ).toThrow('Unknown long chain name: unknown-chain')
    })
  })

  describe(ChainSpecificAddress.chain.name, () => {
    it('eth', () => {
      const address = ChainSpecificAddress.random('eth')
      expect(ChainSpecificAddress.chain(address)).toBe('eth')
    })

    it('arb1', () => {
      const address = ChainSpecificAddress.random('arb1')
      expect(ChainSpecificAddress.chain(address)).toBe('arb1')
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
