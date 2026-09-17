import { Bytes, ChainSpecificAddress } from '@l2beat/shared-pure'
import { describe, expect, it, vi } from 'vitest'

import type { IProvider } from '../../provider/IProvider'
import { DynamicArrayHandler } from './DynamicArrayHandler'

describe(DynamicArrayHandler.name, () => {
  describe('integration', () => {
    it('can return non-empty address array', async () => {
      const address = ChainSpecificAddress.random()
      const provider = {
        blockNumber: 123,
        chain: 'foo',
        getStorageAsBigint: vi
          .fn()
          .mockImplementationOnce((passedAddress, slot) => {
            expect(passedAddress).toStrictEqual(address)
            expect(slot).toStrictEqual(85n)
            return 2n
          }),
        getStorage: vi
          .fn()
          .mockImplementationOnce((passedAddress, slot) => {
            expect(passedAddress).toStrictEqual(address)
            expect(slot).toStrictEqual(
              BigInt(
                '0x71beda120aafdd3bb922b360a066d10b7ce81d7ac2ad9874daac46e2282f6b45',
              ),
            )
            return Bytes.fromHex(
              '0x000000000000000000000000aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
            )
          })
          .mockImplementationOnce((passedAddress, slot) => {
            expect(passedAddress).toStrictEqual(address)
            expect(slot).toStrictEqual(
              BigInt(
                '0x71beda120aafdd3bb922b360a066d10b7ce81d7ac2ad9874daac46e2282f6b46',
              ),
            )
            return Bytes.fromHex(
              '0x000000000000000000000000bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
            )
          }),
      } as unknown as IProvider

      const handler = new DynamicArrayHandler('someName', {
        type: 'dynamicArray',
        slot: 85,
      })
      expect(handler.field).toStrictEqual('someName')

      const result = await handler.execute(provider, address, {})
      expect(result).toStrictEqual({
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
      const provider = {
        blockNumber: 123,
        chain: 'foo',
        getStorageAsBigint: vi
          .fn()
          .mockImplementationOnce((passedAddress, slot) => {
            expect(passedAddress).toStrictEqual(address)
            expect(slot).toStrictEqual(85n)
            return 0n
          }),
      } as unknown as IProvider

      const handler = new DynamicArrayHandler('someName', {
        type: 'dynamicArray',
        slot: 85,
      })
      expect(handler.field).toStrictEqual('someName')

      const result = await handler.execute(provider, address, {})
      expect(result).toStrictEqual({
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

      expect(handler.dependencies).toStrictEqual([])
    })

    it('detects dependency from the slot field', () => {
      const handler = new DynamicArrayHandler('someName', {
        type: 'dynamicArray',
        slot: '{{ foo }}',
      })

      expect(handler.dependencies).toStrictEqual(['foo'])
    })
  })

  it('handles provider errors', async () => {
    const handler = new DynamicArrayHandler('someName', {
      type: 'dynamicArray',
      slot: 85,
    })

    const provider = {
      blockNumber: 123,
      chain: 'foo',
      getStorageAsBigint: vi.fn(async () => {
        throw new Error('foo bar')
      }),
    } as unknown as IProvider
    const address = ChainSpecificAddress.random()
    const result = await handler.execute(provider, address, {})
    expect(result).toStrictEqual({
      field: 'someName',
      error: 'foo bar',
    })
  })
})
