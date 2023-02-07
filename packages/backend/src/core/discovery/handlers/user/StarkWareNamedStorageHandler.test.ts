import { Bytes, EthereumAddress, mock } from '@l2beat/shared'
import { expect } from 'earljs'
import { utils } from 'ethers'

import { DiscoveryLogger } from '../../DiscoveryLogger'
import { DiscoveryProvider } from '../../provider/DiscoveryProvider'
import { StarkWareNamedStorageHandler } from './StarkWareNamedStorageHandler'

describe(StarkWareNamedStorageHandler.name, () => {
  describe('return types', () => {
    it('can returns storage as bytes', async () => {
      const address = EthereumAddress.random()
      const provider = mock<DiscoveryProvider>({
        async getStorage(passedAddress, slot) {
          expect(passedAddress).toEqual(address)
          expect(slot).toEqual(
            Bytes.fromHex(utils.solidityKeccak256(['string'], ['foo'])),
          )
          return Bytes.fromHex(
            '0x0000000000000000000000000000000000000000000000000000000000000123',
          )
        },
      })

      const handler = new StarkWareNamedStorageHandler(
        'someName',
        {
          type: 'starkWareNamedStorage',
          tag: 'foo',
        },
        DiscoveryLogger.SILENT,
      )
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

      const handler = new StarkWareNamedStorageHandler(
        'someName',
        {
          type: 'starkWareNamedStorage',
          tag: 'foo',
          returnType: 'number',
        },
        DiscoveryLogger.SILENT,
      )
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

      const handler = new StarkWareNamedStorageHandler(
        'someName',
        {
          type: 'starkWareNamedStorage',
          tag: 'foo',
          returnType: 'address',
        },
        DiscoveryLogger.SILENT,
      )
      expect(handler.field).toEqual('someName')

      const result = await handler.execute(provider, address)
      expect(result as unknown).toEqual({
        field: 'someName',
        value: resultAddress,
      })
    })
  })

  it('handles provider errors', async () => {
    const handler = new StarkWareNamedStorageHandler(
      'someName',
      {
        type: 'starkWareNamedStorage',
        tag: 'foo',
      },
      DiscoveryLogger.SILENT,
    )

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
