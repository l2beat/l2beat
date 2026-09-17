import { Bytes, ChainSpecificAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import { describe, expect, it, vi } from 'vitest'
import type { IProvider } from '../../provider/IProvider'
import type { HandlerResult } from '../Handler'
import { StorageHandler, type StorageHandlerDefinition } from './StorageHandler'

describe(StorageHandler.name, () => {
  describe('return types', () => {
    it('can returns storage as bytes', async () => {
      const address = ChainSpecificAddress.random()
      const provider = {
        getStorage: vi.fn(async (passedAddress, slot) => {
          expect(passedAddress).toStrictEqual(address)
          expect(slot).toStrictEqual(1n)
          return Bytes.fromHex(
            '0x0000000000000000000000000000000000000000000000000000000000000123',
          )
        }),
        blockNumber: 123,
        chain: 'foo',
      } as unknown as IProvider

      const handler = new StorageHandler('someName', {
        type: 'storage',
        slot: 1,
      })
      expect(handler.field).toStrictEqual('someName')

      const result = await handler.execute(provider, address, {})
      expect(result).toStrictEqual({
        field: 'someName',
        value:
          '0x0000000000000000000000000000000000000000000000000000000000000123',
        ignoreRelative: undefined,
      })
    })

    it('can returns storage as number', async () => {
      const address = ChainSpecificAddress.random()
      const provider = {
        getStorage: vi.fn(async () => {
          return Bytes.fromHex(
            '0x0000000000000000000000000000000000000000000000000000000000000123',
          )
        }),
        blockNumber: 123,
        chain: 'foo',
      } as unknown as IProvider

      const handler = new StorageHandler('someName', {
        type: 'storage',
        slot: 1,
        returnType: 'number',
      })
      expect(handler.field).toStrictEqual('someName')

      const result = await handler.execute(provider, address, {})
      expect(result).toStrictEqual({
        field: 'someName',
        value: 0x123,
        ignoreRelative: undefined,
      })
    })

    it('can returns storage as address', async () => {
      const address = ChainSpecificAddress.random()
      const resultAddress = ChainSpecificAddress.random()

      const provider = {
        getStorage: vi.fn(async () => {
          return Bytes.fromHex(
            '0x000000000000000000000000' +
              ChainSpecificAddress.address(resultAddress)
                .slice(2)
                .toLowerCase(),
          )
        }),
        blockNumber: 123,
        chain: 'foo',
      } as unknown as IProvider

      const handler = new StorageHandler('someName', {
        type: 'storage',
        slot: 1,
        returnType: 'address',
      })
      expect(handler.field).toStrictEqual('someName')

      const result = await handler.execute(provider, address, {})
      expect(result).toStrictEqual({
        field: 'someName',
        value: ChainSpecificAddress.address(resultAddress).toString(),
        ignoreRelative: undefined,
      })
    })

    it('can returns storage as uint8', async () => {
      const address = ChainSpecificAddress.random()
      const provider = {
        getStorage: vi.fn(async () => {
          return Bytes.fromHex(
            '0x0000000000000000000000000000000000000000000000000000000000000123',
          )
        }),
        blockNumber: 123,
        chain: 'foo',
      } as unknown as IProvider

      const handler = new StorageHandler('someName', {
        type: 'storage',
        slot: 1,
        returnType: 'uint8',
      })
      expect(handler.field).toStrictEqual('someName')

      const result = await handler.execute(provider, address, {})
      expect(result).toStrictEqual({
        field: 'someName',
        value: 0x23,
        ignoreRelative: undefined,
      })
    })
  })

  describe('dependencies', () => {
    it('detects no dependencies for a simple definition', () => {
      const handler = new StorageHandler('someName', {
        type: 'storage',
        slot: 1,
      })

      expect(handler.dependencies).toStrictEqual([])
    })

    it('detects no dependencies for a complex definition', () => {
      const handler = new StorageHandler('someName', {
        type: 'storage',
        slot: [1, '0x1234'],
        offset: 25,
      })

      expect(handler.dependencies).toStrictEqual([])
    })

    it('detects dependency from the slot field', () => {
      const handler = new StorageHandler('someName', {
        type: 'storage',
        slot: '{{ foo }}',
      })

      expect(handler.dependencies).toStrictEqual(['foo'])
    })

    it('detects dependency from the offset field', () => {
      const handler = new StorageHandler('someName', {
        type: 'storage',
        slot: 1,
        offset: '{{ foo }}',
      })

      expect(handler.dependencies).toStrictEqual(['foo'])
    })

    it('detects dependency from the both fields at the same time', () => {
      const handler = new StorageHandler('someName', {
        type: 'storage',
        slot: '{{ foo }}',
        offset: '{{ bar }}',
      })

      expect(handler.dependencies).toStrictEqual(['bar', 'foo'])
    })

    it('detects from a complex slot field', () => {
      const handler = new StorageHandler('someName', {
        type: 'storage',
        slot: [1, '{{ foo }}', 2, '{{ baz }}'],
        offset: '{{ bar }}',
      })

      expect(handler.dependencies).toStrictEqual(['bar', 'foo', 'baz'])
    })

    it('detects the base field of a nested reference', () => {
      const handler = new StorageHandler('someName', {
        type: 'storage',
        slot: [1, '{{ constructorArgs._slot }}'],
        offset: '{{ owner }}',
      })

      expect(handler.dependencies).toStrictEqual(['owner', 'constructorArgs'])
    })
  })

  describe('computing the slot', () => {
    // Please read this:
    // https://docs.soliditylang.org/en/latest/internals/layout_in_storage.html#mappings-and-dynamic-arrays

    async function testComputeSlot(options: {
      definition: StorageHandlerDefinition
      previousResults?: Record<string, HandlerResult | undefined>
      expectedSlot?: bigint
      expectedError?: string
    }) {
      const handler = new StorageHandler('someName', options.definition)
      let slot: bigint | number | Bytes | undefined
      const provider = {
        getStorage: vi.fn(async (_passedAddress, receivedSlot) => {
          slot = receivedSlot
          return Bytes.fromHex('0'.repeat(64))
        }),
        blockNumber: 123,
        chain: 'foo',
      } as unknown as IProvider
      const result = await handler.execute(
        provider,
        ChainSpecificAddress.random(),
        options.previousResults ?? {},
      )
      if (options.expectedSlot !== undefined) {
        expect(slot).toStrictEqual(options.expectedSlot)
      }
      if (options.expectedError) {
        expect(result.error).toStrictEqual(options.expectedError)
      }
    }

    it('computes the simple slot with offset', async () => {
      await testComputeSlot({
        definition: {
          type: 'storage',
          slot: 1,
          offset: 1,
        },
        expectedSlot: 2n,
      })
    })

    it('computes an array entry', async () => {
      await testComputeSlot({
        definition: {
          type: 'storage',
          slot: [1],
          offset: 1,
        },
        expectedSlot:
          BigInt(
            utils.keccak256(utils.defaultAbiCoder.encode(['uint256'], [1])),
          ) + 1n,
      })
    })

    it('computes a mapping entry', async () => {
      const address = ChainSpecificAddress.random()

      await testComputeSlot({
        definition: {
          type: 'storage',
          slot: [1, ChainSpecificAddress.address(address).toString()],
          offset: 1,
        },
        expectedSlot:
          BigInt(
            utils.keccak256(
              utils.defaultAbiCoder.encode(
                ['address', 'uint256'],
                [ChainSpecificAddress.address(address), 1],
              ),
            ),
          ) + 1n,
      })
    })

    it('computes a nested mapping entry', async () => {
      const address = ChainSpecificAddress.random()

      await testComputeSlot({
        definition: {
          type: 'storage',
          slot: [1, ChainSpecificAddress.address(address).toString(), 5],
          offset: 1,
        },
        expectedSlot:
          BigInt(
            utils.keccak256(
              utils.defaultAbiCoder.encode(
                ['uint256', 'bytes32'],
                [
                  5,
                  utils.keccak256(
                    utils.defaultAbiCoder.encode(
                      ['address', 'uint256'],
                      [ChainSpecificAddress.address(address), 1],
                    ),
                  ),
                ],
              ),
            ),
          ) + 1n,
      })
    })

    it('resolves simple values', async () => {
      await testComputeSlot({
        definition: {
          type: 'storage',
          slot: '{{ foo }}',
          offset: '{{ bar }}',
        },
        expectedSlot: 3n,
        previousResults: {
          foo: { field: 'foo', value: 1 },
          bar: { field: 'bar', value: 2 },
        },
      })
    })

    it('resolves nested values', async () => {
      await testComputeSlot({
        definition: {
          type: 'storage',
          slot: ['{{ foo }}'],
          offset: '{{ bar }}',
        },
        expectedSlot:
          BigInt(
            utils.keccak256(utils.defaultAbiCoder.encode(['uint256'], [1])),
          ) + 2n,
        previousResults: {
          foo: { field: 'foo', value: 1 },
          bar: { field: 'bar', value: 2 },
        },
      })
    })
  })

  it('handles provider errors', async () => {
    const handler = new StorageHandler('someName', {
      type: 'storage',
      slot: 1,
    })

    const provider = {
      getStorage: vi.fn(async () => {
        throw new Error('foo bar')
      }),
      blockNumber: 123,
      chain: 'foo',
    } as unknown as IProvider
    const address = ChainSpecificAddress.random()
    const result = await handler.execute(provider, address, {})
    expect(result).toStrictEqual({
      field: 'someName',
      error: 'foo bar',
    })
  })
})
