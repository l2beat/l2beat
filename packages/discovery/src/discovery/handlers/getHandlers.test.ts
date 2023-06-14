import { EthereumAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { DiscoveryLogger } from '../DiscoveryLogger'
import { getHandlers } from './getHandlers'
import { ErrorHandler } from './system/ErrorHandler'
import { LimitedArrayHandler } from './system/LimitedArrayHandler'
import { SimpleMethodHandler } from './system/SimpleMethodHandler'
import { StorageHandler } from './user/StorageHandler'

describe(getHandlers.name, () => {
  it('returns empty handlers', () => {
    const handlers = getHandlers([], undefined, DiscoveryLogger.SILENT)
    expect(handlers).toEqual([])
  })

  it('returns system handlers', () => {
    const handlers = getHandlers(
      [
        'function foo() view returns (uint256)',
        'function bar() view returns (address)',
        'function baz(uint256 i) view returns (address)',
      ],
      undefined,
      DiscoveryLogger.SILENT,
    )
    expect(handlers).toEqual([
      new SimpleMethodHandler(
        'function bar() view returns (address)',
        DiscoveryLogger.SILENT,
      ),
      new LimitedArrayHandler(
        'function baz(uint256 i) view returns (address)',
        5,
        DiscoveryLogger.SILENT,
      ),
      new SimpleMethodHandler(
        'function foo() view returns (uint256)',
        DiscoveryLogger.SILENT,
      ),
    ])
  })

  it('prefers simple handlers over array handlers (simple first)', () => {
    const handlers = getHandlers(
      [
        'function bar() view returns (address)',
        'function bar(uint256 i) view returns (address)',
      ],
      undefined,
      DiscoveryLogger.SILENT,
    )
    expect(handlers).toEqual([
      new SimpleMethodHandler(
        'function bar() view returns (address)',
        DiscoveryLogger.SILENT,
      ),
    ])
  })

  it('prefers simple handlers over array handlers (array first)', () => {
    const handlers = getHandlers(
      [
        'function bar(uint256 i) view returns (address)',
        'function bar() view returns (address)',
      ],
      undefined,
      DiscoveryLogger.SILENT,
    )
    expect(handlers).toEqual([
      new SimpleMethodHandler(
        'function bar() view returns (address)',
        DiscoveryLogger.SILENT,
      ),
    ])
  })

  it('ignores complex view methods', () => {
    const handlers = getHandlers(
      ['function complex(uint256 a, uint256 b) view returns (address)'],
      undefined,
      DiscoveryLogger.SILENT,
    )
    expect(handlers).toEqual([])
  })

  it('ignores write methods', () => {
    const handlers = getHandlers(
      ['function write()'],
      undefined,
      DiscoveryLogger.SILENT,
    )
    expect(handlers).toEqual([])
  })

  it('ignores methods added to ignore list', () => {
    const handlers = getHandlers(
      [
        'function foo() view returns (uint256)',
        'function bar() view returns (address)',
        'function baz() view returns (bytes32)',
        'function flip(uint256 i) view returns (address)',
        'function flop(uint256 i) view returns (uint256)',
      ],
      {
        address: EthereumAddress.random(),
        ignoreMethods: ['foo', 'baz', 'flip'],
      },
      DiscoveryLogger.SILENT,
    )
    expect(handlers).toEqual([
      new SimpleMethodHandler(
        'function bar() view returns (address)',
        DiscoveryLogger.SILENT,
      ),
      new LimitedArrayHandler(
        'function flop(uint256 i) view returns (uint256)',
        5,
        DiscoveryLogger.SILENT,
      ),
    ])
  })

  it('returns user handlers', () => {
    const handlers = getHandlers(
      [],
      {
        address: EthereumAddress.random(),
        fields: {
          foo: { type: 'storage', slot: 1 },
          bar: { type: 'storage', slot: 2 },
        },
      },
      DiscoveryLogger.SILENT,
    )
    expect(handlers).toEqual([
      new StorageHandler(
        'bar',
        { type: 'storage', slot: 2 },
        DiscoveryLogger.SILENT,
      ),
      new StorageHandler(
        'foo',
        { type: 'storage', slot: 1 },
        DiscoveryLogger.SILENT,
      ),
    ])
  })

  it('prefers user handlers', () => {
    const handlers = getHandlers(
      [
        'function foo() view returns (address)',
        'function baz() view returns (address)',
      ],
      {
        address: EthereumAddress.random(),
        fields: {
          foo: { type: 'storage', slot: 1 },
          bar: { type: 'storage', slot: 2 },
        },
      },
      DiscoveryLogger.SILENT,
    )
    expect(handlers).toEqual([
      new StorageHandler(
        'bar',
        { type: 'storage', slot: 2 },
        DiscoveryLogger.SILENT,
      ),
      new SimpleMethodHandler(
        'function baz() view returns (address)',
        DiscoveryLogger.SILENT,
      ),
      new StorageHandler(
        'foo',
        { type: 'storage', slot: 1 },
        DiscoveryLogger.SILENT,
      ),
    ])
  })

  it('handles constructor errors', () => {
    const handlers = getHandlers(
      [],
      {
        address: EthereumAddress.random(),
        fields: {
          foo: { type: 'call', args: [] },
        },
      },
      DiscoveryLogger.SILENT,
    )
    expect(handlers).toEqual([
      new ErrorHandler('foo', 'Cannot find a matching method for foo'),
    ])
  })
})
