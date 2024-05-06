import { Bytes, EthereumAddress } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { utils } from 'ethers'

import { DiscoveryLogger } from '../../DiscoveryLogger'
import { DiscoveryProvider } from '../../provider/DiscoveryProvider'
import { HandlerResult } from '../Handler'
import { StorageHandler, StorageHandlerDefinition } from './StorageHandler'

describe(StorageHandler.name, () => {
  const BLOCK_NUMBER = 1234

  describe('return types', () => {
    it('can returns storage as bytes', async () => {
      const address = EthereumAddress.random()
      const provider = mockObject<DiscoveryProvider>({
        async getStorage(passedAddress, slot) {
          expect(passedAddress).toEqual(address)
          expect(slot).toEqual(1n)
          return Bytes.fromHex(
            '0x0000000000000000000000000000000000000000000000000000000000000123',
          )
        },
      })

      const handler = new StorageHandler(
        'someName',
        {
          type: 'storage',
          slot: 1,
        },
        DiscoveryLogger.SILENT,
      )
      expect(handler.field).toEqual('someName')

      const result = await handler.execute(provider, address, BLOCK_NUMBER, {})
      expect(result).toEqual({
        field: 'someName',
        value:
          '0x0000000000000000000000000000000000000000000000000000000000000123',
        ignoreRelative: undefined,
      })
    })

    it('can returns storage as number', async () => {
      const address = EthereumAddress.random()
      const provider = mockObject<DiscoveryProvider>({
        async getStorage() {
          return Bytes.fromHex(
            '0x0000000000000000000000000000000000000000000000000000000000000123',
          )
        },
      })

      const handler = new StorageHandler(
        'someName',
        {
          type: 'storage',
          slot: 1,
          returnType: 'number',
        },
        DiscoveryLogger.SILENT,
      )
      expect(handler.field).toEqual('someName')

      const result = await handler.execute(provider, address, BLOCK_NUMBER, {})
      expect(result).toEqual({
        field: 'someName',
        value: 0x123,
        ignoreRelative: undefined,
      })
    })

    it('can returns storage as address', async () => {
      const address = EthereumAddress.random()
      const resultAddress = EthereumAddress.random()

      const provider = mockObject<DiscoveryProvider>({
        async getStorage() {
          return Bytes.fromHex(
            '0x000000000000000000000000' + resultAddress.slice(2).toLowerCase(),
          )
        },
      })

      const handler = new StorageHandler(
        'someName',
        {
          type: 'storage',
          slot: 1,
          returnType: 'address',
        },
        DiscoveryLogger.SILENT,
      )
      expect(handler.field).toEqual('someName')

      const result = await handler.execute(provider, address, BLOCK_NUMBER, {})
      expect(result).toEqual({
        field: 'someName',
        value: resultAddress.toString(),
        ignoreRelative: undefined,
      })
    })
  })

  describe('dependencies', () => {
    it('detects no dependencies for a simple definition', () => {
      const handler = new StorageHandler(
        'someName',
        {
          type: 'storage',
          slot: 1,
        },
        DiscoveryLogger.SILENT,
      )

      expect(handler.dependencies).toEqual([])
    })

    it('detects no dependencies for a complex definition', () => {
      const handler = new StorageHandler(
        'someName',
        {
          type: 'storage',
          slot: [1, '0x1234'],
          offset: 25,
        },
        DiscoveryLogger.SILENT,
      )

      expect(handler.dependencies).toEqual([])
    })

    it('detects dependency from the slot field', () => {
      const handler = new StorageHandler(
        'someName',
        {
          type: 'storage',
          slot: '{{ foo }}',
        },
        DiscoveryLogger.SILENT,
      )

      expect(handler.dependencies).toEqual(['foo'])
    })

    it('detects dependency from the offset field', () => {
      const handler = new StorageHandler(
        'someName',
        {
          type: 'storage',
          slot: 1,
          offset: '{{ foo }}',
        },
        DiscoveryLogger.SILENT,
      )

      expect(handler.dependencies).toEqual(['foo'])
    })

    it('detects dependency from the both fields at the same time', () => {
      const handler = new StorageHandler(
        'someName',
        {
          type: 'storage',
          slot: '{{ foo }}',
          offset: '{{ bar }}',
        },
        DiscoveryLogger.SILENT,
      )

      expect(handler.dependencies).toEqual(['bar', 'foo'])
    })

    it('detects from a complex slot field', () => {
      const handler = new StorageHandler(
        'someName',
        {
          type: 'storage',
          slot: [1, '{{ foo }}', 2, '{{ baz }}'],
          offset: '{{ bar }}',
        },
        DiscoveryLogger.SILENT,
      )

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
      const handler = new StorageHandler(
        'someName',
        options.definition,
        DiscoveryLogger.SILENT,
      )
      let slot: bigint | number | Bytes | undefined
      const provider = mockObject<DiscoveryProvider>({
        async getStorage(passedAddress, receivedSlot) {
          slot = receivedSlot
          return Bytes.fromHex('0'.repeat(64))
        },
      })
      const result = await handler.execute(
        provider,
        EthereumAddress.random(),
        BLOCK_NUMBER,
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
      const address = EthereumAddress.random()

      await testComputeSlot({
        definition: {
          type: 'storage',
          slot: [1, address.toString()],
          offset: 1,
        },
        expectedSlot:
          BigInt(
            utils.keccak256(
              utils.defaultAbiCoder.encode(
                ['address', 'uint256'],
                [address, 1],
              ),
            ),
          ) + 1n,
      })
    })

    it('computes a nested mapping entry', async () => {
      const address = EthereumAddress.random()

      await testComputeSlot({
        definition: {
          type: 'storage',
          slot: [1, address.toString(), 5],
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
                      [address, 1],
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
    const handler = new StorageHandler(
      'someName',
      {
        type: 'storage',
        slot: 1,
      },
      DiscoveryLogger.SILENT,
    )

    const provider = mockObject<DiscoveryProvider>({
      async getStorage() {
        throw new Error('foo bar')
      },
    })
    const address = EthereumAddress.random()
    const result = await handler.execute(provider, address, BLOCK_NUMBER, {})
    expect(result).toEqual({
      field: 'someName',
      error: 'foo bar',
    })
  })
})
