import { EthereumAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'

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

    it('handles a single flattened file', () => {
      const address = EthereumAddress.random()
      const source =
        'one\ntwo\n// File: Foo.sol\nfoo1\nfoo2\n// File: Bar.sol\nbar1\nbar2'
      const result = processSources(address, {
        name: 'Test',
        source: source,
        isVerified: true,
      })

      expect(result).toEqual({
        'Foo.sol': `one\ntwo\nfoo1\nfoo2`,
        'Bar.sol': `one\ntwo\nbar1\nbar2`,
        'flattened.sol': source,
        'meta.txt': createMetaTxt(address, 'Test', true),
      })
    })

    it('handles a single flattened file with nested folders', () => {
      const address = EthereumAddress.random()
      const source =
        'one\ntwo\n// File: a/b/Foo.sol\nfoo1\nfoo2\n// File: a/c/d/Bar.sol\nbar1\nbar2'
      const result = processSources(address, {
        name: 'Test',
        source: source,
        isVerified: true,
      })

      expect(result).toEqual({
        'b/Foo.sol': `one\ntwo\nfoo1\nfoo2`,
        'c/d/Bar.sol': `one\ntwo\nbar1\nbar2`,
        'flattened.sol': source,
        'meta.txt': createMetaTxt(address, 'Test', true),
      })
    })

    it('handles a single file with handles malicious and networked paths', () => {
      const address = EthereumAddress.random()
      const source =
        '// File: ../../etc/passwd\nadmin: admin\n' +
        '// File: https://example.com/foo/Foo.sol\nfoo\n' +
        '// File: http://example.com/bar/Bar.sol\nbar'

      const result = processSources(address, {
        name: 'Test',
        source: source,
        isVerified: true,
      })

      expect(result).toEqual({
        'etc/passwd': `admin: admin`,
        'example.com/foo/Foo.sol': `foo`,
        'example.com/bar/Bar.sol': `bar`,
        'flattened.sol': source,
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

    it('handles nested paths', () => {
      const address = EthereumAddress.random()
      const result = processSources(address, {
        name: 'Test',
        source: JSON.stringify({
          'a/b/Foo.sol': { content: 'foo' },
          'a/c/d/Bar.sol': { content: 'bar' },
        }),
        isVerified: true,
      })
      expect(result).toEqual({
        'b/Foo.sol': 'foo',
        'c/d/Bar.sol': 'bar',
        'meta.txt': createMetaTxt(address, 'Test', true),
      })
    })

    it('handles malicious and networked paths', () => {
      const address = EthereumAddress.random()
      const result = processSources(address, {
        name: 'Test',
        source: JSON.stringify({
          '../../etc/passwd': { content: 'admin: admin' },
          'https://example.com/foo/Foo.sol': { content: 'foo' },
          'http://example.com/bar/Bar.sol': { content: 'bar' },
        }),
        isVerified: true,
      })
      expect(result).toEqual({
        'etc/passwd': 'admin: admin',
        'example.com/foo/Foo.sol': 'foo',
        'example.com/bar/Bar.sol': 'bar',
        'meta.txt': createMetaTxt(address, 'Test', true),
      })
    })

    it('handles a single flattened file with nested folders', () => {
      const address = EthereumAddress.random()
      const source =
        'one\ntwo\n// File: a/b/Foo.sol\nfoo1\nfoo2\n// File: a/c/d/Bar.sol\nbar1\nbar2'
      const result = processSources(address, {
        name: 'Test',
        source: JSON.stringify({ 'Test.sol': { content: source } }),
        isVerified: true,
      })

      expect(result).toEqual({
        'b/Foo.sol': `one\ntwo\nfoo1\nfoo2`,
        'c/d/Bar.sol': `one\ntwo\nbar1\nbar2`,
        'flattened.sol': source,
        'meta.txt': createMetaTxt(address, 'Test', true),
      })
    })
  })
})
