import { Bytes, ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'

import type { IProvider } from '../../provider/IProvider'
import { DynamicArrayHandler } from './DynamicArrayHandler'

describe(DynamicArrayHandler.name, () => {
  describe('integration', () => {
    it('can return non-empty address array', async () => {
      const address = ChainSpecificAddress.random()
      const provider = mockObject<IProvider>({
        blockNumber: 123,
        chain: 'foo',
        getStorageAsBigint: mockFn().executesOnce((passedAddress, slot) => {
          expect(passedAddress).toEqual(address)
          expect(slot).toEqual(85n)
          return 2n
        }),
        getStorage: mockFn()
          .executesOnce((passedAddress, slot) => {
            expect(passedAddress).toEqual(address)
            expect(slot).toEqual(
              BigInt(
                '0x71beda120aafdd3bb922b360a066d10b7ce81d7ac2ad9874daac46e2282f6b45',
              ),
            )
            return Bytes.fromHex(
              '0x000000000000000000000000aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
            )
          })
          .executesOnce((passedAddress, slot) => {
            expect(passedAddress).toEqual(address)
            expect(slot).toEqual(
              BigInt(
                '0x71beda120aafdd3bb922b360a066d10b7ce81d7ac2ad9874daac46e2282f6b46',
              ),
            )
            return Bytes.fromHex(
              '0x000000000000000000000000bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
            )
          }),
      })

      const handler = new DynamicArrayHandler('someName', {
        type: 'dynamicArray',
        slot: 85,
      })
      expect(handler.field).toEqual('someName')

      const result = await handler.execute(provider, address, {})
      expect(result).toEqual({
        field: 'someName',
        value: [
          '0xaAaAaAaaAaAaAaaAaAAAAAAAAaaaAaAaAaaAaaAa',
          '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
        ],
        ignoreRelative: undefined,
      })
    })

    it('does nothing on empty address array', async () => {
      const address = ChainSpecificAddress.random()
      const provider = mockObject<IProvider>({
        blockNumber: 123,
        chain: 'foo',
        getStorageAsBigint: mockFn().executesOnce((passedAddress, slot) => {
          expect(passedAddress).toEqual(address)
          expect(slot).toEqual(85n)
          return 0n
        }),
      })

      const handler = new DynamicArrayHandler('someName', {
        type: 'dynamicArray',
        slot: 85,
      })
      expect(handler.field).toEqual('someName')

      const result = await handler.execute(provider, address, {})
      expect(result).toEqual({
        field: 'someName',
        value: [],
        ignoreRelative: undefined,
      })
    })
  })

  describe('dependencies', () => {
    it('detects no dependencies for a simple definition', () => {
      const handler = new DynamicArrayHandler('someName', {
        type: 'dynamicArray',
        slot: 85,
      })

      expect(handler.dependencies).toEqual([])
    })

    it('detects dependency from the slot field', () => {
      const handler = new DynamicArrayHandler('someName', {
        type: 'dynamicArray',
        slot: '{{ foo }}',
      })

      expect(handler.dependencies).toEqual(['foo'])
    })
  })

  it('handles provider errors', async () => {
    const handler = new DynamicArrayHandler('someName', {
      type: 'dynamicArray',
      slot: 85,
    })

    const provider = mockObject<IProvider>({
      blockNumber: 123,
      chain: 'foo',
      async getStorageAsBigint() {
        throw new Error('foo bar')
      },
    })
    const address = ChainSpecificAddress.random()
    const result = await handler.execute(provider, address, {})
    expect(result).toEqual({
      field: 'someName',
      error: 'foo bar',
    })
  })
})
