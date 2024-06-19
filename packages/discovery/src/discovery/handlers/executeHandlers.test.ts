import { Bytes, EthereumAddress } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'

import { DiscoveryLogger } from '../DiscoveryLogger'
import { IProvider } from '../provider/IProvider'
import { Handler, HandlerResult } from './Handler'
import { executeHandlers } from './executeHandlers'
import { SimpleMethodHandler } from './system/SimpleMethodHandler'
import { ArrayHandler } from './user/ArrayHandler'
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
        new StorageHandler(
          'foo',
          { type: 'storage', slot: 1, returnType: 'number' },
          DiscoveryLogger.SILENT,
        ),
        new StorageHandler(
          'bar',
          { type: 'storage', slot: 2, returnType: 'number' },
          DiscoveryLogger.SILENT,
        ),
      ],
      EthereumAddress.random(),
      DiscoveryLogger.SILENT,
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
        new StorageHandler(
          'xxx',
          { type: 'storage', slot: '{{ foo }}', returnType: 'number' },
          DiscoveryLogger.SILENT,
        ),
        new StorageHandler(
          'yyy',
          { type: 'storage', slot: '{{ bar }}', returnType: 'number' },
          DiscoveryLogger.SILENT,
        ),
        new StorageHandler(
          'foo',
          { type: 'storage', slot: 1, returnType: 'number' },
          DiscoveryLogger.SILENT,
        ),
        new StorageHandler(
          'bar',
          { type: 'storage', slot: 2, returnType: 'number' },
          DiscoveryLogger.SILENT,
        ),
      ],
      EthereumAddress.random(),
      DiscoveryLogger.SILENT,
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
        new StorageHandler(
          'aab',
          {
            type: 'storage',
            slot: '{{ a }}',
            offset: '{{ ab }}',
            returnType: 'number',
          },
          DiscoveryLogger.SILENT,
        ),
        new StorageHandler(
          'ab',
          {
            type: 'storage',
            slot: '{{ a }}',
            offset: '{{ b }}',
            returnType: 'number',
          },
          DiscoveryLogger.SILENT,
        ),
        new StorageHandler(
          'bb',
          {
            type: 'storage',
            slot: '{{ b }}',
            offset: '{{ b }}',
            returnType: 'number',
          },
          DiscoveryLogger.SILENT,
        ),
        new StorageHandler(
          'a',
          { type: 'storage', slot: 1, returnType: 'number' },
          DiscoveryLogger.SILENT,
        ),
        new StorageHandler(
          'aabbb',
          {
            type: 'storage',
            slot: '{{ aab }}',
            offset: '{{ bb }}',
            returnType: 'number',
          },
          DiscoveryLogger.SILENT,
        ),
        new StorageHandler(
          'b',
          { type: 'storage', slot: 2, returnType: 'number' },
          DiscoveryLogger.SILENT,
        ),
      ],
      EthereumAddress.random(),
      DiscoveryLogger.SILENT,
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
      [
        new StorageHandler(
          'a',
          { type: 'storage', slot: '{{ a }}' },
          DiscoveryLogger.SILENT,
        ),
      ],
      EthereumAddress.random(),
      DiscoveryLogger.SILENT,
    )
    await expect(promise).toBeRejectedWith('Impossible to resolve dependencies')
  })

  it('unresolvable unknown', async () => {
    const provider = mockObject<IProvider>()
    const promise = executeHandlers(
      provider,
      [
        new StorageHandler(
          'a',
          { type: 'storage', slot: '{{ foo }}' },
          DiscoveryLogger.SILENT,
        ),
      ],
      EthereumAddress.random(),
      DiscoveryLogger.SILENT,
    )
    await expect(promise).toBeRejectedWith('Impossible to resolve dependencies')
  })

  it('unresolvable cycle', async () => {
    const provider = mockObject<IProvider>()
    const promise = executeHandlers(
      provider,
      [
        new StorageHandler(
          'a',
          { type: 'storage', slot: '{{ b }}' },
          DiscoveryLogger.SILENT,
        ),
        new StorageHandler(
          'b',
          { type: 'storage', slot: '{{ a }}' },
          DiscoveryLogger.SILENT,
        ),
      ],
      EthereumAddress.random(),
      DiscoveryLogger.SILENT,
    )
    await expect(promise).toBeRejectedWith('Impossible to resolve dependencies')
  })

  it('handles handlers with errors', async () => {
    class FunkyHandler implements Handler {
      dependencies: string[] = []
      field = 'foo'
      logger = DiscoveryLogger.SILENT
      async execute(): Promise<HandlerResult> {
        throw new Error('oops')
      }
    }

    const provider = mockObject<IProvider>()
    const values = await executeHandlers(
      provider,
      [new FunkyHandler()],
      EthereumAddress.random(),
      DiscoveryLogger.SILENT,
    )
    expect<unknown[]>(values).toEqual([{ field: 'foo', error: 'oops' }])
  })

  it('handles multicallable handlers', async () => {
    const ADDRESS = EthereumAddress.random()
    const method = 'function foo() external view returns (uint256)'
    const fragment = toFunctionFragment(method)
    const provider = mockObject<IProvider>({
      getStorage: mockFn().returnsOnce(123),
      callMethod: mockFn().returns(0x12345678),
    })
    const values = await executeHandlers(
      provider,
      [
        new StorageHandler(
          'a',
          { type: 'storage', slot: 1, returnType: 'number' },
          DiscoveryLogger.SILENT,
        ),
        new SimpleMethodHandler(method, DiscoveryLogger.SILENT),
      ],
      ADDRESS,
      DiscoveryLogger.SILENT,
    )

    expect(values).toEqualUnsorted([
      { field: 'foo', fragment, value: 0x12345678 },
      { field: 'a', value: 123, ignoreRelative: undefined },
    ])
  })

  it('handles multicallable handlers with dependencies', async () => {
    const ADDRESS = EthereumAddress.random()
    const method = 'function foo() external view returns (uint256)'
    const fragment = toFunctionFragment(method)
    const provider = mockObject<IProvider>({
      callMethod: mockFn().returnsOnce(3).returns(0x12345678),
    })
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
          ['function bar(uint256) external view returns (uint256)'],
          DiscoveryLogger.SILENT,
        ),
        new SimpleMethodHandler(method, DiscoveryLogger.SILENT),
      ],
      ADDRESS,
      DiscoveryLogger.SILENT,
    )

    expect(values).toEqual([
      { field: 'foo', fragment, value: 3 },
      {
        field: 'bar',
        value: [0x12345678, 0x12345678, 0x12345678],
        ignoreRelative: undefined,
      },
    ])
  })
})
