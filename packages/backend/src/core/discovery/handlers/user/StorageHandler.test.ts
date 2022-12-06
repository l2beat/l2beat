import { mock } from '@l2beat/common'
import { Bytes, EthereumAddress } from '@l2beat/types'
import { expect } from 'earljs'

import { DiscoveryProvider } from '../../provider/DiscoveryProvider'
import { StorageHandler } from './StorageHandler'

describe(StorageHandler.name, () => {
  it('can returns storage as bytes', async () => {
    const address = EthereumAddress.random()
    const provider = mock<DiscoveryProvider>({
      async getStorage(passedAddress, slot) {
        expect(passedAddress).toEqual(address)
        expect(slot).toEqual(1)
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

    const result = await handler.execute(provider, address)
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

    const result = await handler.execute(provider, address)
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

    const result = await handler.execute(provider, address)
    expect(result as unknown).toEqual({
      field: 'someName',
      value: resultAddress,
    })
  })

  it('handles errors', async () => {
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
    const result = await handler.execute(provider, address)
    expect(result as unknown).toEqual({
      field: 'someName',
      error: 'foo bar',
    })
  })
})
