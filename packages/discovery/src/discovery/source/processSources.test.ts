import { expect } from 'earl'

import { EthereumAddress } from '../../utils/EthereumAddress'
import { createMetaTxt, processSources } from './processSources'

describe(processSources.name, () => {
  describe('unverified', () => {
    it('returns a simple meta.txt for unverified contracts', () => {
      const address = EthereumAddress.random()
      const result = processSources(address, {
        name: 'Test',
        source: 'test',
        isVerified: false,
      })

      expect(result).toEqual({
        'meta.txt': createMetaTxt(address, 'Test', false),
      })
    })
  })

  describe('single file', () => {
    it('handles a single non-flattened file', () => {
      const address = EthereumAddress.random()
      const result = processSources(address, {
        name: 'Test',
        source: 'test',
        isVerified: true,
      })

      expect(result).toEqual({
        'Test.sol': 'test',
        'meta.txt': createMetaTxt(address, 'Test', true),
      })
    })
  })

  describe('multiple files', () => {
    it('handles direct sources', () => {
      const address = EthereumAddress.random()
      const result = processSources(address, {
        name: 'Test',
        source: JSON.stringify({
          'Foo.sol': { content: 'foo' },
          'Bar.sol': { content: 'bar' },
        }),
        isVerified: true,
      })
      expect(result).toEqual({
        'Foo.sol': 'foo',
        'Bar.sol': 'bar',
        'meta.txt': createMetaTxt(address, 'Test', true),
      })
    })

    it('handles direct sources with extra {}', () => {
      const address = EthereumAddress.random()
      const source = JSON.stringify({
        'Foo.sol': { content: 'foo' },
        'Bar.sol': { content: 'bar' },
      })
      const result = processSources(address, {
        name: 'Test',
        source: `{${source}}`,
        isVerified: true,
      })
      expect(result).toEqual({
        'Foo.sol': 'foo',
        'Bar.sol': 'bar',
        'meta.txt': createMetaTxt(address, 'Test', true),
      })
    })

    it('handles nested sources', () => {
      const address = EthereumAddress.random()
      const result = processSources(address, {
        name: 'Test',
        source: JSON.stringify({
          settings: {},
          sources: {
            'Foo.sol': { content: 'foo' },
            'Bar.sol': { content: 'bar' },
          },
          other: 'stuff',
        }),
        isVerified: true,
      })
      expect(result).toEqual({
        'Foo.sol': 'foo',
        'Bar.sol': 'bar',
        'meta.txt': createMetaTxt(address, 'Test', true),
      })
    })

    it('handles nested sources with extra {}', () => {
      const address = EthereumAddress.random()
      const source = JSON.stringify({
        settings: {},
        sources: {
          'Foo.sol': { content: 'foo' },
          'Bar.sol': { content: 'bar' },
        },
        other: 'stuff',
      })
      const result = processSources(address, {
        name: 'Test',
        source: `{${source}}`,
        isVerified: true,
      })
      expect(result).toEqual({
        'Foo.sol': 'foo',
        'Bar.sol': 'bar',
        'meta.txt': createMetaTxt(address, 'Test', true),
      })
    })
  })
})
