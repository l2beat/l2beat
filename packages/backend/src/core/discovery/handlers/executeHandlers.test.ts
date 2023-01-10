import { mock } from '@l2beat/common'
import { Bytes, EthereumAddress } from '@l2beat/types'
import { expect } from 'earljs'

import { DiscoveryLogger } from '../DiscoveryLogger'
import { DiscoveryProvider } from '../provider/DiscoveryProvider'
import { executeHandlers } from './executeHandlers'
import { Handler, HandlerResult } from './Handler'
import { StorageHandler } from './user/StorageHandler'

describe(executeHandlers.name, () => {
  function providerWithStorage(layout: Record<string, number>) {
    return mock<DiscoveryProvider>({
      async getStorage(address, slot) {
        const number = Number(BigInt(slot.toString()))
        const value = layout[number]
        return Bytes.fromHex(value.toString(16).padStart(64, '0'))
      },
    })
  }

  it('simple case with no dependencies', async () => {
    const provider = providerWithStorage({
      1: 123,
      2: 456,
    })
    const values = await executeHandlers(provider, EthereumAddress.random(), [
      new StorageHandler(
        'foo',
        {
          type: 'storage',
          slot: 1,
          returnType: 'number',
        },
        DiscoveryLogger.SILENT,
      ),
      new StorageHandler(
        'bar',
        {
          type: 'storage',
          slot: 2,
          returnType: 'number',
        },
        DiscoveryLogger.SILENT,
      ),
    ])
    expect<unknown[]>(values).toEqual([
      { field: 'foo', value: 123 },
      { field: 'bar', value: 456 },
    ])
  })

  it('one level singular dependencies', async () => {
    const provider = providerWithStorage({
      1: 123,
      2: 456,
      123: 1001,
      456: 1002,
    })
    const values = await executeHandlers(provider, EthereumAddress.random(), [
      new StorageHandler(
        'xxx',
        {
          type: 'storage',
          slot: '{{ foo }}',
          returnType: 'number',
        },
        DiscoveryLogger.SILENT,
      ),
      new StorageHandler(
        'yyy',
        {
          type: 'storage',
          slot: '{{ bar }}',
          returnType: 'number',
        },
        DiscoveryLogger.SILENT,
      ),
      new StorageHandler(
        'foo',
        {
          type: 'storage',
          slot: 1,
          returnType: 'number',
        },
        DiscoveryLogger.SILENT,
      ),
      new StorageHandler(
        'bar',
        {
          type: 'storage',
          slot: 2,
          returnType: 'number',
        },
        DiscoveryLogger.SILENT,
      ),
    ])
    expect<unknown[]>(values).toEqual([
      { field: 'foo', value: 123 },
      { field: 'bar', value: 456 },
      { field: 'xxx', value: 1001 },
      { field: 'yyy', value: 1002 },
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
    const values = await executeHandlers(provider, EthereumAddress.random(), [
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
        {
          type: 'storage',
          slot: 1,
          returnType: 'number',
        },
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
        {
          type: 'storage',
          slot: 2,
          returnType: 'number',
        },
        DiscoveryLogger.SILENT,
      ),
    ])
    expect<unknown[]>(values).toEqual([
      { field: 'a', value: 100 },
      { field: 'b', value: 200 },
      { field: 'ab', value: 30000 },
      { field: 'bb', value: 40000 },
      { field: 'aab', value: 3010000 },
      { field: 'aabbb', value: 305000000 },
    ])
  })

  it('unresolvable self', async () => {
    const provider = mock<DiscoveryProvider>()
    const promise = executeHandlers(provider, EthereumAddress.random(), [
      new StorageHandler(
        'a',
        { type: 'storage', slot: '{{ a }}' },
        DiscoveryLogger.SILENT,
      ),
    ])
    await expect(promise).toBeRejected('Impossible to resolve dependencies')
  })

  it('unresolvable unknown', async () => {
    const provider = mock<DiscoveryProvider>()
    const promise = executeHandlers(provider, EthereumAddress.random(), [
      new StorageHandler(
        'a',
        { type: 'storage', slot: '{{ foo }}' },
        DiscoveryLogger.SILENT,
      ),
    ])
    await expect(promise).toBeRejected('Impossible to resolve dependencies')
  })

  it('unresolvable cycle', async () => {
    const provider = mock<DiscoveryProvider>()
    const promise = executeHandlers(provider, EthereumAddress.random(), [
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
    ])
    await expect(promise).toBeRejected('Impossible to resolve dependencies')
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

    const provider = mock<DiscoveryProvider>()
    const values = await executeHandlers(provider, EthereumAddress.random(), [
      new FunkyHandler(),
    ])
    expect<unknown[]>(values).toEqual([{ field: 'foo', error: 'oops' }])
  })
})
