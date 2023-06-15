import { Bytes, EthereumAddress } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'

import { DiscoveryLogger } from '../../DiscoveryLogger'
import { DiscoveryProvider } from '../../provider/DiscoveryProvider'
import { ArrayHandler } from './ArrayHandler'

describe(ArrayHandler.name, () => {
  const BLOCK_NUMBER = 1234

  describe('dependencies', () => {
    it('detects no dependencies for a simple definition', () => {
      const handler = new ArrayHandler(
        'someName',
        {
          type: 'array',
          method: 'function foo(uint i) view returns (uint)',
          length: 1,
        },
        [],
        DiscoveryLogger.SILENT,
      )

      expect(handler.dependencies).toEqual([])
    })

    it('detects dependency from the length field', () => {
      const handler = new ArrayHandler(
        'someName',
        {
          type: 'array',
          method: 'function foo(uint i) view returns (uint)',
          length: '{{ foo }}',
        },
        [],
        DiscoveryLogger.SILENT,
      )

      expect(handler.dependencies).toEqual(['foo'])
    })
  })

  describe('getMethod', () => {
    it('returns the passed method properly formatted', () => {
      const handler = new ArrayHandler(
        'someName',
        {
          type: 'array',
          method: 'function foo(uint i) view returns (uint)',
        },
        [],
        DiscoveryLogger.SILENT,
      )

      expect(handler.getMethod()).toEqual(
        'function foo(uint256 i) view returns (uint256)',
      )
    })

    it('rejects a non-array method abi', () => {
      expect(
        () =>
          new ArrayHandler(
            'someName',
            {
              type: 'array',
              method: 'function foo() view returns (uint)',
            },
            [],
            DiscoveryLogger.SILENT,
          ),
      ).toThrow('Invalid method abi')
    })

    it('rejects a non-view array method abi', () => {
      expect(
        () =>
          new ArrayHandler(
            'someName',
            {
              type: 'array',
              method: 'function foo(uint256 i) returns (uint)',
            },
            [],
            DiscoveryLogger.SILENT,
          ),
      ).toThrow('Invalid method abi')
    })

    it('finds the method by field name', () => {
      const handler = new ArrayHandler(
        'someName',
        { type: 'array' },
        [
          'function foo(uint256 i) view returns (uint256)',
          'function someName(uint256 i) view returns (uint256)',
          'function someName(uint256 a, uint256 b) view returns (uint256)',
          'function someName() view returns (uint256)',
        ],
        DiscoveryLogger.SILENT,
      )

      expect(handler.getMethod()).toEqual(
        'function someName(uint256 i) view returns (uint256)',
      )
    })

    it('throws if it cannot find the method by field name', () => {
      expect(
        () =>
          new ArrayHandler(
            'someName',
            { type: 'array' },
            [
              'function foo(uint256 i) view returns (uint256)',
              'function someName(uint256 a, uint256 b) view returns (uint256)',
              'function someName() view returns (uint256)',
            ],
            DiscoveryLogger.SILENT,
          ),
      ).toThrow('Cannot find a matching method for someName')
    })

    it('finds the method by method name', () => {
      const handler = new ArrayHandler(
        'someName',
        { type: 'array', method: 'bar' },
        [
          'function foo(uint256 i) view returns (uint256)',
          'function someName(uint256 i) view returns (uint256)',
          'function someName(uint256 a, uint256 b) view returns (uint256)',
          'function someName() view returns (uint256)',
          'function bar(uint256 i) view returns (uint256)',
          'function bar(uint256 a, uint256 b) view returns (uint256)',
          'function bar() view returns (uint256)',
        ],
        DiscoveryLogger.SILENT,
      )

      expect(handler.getMethod()).toEqual(
        'function bar(uint256 i) view returns (uint256)',
      )
    })

    it('throws if it cannot find the method by method name', () => {
      expect(
        () =>
          new ArrayHandler(
            'someName',
            { type: 'array', method: 'bar' },
            [
              'function foo(uint256 i) view returns (uint256)',
              'function someName(uint256 i) view returns (uint256)',
              'function someName(uint256 a, uint256 b) view returns (uint256)',
              'function someName() view returns (uint256)',
              'function bar(uint256 a, uint256 b) view returns (uint256)',
              'function bar() view returns (uint256)',
            ],
            DiscoveryLogger.SILENT,
          ),
      ).toThrow('Cannot find a matching method for bar')
    })
  })

  describe('execute', () => {
    const method = 'function owners(uint256 index) view returns (address)'
    const signature = '0x025e7c27'
    const address = EthereumAddress.random()
    const owners = [
      EthereumAddress.random(),
      EthereumAddress.random(),
      EthereumAddress.random(),
    ]

    it('calls the method "length" times', async () => {
      const provider = mockObject<DiscoveryProvider>({
        async call(passedAddress, data) {
          expect(passedAddress).toEqual(address)

          const index = data.get(35)

          expect(data).toEqual(
            Bytes.fromHex(signature + index.toString().padStart(64, '0')),
          )

          return Bytes.fromHex('00'.repeat(12)).concat(
            Bytes.fromHex(owners[index].toString()),
          )
        },
      })

      const handler = new ArrayHandler(
        'owners',
        { type: 'array', method, length: 3 },
        [],
        DiscoveryLogger.SILENT,
      )
      const result = await handler.execute(provider, address, BLOCK_NUMBER, {})
      expect(result).toEqual({
        field: 'owners',
        value: owners.map((x) => x.toString()),
        ignoreRelative: undefined,
      })
    })

    it('passes the ignoreRelative field', async () => {
      const provider = mockObject<DiscoveryProvider>({
        async call(passedAddress, data) {
          expect(passedAddress).toEqual(address)
          const index = data.get(35)
          return Bytes.fromHex('00'.repeat(12)).concat(
            Bytes.fromHex(owners[index].toString()),
          )
        },
      })

      const handler = new ArrayHandler(
        'owners',
        { type: 'array', method, length: 3, ignoreRelative: true },
        [],
        DiscoveryLogger.SILENT,
      )
      const result = await handler.execute(provider, address, BLOCK_NUMBER, {})
      expect(result).toEqual({
        field: 'owners',
        value: owners.map((x) => x.toString()),
        ignoreRelative: true,
      })
    })

    it('resolves the "length" field', async () => {
      const provider = mockObject<DiscoveryProvider>({
        async call(passedAddress, data) {
          expect(passedAddress).toEqual(address)
          const index = data.get(35)
          return Bytes.fromHex('00'.repeat(12)).concat(
            Bytes.fromHex(owners[index].toString()),
          )
        },
      })

      const handler = new ArrayHandler(
        'owners',
        { type: 'array', method, length: '{{ foo }}' },
        [],
        DiscoveryLogger.SILENT,
      )
      const result = await handler.execute(provider, address, BLOCK_NUMBER, {
        foo: { field: 'foo', value: 3 },
      })
      expect(result).toEqual({
        field: 'owners',
        value: owners.map((x) => x.toString()),
        ignoreRelative: undefined,
      })
    })

    it('handles errors when length is present', async () => {
      const provider = mockObject<DiscoveryProvider>({
        async call(passedAddress, data) {
          expect(passedAddress).toEqual(address)
          const index = data.get(35)
          if (index === 1) {
            throw new Error('revert')
          }
          return Bytes.fromHex('00'.repeat(12)).concat(
            Bytes.fromHex(owners[index].toString()),
          )
        },
      })

      const handler = new ArrayHandler(
        'owners',
        { type: 'array', method, length: 3 },
        [],
        DiscoveryLogger.SILENT,
      )
      const result = await handler.execute(provider, address, BLOCK_NUMBER, {})
      expect(result).toEqual({
        field: 'owners',
        error: 'Execution reverted',
      })
    })

    it('calls the method until revert without length', async () => {
      const provider = mockObject<DiscoveryProvider>({
        async call(passedAddress, data) {
          expect(passedAddress).toEqual(address)
          const index = data.get(35)
          if (index >= 3) {
            throw new Error('revert')
          }
          return Bytes.fromHex('00'.repeat(12)).concat(
            Bytes.fromHex(owners[index].toString()),
          )
        },
      })

      const handler = new ArrayHandler(
        'owners',
        { type: 'array', method },
        [],
        DiscoveryLogger.SILENT,
      )
      const result = await handler.execute(provider, address, BLOCK_NUMBER, {})
      expect(result).toEqual({
        field: 'owners',
        value: owners.map((x) => x.toString()),
        ignoreRelative: undefined,
      })
    })

    it('handles non-revert errors without length', async () => {
      const provider = mockObject<DiscoveryProvider>({
        async call(passedAddress, data) {
          expect(passedAddress).toEqual(address)
          const index = data.get(35)
          if (index === 1) {
            throw new Error('oops')
          }
          return Bytes.fromHex('00'.repeat(12)).concat(
            Bytes.fromHex(owners[index].toString()),
          )
        },
      })

      const handler = new ArrayHandler(
        'owners',
        { type: 'array', method },
        [],
        DiscoveryLogger.SILENT,
      )
      const result = await handler.execute(provider, address, BLOCK_NUMBER, {})
      expect(result).toEqual({
        field: 'owners',
        error: 'oops',
      })
    })

    it('has a builtin limit of 100', async () => {
      const provider = mockObject<DiscoveryProvider>({
        async call() {
          return Bytes.fromHex('0'.repeat(64))
        },
      })

      const handler = new ArrayHandler(
        'owners',
        { type: 'array', method },
        [],
        DiscoveryLogger.SILENT,
      )
      const result = await handler.execute(provider, address, BLOCK_NUMBER, {})
      expect(result).toEqual({
        field: 'owners',
        error: 'Too many values. Provide a higher maxLength value',
        value: new Array(100).fill('0x' + '0'.repeat(40)),
      })
    })

    it('can have a different maxLength', async () => {
      const provider = mockObject<DiscoveryProvider>({
        async call() {
          return Bytes.fromHex('0'.repeat(64))
        },
      })

      const handler = new ArrayHandler(
        'owners',
        { type: 'array', method, maxLength: 15 },
        [],
        DiscoveryLogger.SILENT,
      )
      const result = await handler.execute(provider, address, BLOCK_NUMBER, {})
      expect(result).toEqual({
        field: 'owners',
        error: 'Too many values. Provide a higher maxLength value',
        value: new Array(15).fill('0x' + '0'.repeat(40)),
      })
    })
  })
})
