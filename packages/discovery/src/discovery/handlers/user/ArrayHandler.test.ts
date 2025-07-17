import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'

import type { IProvider } from '../../provider/IProvider'
import { toFunctionFragment } from '../utils/toFunctionFragment'
import { ArrayHandler, getArrayFragment } from './ArrayHandler'

describe(ArrayHandler.name, () => {
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
      )

      expect(handler.dependencies).toEqual(['foo'])
    })

    it('detects dependency from the indices field', () => {
      const handler = new ArrayHandler(
        'someName',
        {
          type: 'array',
          method: 'function foo(uint i) view returns (uint)',
          indices: '{{ foo }}',
        },
        [],
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
          ),
      ).toThrow('Invalid method abi')
    })

    it('finds the method by field name', () => {
      const handler = new ArrayHandler('someName', { type: 'array' }, [
        'function foo(uint256 i) view returns (uint256)',
        'function someName(uint256 i) view returns (uint256)',
        'function someName(uint256 a, uint256 b) view returns (uint256)',
        'function someName() view returns (uint256)',
      ])

      expect(handler.getMethod()).toEqual(
        'function someName(uint256 i) view returns (uint256)',
      )
    })

    it('throws if it cannot find the method by field name', () => {
      expect(
        () =>
          new ArrayHandler('someName', { type: 'array' }, [
            'function foo(uint256 i) view returns (uint256)',
            'function someName(uint256 a, uint256 b) view returns (uint256)',
            'function someName() view returns (uint256)',
          ]),
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
      )

      expect(handler.getMethod()).toEqual(
        'function bar(uint256 i) view returns (uint256)',
      )
    })

    it('throws if it cannot find the method by method name', () => {
      expect(
        () =>
          new ArrayHandler('someName', { type: 'array', method: 'bar' }, [
            'function foo(uint256 i) view returns (uint256)',
            'function someName(uint256 i) view returns (uint256)',
            'function someName(uint256 a, uint256 b) view returns (uint256)',
            'function someName() view returns (uint256)',
            'function bar(uint256 a, uint256 b) view returns (uint256)',
            'function bar() view returns (uint256)',
          ]),
      ).toThrow('Cannot find a matching method for bar')
    })
  })

  describe('execute', () => {
    const method = 'function owners(uint256 index) view returns (address)'
    const arrayFragment = getArrayFragment(toFunctionFragment(method))
    const address = ChainSpecificAddress.random()
    const owners = [
      ChainSpecificAddress.random(),
      ChainSpecificAddress.random(),
      ChainSpecificAddress.random(),
    ]

    it('calls the method "length" times', async () => {
      const provider = mockObject<IProvider>({
        blockNumber: 123,
        chain: 'foo',
        async callMethod<T>(
          passedAddress: ChainSpecificAddress,
          _abi: string,
          data: unknown[],
        ) {
          expect(passedAddress).toEqual(address)

          const index = data[0] as number
          expect(data).toEqual([index])

          return owners[index]!.toString() as T
        },
      })

      const handler = new ArrayHandler(
        'owners',
        { type: 'array', method, length: 3 },
        [],
      )
      const result = await handler.execute(provider, address, {})
      expect(result).toEqual({
        field: 'owners',
        fragment: arrayFragment,
        value: owners.map((x) => x.toString()),
        ignoreRelative: undefined,
      })
    })

    it('passes the ignoreRelative field', async () => {
      const provider = mockObject<IProvider>({
        blockNumber: 123,
        chain: 'foo',
        async callMethod<T>(
          passedAddress: ChainSpecificAddress,
          _abi: string,
          data: unknown[],
        ) {
          expect(passedAddress).toEqual(address)
          const index = data[0] as number
          return owners[index]!.toString() as T
        },
      })

      const handler = new ArrayHandler(
        'owners',
        { type: 'array', method, length: 3, ignoreRelative: true },
        [],
      )
      const result = await handler.execute(provider, address, {})
      expect(result).toEqual({
        field: 'owners',
        fragment: arrayFragment,
        value: owners.map((x) => x.toString()),
        ignoreRelative: true,
      })
    })

    it('resolves the "length" field', async () => {
      const provider = mockObject<IProvider>({
        blockNumber: 123,
        chain: 'foo',
        async callMethod<T>(
          passedAddress: ChainSpecificAddress,
          _abi: string,
          data: unknown[],
        ) {
          expect(passedAddress).toEqual(address)
          const index = data[0] as number
          return owners[index]!.toString() as T
        },
      })

      const handler = new ArrayHandler(
        'owners',
        { type: 'array', method, length: '{{ foo }}' },
        [],
      )
      const result = await handler.execute(provider, address, {
        foo: { field: 'foo', value: 3 },
      })
      expect(result).toEqual({
        field: 'owners',
        fragment: arrayFragment,
        value: owners.map((x) => x.toString()),
        ignoreRelative: undefined,
      })
    })

    it('handles errors when length is present', async () => {
      const provider = mockObject<IProvider>({
        blockNumber: 123,
        chain: 'foo',
        async callMethod<T>(
          passedAddress: ChainSpecificAddress,
          _abi: string,
          data: unknown[],
        ) {
          expect(passedAddress).toEqual(address)
          const index = data[0] as number
          if (index === 1) {
            throw new Error('Execution reverted')
          }
          return owners[index]!.toString() as T
        },
      })

      const handler = new ArrayHandler(
        'owners',
        { type: 'array', method, length: 3 },
        [],
      )
      const result = await handler.execute(provider, address, {})
      expect(result).toEqual({
        field: 'owners',
        error: 'Execution reverted',
      })
    })

    it('calls the method until revert without length', async () => {
      const provider = mockObject<IProvider>({
        blockNumber: 123,
        chain: 'foo',
        async callMethod<T>(
          passedAddress: ChainSpecificAddress,
          _abi: string,
          data: unknown[],
        ) {
          expect(passedAddress).toEqual(address)
          const index = data[0] as number
          if (index >= 3) {
            throw new Error('Execution reverted')
          }
          return owners[index]!.toString() as T
        },
      })

      const handler = new ArrayHandler('owners', { type: 'array', method }, [])
      const result = await handler.execute(provider, address, {})
      expect(result).toEqual({
        field: 'owners',
        fragment: arrayFragment,
        value: owners.map((x) => x.toString()),
        ignoreRelative: undefined,
      })
    })

    it('handles non-revert errors without length', async () => {
      const provider = mockObject<IProvider>({
        blockNumber: 123,
        chain: 'foo',
        async callMethod<T>(
          passedAddress: ChainSpecificAddress,
          _abi: string,
          data: unknown[],
        ) {
          expect(passedAddress).toEqual(address)
          const index = data[0] as number
          if (index === 1) {
            throw new Error('oops')
          }
          return owners[index]!.toString() as T
        },
      })

      const handler = new ArrayHandler('owners', { type: 'array', method }, [])
      const result = await handler.execute(provider, address, {})
      expect(result).toEqual({
        field: 'owners',
        error: 'oops',
      })
    })

    it('has a builtin limit of 100', async () => {
      const provider = mockObject<IProvider>({
        blockNumber: 123,
        chain: 'foo',
        async callMethod<T>() {
          return ChainSpecificAddress.ZERO('ethereum') as T
        },
      })

      const handler = new ArrayHandler('owners', { type: 'array', method }, [])
      const result = await handler.execute(provider, address, {})
      expect(result).toEqual({
        field: 'owners',
        fragment: arrayFragment,
        error: 'Too many values. Provide a higher maxLength value',
        value: new Array(100).fill(ChainSpecificAddress.ZERO('ethereum')),
      })
    })

    it('can have a different maxLength', async () => {
      const provider = mockObject<IProvider>({
        blockNumber: 123,
        chain: 'foo',
        async callMethod<T>() {
          return ChainSpecificAddress.ZERO('ethereum') as T
        },
      })

      const handler = new ArrayHandler(
        'owners',
        { type: 'array', method, maxLength: 15 },
        [],
      )
      const result = await handler.execute(provider, address, {})
      expect(result).toEqual({
        field: 'owners',
        fragment: arrayFragment,
        error: 'Too many values. Provide a higher maxLength value',
        value: new Array(15).fill(ChainSpecificAddress.ZERO('ethereum')),
      })
    })

    it('calls indices if present', async () => {
      const provider = mockObject<IProvider>({
        blockNumber: 123,
        chain: 'foo',
        async callMethod<T>(
          passedAddress: ChainSpecificAddress,
          _abi: string,
          data: unknown[],
        ) {
          expect(passedAddress).toEqual(address)
          const index = data[0] as number
          return owners[index]!.toString() as T
        },
      })

      const handler = new ArrayHandler(
        'owners',
        { type: 'array', method, indices: [0, 2] },
        [],
      )
      const result = await handler.execute(provider, address, {})
      expect(result).toEqual({
        field: 'owners',
        fragment: arrayFragment,
        value: [owners[0]!.toString(), owners[2]!.toString()],
        ignoreRelative: undefined,
      })
    })
    it('returns correct order of indices', async () => {
      const owners = new Array(10)
        .fill(0)
        .map(() => ChainSpecificAddress.random())

      const provider = mockObject<IProvider>({
        blockNumber: 123,
        chain: 'foo',
        async callMethod<T>(
          passedAddress: ChainSpecificAddress,
          _abi: string,
          data: unknown[],
        ) {
          expect(passedAddress).toEqual(address)
          // simulate random order of responses
          if (Math.random() > 0.5) {
            await new Promise((resolve) => setTimeout(resolve, 0))
          }
          const index = data[0] as number
          return owners[index]!.toString() as T
        },
      })

      const handler = new ArrayHandler(
        'owners',
        { type: 'array', method, indices: [0, 2, 3, 4, 5, 6] },
        [],
      )
      const result = await handler.execute(provider, address, {})
      expect(result).toEqual({
        field: 'owners',
        fragment: arrayFragment,
        value: [
          owners[0],
          owners[2],
          owners[3],
          owners[4],
          owners[5],
          owners[6],
        ].map((x) => x!.toString()),
        ignoreRelative: undefined,
      })
    })

    it('resolves the "indices" field', async () => {
      const provider = mockObject<IProvider>({
        blockNumber: 123,
        chain: 'foo',
        async callMethod<T>(
          passedAddress: ChainSpecificAddress,
          _abi: string,
          data: unknown[],
        ) {
          expect(passedAddress).toEqual(address)
          const index = data[0] as number
          return owners[index]!.toString() as T
        },
      })

      const handler = new ArrayHandler(
        'owners',
        { type: 'array', method, indices: '{{ foo }}' },
        [],
      )
      const result = await handler.execute(provider, address, {
        foo: { field: 'foo', value: [0, 2] },
      })
      expect(result).toEqual({
        field: 'owners',
        fragment: arrayFragment,
        value: [owners[0]!.toString(), owners[2]!.toString()],
        ignoreRelative: undefined,
      })
    })
  })
})
