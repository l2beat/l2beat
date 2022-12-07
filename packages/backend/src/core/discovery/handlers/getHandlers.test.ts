import { expect } from 'earljs'

import { getHandlers } from './getHandlers'
import { LimitedArrayHandler } from './system/LimitedArrayHandler'
import { SimpleMethodHandler } from './system/SimpleMethodHandler'
import { StorageHandler } from './user/StorageHandler'

describe(getHandlers.name, () => {
  it('returns empty handlers', () => {
    const handlers = getHandlers([], undefined)
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
    )
    expect(handlers).toEqual([
      new SimpleMethodHandler('function bar() view returns (address)'),
      new LimitedArrayHandler('function baz(uint256 i) view returns (address)'),
      new SimpleMethodHandler('function foo() view returns (uint256)'),
    ])
  })

  it('prefers simple handlers over array handlers (simple first)', () => {
    const handlers = getHandlers(
      [
        'function bar() view returns (address)',
        'function bar(uint256 i) view returns (address)',
      ],
      undefined,
    )
    expect(handlers).toEqual([
      new SimpleMethodHandler('function bar() view returns (address)'),
    ])
  })

  it('prefers simple handlers over array handlers (array first)', () => {
    const handlers = getHandlers(
      [
        'function bar(uint256 i) view returns (address)',
        'function bar() view returns (address)',
      ],
      undefined,
    )
    expect(handlers).toEqual([
      new SimpleMethodHandler('function bar() view returns (address)'),
    ])
  })

  it('ignores complex view methods', () => {
    const handlers = getHandlers(
      ['function complex(uint256 a, uint256 b) view returns (address)'],
      undefined,
    )
    expect(handlers).toEqual([])
  })

  it('ignores write methods', () => {
    const handlers = getHandlers(['function write()'], undefined)
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
        ignoreMethods: ['foo', 'baz', 'flip'],
      },
    )
    expect(handlers).toEqual([
      new SimpleMethodHandler('function bar() view returns (address)'),
      new LimitedArrayHandler(
        'function flop(uint256 i) view returns (uint256)',
      ),
    ])
  })

  it('returns user handlers', () => {
    const handlers = getHandlers([], {
      fields: {
        foo: { type: 'storage', slot: 1 },
        bar: { type: 'storage', slot: 2 },
      },
    })
    expect(handlers).toEqual([
      new StorageHandler('bar', { type: 'storage', slot: 2 }),
      new StorageHandler('foo', { type: 'storage', slot: 1 }),
    ])
  })

  it('prefers user handlers', () => {
    const handlers = getHandlers(
      [
        'function foo() view returns (address)',
        'function baz() view returns (address)',
      ],
      {
        fields: {
          foo: { type: 'storage', slot: 1 },
          bar: { type: 'storage', slot: 2 },
        },
      },
    )
    expect(handlers).toEqual([
      new StorageHandler('bar', { type: 'storage', slot: 2 }),
      new SimpleMethodHandler('function baz() view returns (address)'),
      new StorageHandler('foo', { type: 'storage', slot: 1 }),
    ])
  })
})
