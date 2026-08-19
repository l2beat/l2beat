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

  describe('felt chains (strk)', () => {
    const PADDED =
      'strk:0x040337b1af3c663e86e333bab5a4b28da8d4652a15a69beee2b677776ffe812a'

    it('accepts a padded 64-hex felt address', () => {
      expect(ChainSpecificAddress(PADDED).toString()).toEqual(PADDED)
    })

    it('normalizes unpadded and uppercase felt addresses', () => {
      const unpadded =
        'strk:0x40337B1AF3C663E86E333BAB5A4B28DA8D4652A15A69BEEE2B677776FFE812A'
      expect(ChainSpecificAddress(unpadded).toString()).toEqual(PADDED)
    })

    it('round-trips through check', () => {
      expect(ChainSpecificAddress.check(PADDED)).toEqual(true)
    })

    it('rejects felts longer than 64 hex chars', () => {
      expect(() => ChainSpecificAddress(`strk:0x${'1'.repeat(65)}`)).toThrow(
        TypeError,
      )
    })

    it('rejects non-hex felt addresses', () => {
      expect(() => ChainSpecificAddress('strk:0xzz')).toThrow(TypeError)
    })

    it('rejects felt-length addresses on evm chains', () => {
      expect(() =>
        ChainSpecificAddress(
          'eth:0x040337b1af3c663e86e333bab5a4b28da8d4652a15a69beee2b677776ffe812a',
        ),
      ).toThrow(TypeError)
    })

    it('supports from with a raw felt', () => {
      expect(
        ChainSpecificAddress.from(
          'strk',
          '0x40337b1af3c663e86e333bab5a4b28da8d4652a15a69beee2b677776ffe812a',
        ).toString(),
      ).toEqual(PADDED)
    })

    it('supports fromLong', () => {
      expect(
        ChainSpecificAddress.fromLong(
          'starknet',
          '0x40337b1af3c663e86e333bab5a4b28da8d4652a15a69beee2b677776ffe812a',
        ).toString(),
      ).toEqual(PADDED)
    })

    it('supports ZERO for starknet', () => {
      expect(ChainSpecificAddress.ZERO('starknet').toString()).toEqual(
        `strk:0x${'0'.repeat(64)}`,
      )
    })

    it('resolves chain and longChain', () => {
      const address = ChainSpecificAddress(PADDED)
      expect(ChainSpecificAddress.chain(address)).toEqual('strk')
      expect(ChainSpecificAddress.longChain(address)).toEqual('starknet')
    })
  })
})
