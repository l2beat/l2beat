import { Logger } from '@l2beat/backend-tools'
import { Bytes, ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { IProvider } from '../provider/IProvider'
import { executeHandlers } from './executeHandlers'
import type { Handler, HandlerResult } from './Handler'
import { SimpleMethodHandler } from './system/SimpleMethodHandler'
import { ArrayHandler, getArrayFragment } from './user/ArrayHandler'
import { StorageHandler } from './user/StorageHandler'
import { toFunctionFragment } from './utils/toFunctionFragment'

describe(executeHandlers.name, () => {
  function providerWithStorage(layout: Record<string, number>) {
    return mockObject<IProvider>({
      async getStorage(_, slot) {
        const number = Number(BigInt(slot.toString()))
        const value = layout[number]
        return Bytes.fromHex(value!.toString(16).padStart(64, '0'))
      },
      blockNumber: 123,
      chain: 'foo',
    })
  }

  it('simple case with no dependencies', async () => {
    const provider = providerWithStorage({
      1: 123,
      2: 456,
    })
    const values = await executeHandlers(
      provider,
      [
        new StorageHandler('foo', {
          type: 'storage',
          slot: 1,
          returnType: 'number',
        }),
        new StorageHandler('bar', {
          type: 'storage',
          slot: 2,
          returnType: 'number',
        }),
      ],
      ChainSpecificAddress.random(),
    )
    expect<unknown[]>(values).toEqual([
      { field: 'foo', value: 123, ignoreRelative: undefined },
      { field: 'bar', value: 456, ignoreRelative: undefined },
    ])
  })

  it('one level singular dependencies', async () => {
    const provider = providerWithStorage({
      1: 123,
      2: 456,
      123: 1001,
      456: 1002,
    })
    const values = await executeHandlers(
      provider,
      [
        new StorageHandler('xxx', {
          type: 'storage',
          slot: '{{ foo }}',
          returnType: 'number',
        }),
        new StorageHandler('yyy', {
          type: 'storage',
          slot: '{{ bar }}',
          returnType: 'number',
        }),
        new StorageHandler('foo', {
          type: 'storage',
          slot: 1,
          returnType: 'number',
        }),
        new StorageHandler('bar', {
          type: 'storage',
          slot: 2,
          returnType: 'number',
        }),
      ],
      ChainSpecificAddress.random(),
    )
    expect<unknown[]>(values).toEqual([
      { field: 'foo', value: 123, ignoreRelative: undefined },
      { field: 'bar', value: 456, ignoreRelative: undefined },
      { field: 'xxx', value: 1001, ignoreRelative: undefined },
      { field: 'yyy', value: 1002, ignoreRelative: undefined },
    ])
  })

  it('multi level multiple dependencies', async () => {
    const provider = providerWithStorage({
      1: 100,
      2: 200,
      300: 30000,
      400: 40000,
      30100: 3010000,
      3050000: 305000000,
    })
    const values = await executeHandlers(
      provider,
      [
        new StorageHandler('aab', {
          type: 'storage',
          slot: '{{ a }}',
          offset: '{{ ab }}',
          returnType: 'number',
        }),
        new StorageHandler('ab', {
          type: 'storage',
          slot: '{{ a }}',
          offset: '{{ b }}',
          returnType: 'number',
        }),
        new StorageHandler('bb', {
          type: 'storage',
          slot: '{{ b }}',
          offset: '{{ b }}',
          returnType: 'number',
        }),
        new StorageHandler('a', {
          type: 'storage',
          slot: 1,
          returnType: 'number',
        }),
        new StorageHandler('aabbb', {
          type: 'storage',
          slot: '{{ aab }}',
          offset: '{{ bb }}',
          returnType: 'number',
        }),
        new StorageHandler('b', {
          type: 'storage',
          slot: 2,
          returnType: 'number',
        }),
      ],
      ChainSpecificAddress.random(),
    )
    expect<unknown[]>(values).toEqual([
      { field: 'a', value: 100, ignoreRelative: undefined },
      { field: 'b', value: 200, ignoreRelative: undefined },
      { field: 'ab', value: 30000, ignoreRelative: undefined },
      { field: 'bb', value: 40000, ignoreRelative: undefined },
      { field: 'aab', value: 3010000, ignoreRelative: undefined },
      { field: 'aabbb', value: 305000000, ignoreRelative: undefined },
    ])
  })

  it('unresolvable self', async () => {
    const provider = mockObject<IProvider>()
    const promise = executeHandlers(
      provider,
      [new StorageHandler('a', { type: 'storage', slot: '{{ a }}' })],
      ChainSpecificAddress.random(),
    )
    await expect(promise).toBeRejectedWith('Impossible to resolve dependencies')
  })

  it('unresolvable unknown', async () => {
    const provider = mockObject<IProvider>()
    const promise = executeHandlers(
      provider,
      [new StorageHandler('a', { type: 'storage', slot: '{{ foo }}' })],
      ChainSpecificAddress.random(),
    )
    await expect(promise).toBeRejectedWith('Impossible to resolve dependencies')
  })

  it('unresolvable cycle', async () => {
    const provider = mockObject<IProvider>()
    const promise = executeHandlers(
      provider,
      [
        new StorageHandler('a', { type: 'storage', slot: '{{ b }}' }),
        new StorageHandler('b', { type: 'storage', slot: '{{ a }}' }),
      ],
      ChainSpecificAddress.random(),
    )
    await expect(promise).toBeRejectedWith('Impossible to resolve dependencies')
  })

  it('handles handlers with errors', async () => {
    class FunkyHandler implements Handler {
      dependencies: string[] = []
      field = 'foo'
      logger = Logger.SILENT
      async execute(): Promise<HandlerResult> {
        throw new Error('oops')
      }
    }

    const provider = mockObject<IProvider>()
    const values = await executeHandlers(
      provider,
      [new FunkyHandler()],
      ChainSpecificAddress.random(),
    )
    expect<unknown[]>(values).toEqual([{ field: 'foo', error: 'oops' }])
  })

  it('handles multicallable handlers', async () => {
    const ADDRESS = ChainSpecificAddress.random()
    const method = 'function foo() external view returns (uint256)'
    const fragment = toFunctionFragment(method)
    const provider = mockObject<IProvider>({
      getStorage: mockFn().returnsOnce(123),
      callMethod: mockFn().returns(0x12345678),
      blockNumber: 123,
      chain: 'foo',
    })
    const values = await executeHandlers(
      provider,
      [
        new StorageHandler('a', {
          type: 'storage',
          slot: 1,
          returnType: 'number',
        }),
        new SimpleMethodHandler(method),
      ],
      ADDRESS,
    )

    expect(values).toEqualUnsorted([
      { field: 'foo', fragment, value: 0x12345678 },
      { field: 'a', value: 123, ignoreRelative: undefined },
    ])
  })

  it('handles multicallable handlers with dependencies', async () => {
    const ADDRESS = ChainSpecificAddress.random()
    const method = 'function foo() external view returns (uint256)'
    const fragment = toFunctionFragment(method)
    const provider = mockObject<IProvider>({
      callMethod: mockFn().returnsOnce(3).returns(0x12345678),
      blockNumber: 123,
      chain: 'foo',
    })
    const arrayMethod = 'function bar(uint256) external view returns (uint256)'
    const arrayFragment = getArrayFragment(toFunctionFragment(arrayMethod))
    const values = await executeHandlers(
      provider,
      [
        new ArrayHandler(
          'bar',
          {
            type: 'array',
            method: 'bar',
            length: '{{ foo }}',
          },
          [arrayMethod],
        ),
        new SimpleMethodHandler(method),
      ],
      ADDRESS,
    )

    expect(values).toEqual([
      { field: 'foo', fragment, value: 3 },
      {
        field: 'bar',
        fragment: arrayFragment,
        value: [0x12345678, 0x12345678, 0x12345678],
        ignoreRelative: undefined,
      },
    ])
  })
})
