import { Bytes, ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { utils } from 'ethers'
import type { IProvider } from '../../provider/IProvider'
import type { HandlerResult } from '../Handler'
import { StorageHandler, type StorageHandlerDefinition } from './StorageHandler'

describe(StorageHandler.name, () => {
  describe('return types', () => {
    it('can returns storage as bytes', async () => {
      const address = ChainSpecificAddress.random()
      const provider = mockObject<IProvider>({
        async getStorage(passedAddress, slot) {
          expect(passedAddress).toEqual(address)
          expect(slot).toEqual(1n)
          return Bytes.fromHex(
            '0x0000000000000000000000000000000000000000000000000000000000000123',
          )
        },
        blockNumber: 123,
        chain: 'foo',
      })

      const handler = new StorageHandler('someName', {
        type: 'storage',
        slot: 1,
      })
      expect(handler.field).toEqual('someName')

      const result = await handler.execute(provider, address, {})
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
        blockNumber: 123,
        chain: 'foo',
      })

      const handler = new StorageHandler('someName', {
        type: 'storage',
        slot: 1,
        returnType: 'number',
      })
      expect(handler.field).toEqual('someName')

      const result = await handler.execute(provider, address, {})
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
        blockNumber: 123,
        chain: 'foo',
      })

      const handler = new StorageHandler('someName', {
        type: 'storage',
        slot: 1,
        returnType: 'address',
      })
      expect(handler.field).toEqual('someName')

      const result = await handler.execute(provider, address, {})
      expect(result).toEqual({
        field: 'someName',
        value: ChainSpecificAddress.address(resultAddress).toString(),
        ignoreRelative: undefined,
      })
    })

    it('can returns storage as uint8', async () => {
      const address = ChainSpecificAddress.random()
      const provider = mockObject<IProvider>({
        async getStorage() {
          return Bytes.fromHex(
            '0x0000000000000000000000000000000000000000000000000000000000000123',
          )
        },
        blockNumber: 123,
        chain: 'foo',
      })

      const handler = new StorageHandler('someName', {
        type: 'storage',
        slot: 1,
        returnType: 'uint8',
      })
      expect(handler.field).toEqual('someName')

      const result = await handler.execute(provider, address, {})
      expect(result).toEqual({
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
      const provider = mockObject<IProvider>({
        async getStorage(_passedAddress, receivedSlot) {
          slot = receivedSlot
          return Bytes.fromHex('0'.repeat(64))
        },
        blockNumber: 123,
        chain: 'foo',
      })
      const result = await handler.execute(
        provider,
        ChainSpecificAddress.random(),
        options.previousResults ?? {},
      )
      if (options.expectedSlot !== undefined) {
        expect(slot).toEqual(options.expectedSlot)
      }
      if (options.expectedError) {
        expect(result.error).toEqual(options.expectedError)
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

    const provider = mockObject<IProvider>({
      async getStorage() {
        throw new Error('foo bar')
      },
      blockNumber: 123,
      chain: 'foo',
    })
    const address = ChainSpecificAddress.random()
    const result = await handler.execute(provider, address, {})
    expect(result).toEqual({
      field: 'someName',
      error: 'foo bar',
    })
  })
})
