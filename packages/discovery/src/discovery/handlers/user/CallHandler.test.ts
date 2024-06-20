import { EthereumAddress } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'

import { DiscoveryLogger } from '../../DiscoveryLogger'
import { IProvider } from '../../provider/IProvider'
import { EXEC_REVERT_MSG } from '../utils/callMethod'
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
        DiscoveryLogger.SILENT,
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
        DiscoveryLogger.SILENT,
      )

      expect(handler.dependencies).toEqual(['foo', 'bar'])
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
        DiscoveryLogger.SILENT,
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
            DiscoveryLogger.SILENT,
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
            DiscoveryLogger.SILENT,
          ),
      ).toThrow('Invalid method abi')
    })

    it('finds the method by field name', () => {
      const handler = new CallHandler(
        'someName',
        { type: 'call', args: [] },
        [
          'function foo() view returns (uint256)',
          'function someName(uint256 i) view returns (uint256)',
          'function someName(uint256 a, uint256 b) view returns (uint256)',
          'function someName() view returns (uint256)',
        ],
        DiscoveryLogger.SILENT,
      )

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
        DiscoveryLogger.SILENT,
      )

      expect(handler.getMethod()).toEqual(
        'function someName(uint256 a, uint256 b) view returns (uint256)',
      )
    })

    it('throws if it cannot find the method by field name', () => {
      expect(
        () =>
          new CallHandler(
            'someName',
            { type: 'call', args: [] },
            [
              'function foo(uint256 i) view returns (uint256)',
              'function someName(uint256 i) view returns (uint256)',
              'function someName(uint256 a, uint256 b) view returns (uint256)',
            ],
            DiscoveryLogger.SILENT,
          ),
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
        DiscoveryLogger.SILENT,
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
            DiscoveryLogger.SILENT,
          ),
      ).toThrow('Cannot find a matching method for bar')
    })
  })

  describe('execute', () => {
    const method = 'function add(uint256 a, uint256 b) view returns (uint256)'
    const address = EthereumAddress.random()

    it('calls the method with the provided parameters', async () => {
      const provider = mockObject<IProvider>({
        async callMethod<T>(
          passedAddress: EthereumAddress,
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
        DiscoveryLogger.SILENT,
      )
      const result = await handler.execute(provider, address, {})
      expect(result).toEqual({
        field: 'add',
        value: 3,
        ignoreRelative: undefined,
      })
    })

    it('calls the method with the resolved parameters', async () => {
      const provider = mockObject<IProvider>({
        async callMethod<T>(
          passedAddress: EthereumAddress,
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
        DiscoveryLogger.SILENT,
      )
      const result = await handler.execute(provider, address, {
        foo: { field: 'foo', value: 1 },
        bar: { field: 'bar', value: 2 },
      })
      expect(result).toEqual({
        field: 'add',
        value: 3,
        ignoreRelative: undefined,
      })
    })

    it('handles errors', async () => {
      const provider = mockObject<IProvider>({
        async callMethod() {
          throw new Error('oops')
        },
      })

      const handler = new CallHandler(
        'add',
        { type: 'call', method, args: [1, 2] },
        [],
        DiscoveryLogger.SILENT,
      )
      const result = await handler.execute(provider, address, {})
      expect(result).toEqual({
        field: 'add',
        error: 'oops',
        ignoreRelative: undefined,
      })
    })

    it('passes ignoreRelative', async () => {
      const provider = mockObject<IProvider>({
        async callMethod<T>() {
          return 3 as T
        },
      })

      const handler = new CallHandler(
        'add',
        { type: 'call', method, args: [1, 2], ignoreRelative: true },
        [],
        DiscoveryLogger.SILENT,
      )
      const result = await handler.execute(provider, address, {})
      expect(result).toEqual({
        field: 'add',
        value: 3,
        ignoreRelative: true,
      })
    })

    it('should catch revert error', async () => {
      const provider = mockObject<IProvider>({
        async callMethod() {
          return undefined
        },
      })

      const handler = new CallHandler(
        'add',
        { type: 'call', method, args: [1, 2], expectRevert: true },
        [],
        DiscoveryLogger.SILENT,
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
        async callMethod() {
          return undefined
        },
      })

      const handler = new CallHandler(
        'add',
        { type: 'call', method, args: [1, 2], expectRevert: false },
        [],
        DiscoveryLogger.SILENT,
      )
      const result = await handler.execute(provider, address, {})
      expect(result).toEqual({
        field: 'add',
        error: EXEC_REVERT_MSG,
        ignoreRelative: undefined,
      })
    })
  })
})
