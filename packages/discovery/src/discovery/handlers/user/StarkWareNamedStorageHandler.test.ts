import { Bytes, ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { utils } from 'ethers'

import type { IProvider } from '../../provider/IProvider'
import { StarkWareNamedStorageHandler } from './StarkWareNamedStorageHandler'

describe(StarkWareNamedStorageHandler.name, () => {
  describe('return types', () => {
    it('can returns storage as bytes', async () => {
      const address = ChainSpecificAddress.random()
      const provider = mockObject<IProvider>({
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

      const handler = new StarkWareNamedStorageHandler('someName', {
        type: 'starkWareNamedStorage',
        tag: 'foo',
      })
      expect(handler.field).toEqual('someName')

      const result = await handler.execute(provider, address)
      expect(result).toEqual({
        field: 'someName',
        value:
          '0x0000000000000000000000000000000000000000000000000000000000000123',
        ignoreRelative: undefined,
      })
    })

    it('can returns storage as number', async () => {
      const address = ChainSpecificAddress.random()
      const provider = mockObject<IProvider>({
        async getStorage() {
          return Bytes.fromHex(
            '0x0000000000000000000000000000000000000000000000000000000000000123',
          )
        },
      })

      const handler = new StarkWareNamedStorageHandler('someName', {
        type: 'starkWareNamedStorage',
        tag: 'foo',
        returnType: 'number',
      })
      expect(handler.field).toEqual('someName')

      const result = await handler.execute(provider, address)
      expect(result).toEqual({
        field: 'someName',
        value: 0x123,
        ignoreRelative: undefined,
      })
    })

    it('can returns storage as address', async () => {
      const address = ChainSpecificAddress.random()
      const resultAddress = ChainSpecificAddress.random()

      const provider = mockObject<IProvider>({
        async getStorage() {
          return Bytes.fromHex(
            '0x000000000000000000000000' +
              ChainSpecificAddress.address(resultAddress)
                .slice(2)
                .toLowerCase(),
          )
        },
      })

      const handler = new StarkWareNamedStorageHandler('someName', {
        type: 'starkWareNamedStorage',
        tag: 'foo',
        returnType: 'address',
      })
      expect(handler.field).toEqual('someName')

      const result = await handler.execute(provider, address)
      expect(result).toEqual({
        field: 'someName',
        value: ChainSpecificAddress.address(resultAddress).toString(),
        ignoreRelative: undefined,
      })
    })
  })

  it('handles provider errors', async () => {
    const handler = new StarkWareNamedStorageHandler('someName', {
      type: 'starkWareNamedStorage',
      tag: 'foo',
    })

    const provider = mockObject<IProvider>({
      async getStorage() {
        throw new Error('foo bar')
      },
    })
    const address = ChainSpecificAddress.random()
    const result = await handler.execute(provider, address)
    expect(result).toEqual({
      field: 'someName',
      error: 'foo bar',
    })
  })

  it('passes ignoreRelative', async () => {
    const handler = new StarkWareNamedStorageHandler('someName', {
      type: 'starkWareNamedStorage',
      tag: 'foo',
      ignoreRelative: true,
    })

    const provider = mockObject<IProvider>({
      async getStorage() {
        return Bytes.fromHex(
          '0x0000000000000000000000000000000000000000000000000000000000000123',
        )
      },
    })

    const address = ChainSpecificAddress.random()
    const result = await handler.execute(provider, address)
    expect(result).toEqual({
      field: 'someName',
      value:
        '0x0000000000000000000000000000000000000000000000000000000000000123',
      ignoreRelative: true,
    })
  })
})
