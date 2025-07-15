import { expect } from 'earl'

import { ChainSpecificAddress } from './ChainSpecificAddress'
import { EthereumAddress } from './EthereumAddress'

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
