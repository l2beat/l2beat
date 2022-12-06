import { mock } from '@l2beat/common'
import { Bytes, EthereumAddress } from '@l2beat/types'
import { expect } from 'earljs'

import { DiscoveryProvider } from '../../provider/DiscoveryProvider'
import { StorageHandler } from './StorageHandler'

describe(StorageHandler.name, () => {
  describe('return types', () => {
    it('can returns storage as bytes', async () => {
      const address = EthereumAddress.random()
      const provider = mock<DiscoveryProvider>({
        async getStorage(passedAddress, slot) {
          expect(passedAddress).toEqual(address)
          expect(slot).toEqual(1n)
          return Bytes.fromHex(
            '0x0000000000000000000000000000000000000000000000000000000000000123',
          )
        },
      })

      const handler = new StorageHandler('someName', {
        type: 'storage',
        slot: 1,
      })
      expect(handler.field).toEqual('someName')

      const result = await handler.execute(provider, address, {})
      expect(result as unknown).toEqual({
        field: 'someName',
        value:
          '0x0000000000000000000000000000000000000000000000000000000000000123',
      })
    })

    it('can returns storage as number', async () => {
      const address = EthereumAddress.random()
      const provider = mock<DiscoveryProvider>({
        async getStorage() {
          return Bytes.fromHex(
            '0x0000000000000000000000000000000000000000000000000000000000000123',
          )
        },
      })

      const handler = new StorageHandler('someName', {
        type: 'storage',
        slot: 1,
        returnType: 'number',
      })
      expect(handler.field).toEqual('someName')

      const result = await handler.execute(provider, address, {})
      expect(result as unknown).toEqual({
        field: 'someName',
        value: 0x123,
      })
    })

    it('can returns storage as address', async () => {
      const address = EthereumAddress.random()
      const resultAddress = EthereumAddress.random()

      const provider = mock<DiscoveryProvider>({
        async getStorage() {
          return Bytes.fromHex(
            '0x000000000000000000000000' + resultAddress.slice(2).toLowerCase(),
          )
        },
      })

      const handler = new StorageHandler('someName', {
        type: 'storage',
        slot: 1,
        returnType: 'address',
      })
      expect(handler.field).toEqual('someName')

      const result = await handler.execute(provider, address, {})
      expect(result as unknown).toEqual({
        field: 'someName',
        value: resultAddress,
      })
    })
  })

  describe('dependencies', () => {
    it('detects no dependencies for a simple definition', () => {
      const handler = new StorageHandler('someName', {
        type: 'storage',
        slot: 1,
      })

      expect(handler.dependencies).toEqual([])
    })

    it('detects no dependencies for a complex definition', () => {
      const handler = new StorageHandler('someName', {
        type: 'storage',
        slot: [1, '0x1234'],
        offset: 25,
      })

      expect(handler.dependencies).toEqual([])
    })

    it('detects dependency from the slot field', () => {
      const handler = new StorageHandler('someName', {
        type: 'storage',
        slot: '{{ foo }}',
      })

      expect(handler.dependencies).toEqual(['foo'])
    })

    it('detects dependency from the offset field', () => {
      const handler = new StorageHandler('someName', {
        type: 'storage',
        slot: 1,
        offset: '{{ foo }}',
      })

      expect(handler.dependencies).toEqual(['foo'])
    })

    it('detects dependency from the both fields at the same time', () => {
      const handler = new StorageHandler('someName', {
        type: 'storage',
        slot: '{{ foo }}',
        offset: '{{ bar }}',
      })

      expect(handler.dependencies).toEqual(['bar', 'foo'])
    })

    it('detects from a complex slot field', () => {
      const handler = new StorageHandler('someName', {
        type: 'storage',
        slot: [1, '{{ foo }}', 2, '{{ baz }}'],
        offset: '{{ bar }}',
      })

      expect(handler.dependencies).toEqual(['bar', 'foo', 'baz'])
    })
  })

  it('handles provider errors', async () => {
    const handler = new StorageHandler('someName', {
      type: 'storage',
      slot: 1,
    })

    const provider = mock<DiscoveryProvider>({
      async getStorage() {
        throw new Error('foo bar')
      },
    })
    const address = EthereumAddress.random()
    const result = await handler.execute(provider, address, {})
    expect(result as unknown).toEqual({
      field: 'someName',
      error: 'foo bar',
    })
  })
})
