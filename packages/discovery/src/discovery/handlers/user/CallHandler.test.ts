import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'

import type { IProvider } from '../../provider/IProvider'
import { EXEC_REVERT_MSG } from '../utils/callMethod'
import { toFunctionFragment } from '../utils/toFunctionFragment'
import { CallHandler } from './CallHandler'

describe(CallHandler.name, () => {
  describe('dependencies', () => {
    it('detects no dependencies for a simple definition', () => {
      const handler = new CallHandler(
        'someName',
        {
          type: 'call',
          method: 'function foo(uint a, uint b) view returns (uint)',
          args: [1, 2],
        },
        [],
      )

      expect(handler.dependencies).toEqual([])
    })

    it('detects dependencies in args', () => {
      const handler = new CallHandler(
        'someName',
        {
          type: 'call',
          method:
            'function foo(uint a, uint b, uint c, uint d) view returns (uint)',
          args: [1, '{{ foo }}', 2, '{{ bar }}'],
        },
        [],
      )

      expect(handler.dependencies).toEqual(['foo', 'bar'])
    })

    it('detects dependencies in inAddress', () => {
      const handler = new CallHandler(
        'someName',
        {
          type: 'call',
          method:
            'function foo(uint a, uint b, uint c, uint d) view returns (uint)',
          args: [1, 2, 3, 4],
          address: '{{ quax }}',
        },
        [],
      )

      expect(handler.dependencies).toEqual(['quax'])
    })
  })

  describe('getMethod', () => {
    it('returns the passed method properly formatted', () => {
      const handler = new CallHandler(
        'someName',
        {
          type: 'call',
          method: 'function foo(uint i) view returns (uint)',
          args: [1],
        },
        [],
      )

      expect(handler.getMethod()).toEqual(
        'function foo(uint256 i) view returns (uint256)',
      )
    })

    it('rejects a method with incompatible arity', () => {
      expect(
        () =>
          new CallHandler(
            'someName',
            {
              type: 'call',
              method: 'function foo() view returns (uint)',
              args: [1],
            },
            [],
          ),
      ).toThrow('Invalid method abi')
    })

    it('rejects a non-view method abi', () => {
      expect(
        () =>
          new CallHandler(
            'someName',
            {
              type: 'call',
              method: 'function foo(uint256 a, uint256 b) returns (uint)',
              args: [1, 2],
            },
            [],
          ),
      ).toThrow('Invalid method abi')
    })

    it('finds the method by field name', () => {
      const handler = new CallHandler('someName', { type: 'call', args: [] }, [
        'function foo() view returns (uint256)',
        'function someName(uint256 i) view returns (uint256)',
        'function someName(uint256 a, uint256 b) view returns (uint256)',
        'function someName() view returns (uint256)',
      ])

      expect(handler.getMethod()).toEqual(
        'function someName() view returns (uint256)',
      )
    })

    it('respects method arity during lookup', () => {
      const handler = new CallHandler(
        'someName',
        { type: 'call', args: [1, 2] },
        [
          'function foo() view returns (uint256)',
          'function someName(uint256 i) view returns (uint256)',
          'function someName(uint256 a, uint256 b) view returns (uint256)',
          'function someName() view returns (uint256)',
        ],
      )

      expect(handler.getMethod()).toEqual(
        'function someName(uint256 a, uint256 b) view returns (uint256)',
      )
    })

    it('throws if it cannot find the method by field name', () => {
      expect(
        () =>
          new CallHandler('someName', { type: 'call', args: [] }, [
            'function foo(uint256 i) view returns (uint256)',
            'function someName(uint256 i) view returns (uint256)',
            'function someName(uint256 a, uint256 b) view returns (uint256)',
          ]),
      ).toThrow('Cannot find a matching method for someName')
    })

    it('finds the method by method name', () => {
      const handler = new CallHandler(
        'someName',
        { type: 'call', method: 'bar', args: [] },
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
        'function bar() view returns (uint256)',
      )
    })

    it('throws if it cannot find the method by method name', () => {
      expect(
        () =>
          new CallHandler(
            'someName',
            { type: 'call', method: 'bar', args: [] },
            [
              'function foo(uint256 i) view returns (uint256)',
              'function someName(uint256 i) view returns (uint256)',
              'function someName(uint256 a, uint256 b) view returns (uint256)',
              'function someName() view returns (uint256)',
              'function bar(uint256 i) view returns (uint256)',
              'function bar(uint256 a, uint256 b) view returns (uint256)',
            ],
          ),
      ).toThrow('Cannot find a matching method for bar')
    })
  })

  describe('execute', () => {
    const method = 'function add(uint256 a, uint256 b) view returns (uint256)'
    const methodFragment = toFunctionFragment(method)
    const address = ChainSpecificAddress.random()

    it('calls the method with the provided parameters', async () => {
      const provider = mockObject<IProvider>({
        blockNumber: 123,
        chain: 'foo',
        async callMethod<T>(
          passedAddress: ChainSpecificAddress,
          _abi: string,
          data: unknown[],
        ) {
          expect(passedAddress).toEqual(address)
          expect(data).toEqual([1, 2])

          return 3 as T
        },
      })

      const handler = new CallHandler(
        'add',
        { type: 'call', method, args: [1, 2] },
        [],
      )
      const result = await handler.execute(provider, address, {})
      expect(result).toEqual({
        field: 'add',
        fragment: methodFragment,
        value: 3,
        ignoreRelative: undefined,
      })
    })

    it('calls the method with the provided parameters and address', async () => {
      const inAddress = ChainSpecificAddress.random()
      const provider = mockObject<IProvider>({
        blockNumber: 123,
        chain: 'foo',
        async callMethod<T>(
          passedAddress: ChainSpecificAddress,
          _abi: string,
          data: unknown[],
        ) {
          expect(passedAddress).toEqual(inAddress)
          expect(data).toEqual([1, 2])

          return 3 as T
        },
      })

      const handler = new CallHandler(
        'add',
        {
          type: 'call',
          method,
          args: [1, 2],
          address: inAddress.toString(),
        },
        [],
      )
      const result = await handler.execute(provider, address, {})
      expect(result).toEqual({
        field: 'add',
        fragment: methodFragment,
        value: 3,
        ignoreRelative: undefined,
      })
    })

    it('calls the method with the resolved parameters', async () => {
      const provider = mockObject<IProvider>({
        blockNumber: 123,
        chain: 'foo',
        async callMethod<T>(
          passedAddress: ChainSpecificAddress,
          _abi: string,
          data: unknown[],
        ) {
          expect(passedAddress).toEqual(address)
          expect(data).toEqual([1, 2])

          return 3 as T
        },
      })

      const handler = new CallHandler(
        'add',
        { type: 'call', method, args: ['{{ foo }}', '{{ bar }}'] },
        [],
      )
      const result = await handler.execute(provider, address, {
        foo: { field: 'foo', value: 1 },
        bar: { field: 'bar', value: 2 },
      })
      expect(result).toEqual({
        field: 'add',
        fragment: methodFragment,
        value: 3,
        ignoreRelative: undefined,
      })
    })

    it('calls the method with the provided parameters and address as dependency', async () => {
      const inAddress = ChainSpecificAddress.random()
      const provider = mockObject<IProvider>({
        blockNumber: 123,
        chain: 'foo',
        async callMethod<T>(
          passedAddress: ChainSpecificAddress,
          _abi: string,
          data: unknown[],
        ) {
          expect(passedAddress).toEqual(inAddress)
          expect(data).toEqual([1, 2])

          return 3 as T
        },
      })

      const handler = new CallHandler(
        'add',
        {
          type: 'call',
          method,
          args: [1, 2],
          address: '{{ someDependentAddress }}',
        },
        [],
      )
      const result = await handler.execute(provider, address, {
        someDependentAddress: {
          field: 'someDependentAddress',
          value: inAddress.toString(),
        },
      })
      expect(result).toEqual({
        field: 'add',
        fragment: methodFragment,
        value: 3,
        ignoreRelative: undefined,
      })
    })

    it('handles errors', async () => {
      const provider = mockObject<IProvider>({
        blockNumber: 123,
        chain: 'foo',
        async callMethod() {
          throw new Error('oops')
        },
      })

      const handler = new CallHandler(
        'add',
        { type: 'call', method, args: [1, 2] },
        [],
      )
      const result = await handler.execute(provider, address, {})
      expect(result).toEqual({
        field: 'add',
        fragment: methodFragment,
        error: 'oops',
        ignoreRelative: undefined,
      })
    })

    it('passes ignoreRelative', async () => {
      const provider = mockObject<IProvider>({
        blockNumber: 123,
        chain: 'foo',
        async callMethod<T>() {
          return 3 as T
        },
      })

      const handler = new CallHandler(
        'add',
        { type: 'call', method, args: [1, 2], ignoreRelative: true },
        [],
      )
      const result = await handler.execute(provider, address, {})
      expect(result).toEqual({
        field: 'add',
        fragment: methodFragment,
        value: 3,
        ignoreRelative: true,
      })
    })

    it('should catch revert error', async () => {
      const provider = mockObject<IProvider>({
        blockNumber: 123,
        chain: 'foo',
        async callMethod() {
          return undefined
        },
      })

      const handler = new CallHandler(
        'add',
        { type: 'call', method, args: [1, 2], expectRevert: true },
        [],
      )
      const result = await handler.execute(provider, address, {})
      expect(result).toEqual({
        field: 'add',
        value: 'EXPECT_REVERT',
        ignoreRelative: undefined,
      })
    })

    it('should not catch revert error when expectRevert is false', async () => {
      const provider = mockObject<IProvider>({
        blockNumber: 123,
        chain: 'foo',
        async callMethod() {
          return undefined
        },
      })

      const handler = new CallHandler(
        'add',
        { type: 'call', method, args: [1, 2], expectRevert: false },
        [],
      )
      const result = await handler.execute(provider, address, {})
      expect(result).toEqual({
        field: 'add',
        error: EXEC_REVERT_MSG,
        fragment: methodFragment,
        ignoreRelative: undefined,
      })
    })
  })
})
