import { describe, expect, it } from 'vitest'

import type { StructureContractConfig } from '../config/structureUtils'
import { getHandlers } from './getHandlers'
import { ErrorHandler } from './system/ErrorHandler'
import { LimitedArrayHandler } from './system/LimitedArrayHandler'
import { SimpleMethodHandler } from './system/SimpleMethodHandler'
import { StorageHandler } from './user/StorageHandler'

describe(getHandlers.name, () => {
  const mockConfig = {
    fields: {},
    ignoreMethods: [],
  } as unknown as StructureContractConfig

  it('returns empty handlers', () => {
    const handlers = getHandlers([], mockConfig)
    expect(handlers).toStrictEqual([])
  })

  it('returns system handlers', () => {
    const handlers = getHandlers(
      [
        'function foo() view returns (uint256)',
        'function bar() view returns (address)',
        'function baz(uint256 i) view returns (address)',
      ],
      mockConfig,
    )
    expect(handlers).toStrictEqual([
      new SimpleMethodHandler('function bar() view returns (address)'),
      new LimitedArrayHandler(
        'function baz(uint256 i) view returns (address)',
        5,
      ),
      new SimpleMethodHandler('function foo() view returns (uint256)'),
    ])
  })

  it('prefers simple handlers over array handlers (simple first)', () => {
    const handlers = getHandlers(
      [
        'function bar() view returns (address)',
        'function bar(uint256 i) view returns (address)',
      ],
      mockConfig,
    )
    expect(handlers).toStrictEqual([
      new SimpleMethodHandler('function bar() view returns (address)'),
    ])
  })

  it('prefers simple handlers over array handlers (array first)', () => {
    const handlers = getHandlers(
      [
        'function bar(uint256 i) view returns (address)',
        'function bar() view returns (address)',
      ],
      mockConfig,
    )
    expect(handlers).toStrictEqual([
      new SimpleMethodHandler('function bar() view returns (address)'),
    ])
  })

  it('ignores complex view methods', () => {
    const handlers = getHandlers(
      ['function complex(uint256 a, uint256 b) view returns (address)'],
      mockConfig,
    )
    expect(handlers).toStrictEqual([])
  })

  it("ignores methods that don't return anything", () => {
    const handlers = getHandlers(
      [
        'function requireUnresolved(uint256 nodeNum) view',
        'function requireUnresolvedExists() view',
      ],
      mockConfig,
    )
    expect(handlers).toStrictEqual([])
  })

  it('ignores write methods', () => {
    const handlers = getHandlers(['function write()'], mockConfig)
    expect(handlers).toStrictEqual([])
  })

  it('ignores methods added to ignore list', () => {
    const config = {
      ...mockConfig,
      ignoreMethods: ['foo', 'baz', 'flip'],
    } as unknown as StructureContractConfig

    const handlers = getHandlers(
      [
        'function foo() view returns (uint256)',
        'function bar() view returns (address)',
        'function baz() view returns (bytes32)',
        'function flip(uint256 i) view returns (address)',
        'function flop(uint256 i) view returns (uint256)',
      ],
      config,
    )
    expect(handlers).toStrictEqual([
      new SimpleMethodHandler('function bar() view returns (address)'),
      new LimitedArrayHandler(
        'function flop(uint256 i) view returns (uint256)',
        5,
      ),
    ])
  })

  it('returns user handlers', () => {
    const config = {
      ...mockConfig,
      fields: {
        foo: { handler: { type: 'storage', slot: 1 } },
        bar: { handler: { type: 'storage', slot: 2 } },
      },
    } as unknown as StructureContractConfig

    const handlers = getHandlers([], config)
    expect(handlers).toStrictEqual([
      new StorageHandler('bar', { type: 'storage', slot: 2 }),
      new StorageHandler('foo', { type: 'storage', slot: 1 }),
    ])
  })

  it('prefers user handlers', () => {
    const config = {
      ...mockConfig,
      fields: {
        foo: { handler: { type: 'storage', slot: 1 } },
        bar: { handler: { type: 'storage', slot: 2 } },
      },
    } as unknown as StructureContractConfig

    const handlers = getHandlers(
      [
        'function foo() view returns (address)',
        'function baz() view returns (address)',
      ],
      config,
    )
    expect(handlers).toStrictEqual([
      new StorageHandler('bar', { type: 'storage', slot: 2 }),
      new SimpleMethodHandler('function baz() view returns (address)'),
      new StorageHandler('foo', { type: 'storage', slot: 1 }),
    ])
  })

  it('handles constructor errors', () => {
    const config = {
      ...mockConfig,
      fields: {
        foo: {
          handler: {
            type: 'call',
            args: [],
          },
        },
      },
    } as unknown as StructureContractConfig

    const handlers = getHandlers([], config)
    expect(handlers).toStrictEqual([
      new ErrorHandler('foo', 'Cannot find a matching method for foo'),
    ])
  })
})
