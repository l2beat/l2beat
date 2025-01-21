import { EthereumAddress } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { type providers, utils } from 'ethers'

import type { IProvider } from '../../provider/IProvider'
import { ArrayFromOneEventWithArgHandler } from './ArrayFromOneEventWithArgHandler'

describe(ArrayFromOneEventWithArgHandler.name, () => {
  describe('constructor', () => {
    it('finds the specified event by name', () => {
      const handler = new ArrayFromOneEventWithArgHandler(
        'someName',
        {
          type: 'arrayFromOneEventWithArg',
          event: 'PermissionUpdate',
          valueKey: 'user',
          flagKey: 'allowed',
          arg: 'selector',
          argValue: '0x53228430',
        },
        [
          'event PermissionUpdate(address indexed user, bytes4 indexed selector, bool allowed)',
        ],
      )
      expect(handler.getEvent()).toEqual(
        'event PermissionUpdate(address indexed user, bytes4 indexed selector, bool allowed)',
      )
    })

    it('throws an error if the value is missing', () => {
      expect(
        () =>
          new ArrayFromOneEventWithArgHandler(
            'someName',
            {
              type: 'arrayFromOneEventWithArg',
              event: 'PermissionUpdate',
              valueKey: 'foo',
              flagKey: 'allowed',
              arg: 'selector',
              argValue: '0x53228430',
            },
            [
              'event PermissionUpdate(address indexed user, bytes4 indexed selector, bool allowed)',
            ],
          ),
      ).toThrow('Cannot find a matching event for PermissionUpdate')
    })

    it('throws an error if the flag is missing', () => {
      expect(
        () =>
          new ArrayFromOneEventWithArgHandler(
            'someName',
            {
              type: 'arrayFromOneEventWithArg',
              event: 'PermissionUpdate',
              valueKey: 'user',
              flagKey: 'foo',
              arg: 'selector',
              argValue: '0x53228430',
            },
            [
              'event PermissionUpdate(address indexed user, bytes4 indexed selector, bool allowed)',
            ],
          ),
      ).toThrow('Cannot find a matching event for PermissionUpdate')
    })

    it('throws an error if the arg is missing', () => {
      expect(
        () =>
          new ArrayFromOneEventWithArgHandler(
            'someName',
            {
              type: 'arrayFromOneEventWithArg',
              event: 'PermissionUpdate',
              valueKey: 'user',
              flagKey: 'allowed',
              arg: 'foo',
              argValue: '0x53228430',
            },
            [
              'event PermissionUpdate(address indexed user, bytes4 indexed selector, bool allowed)',
            ],
          ),
      ).toThrow('Cannot find a matching event for PermissionUpdate')
    })

    it('throws an error if abi has missing fields', () => {
      expect(
        () =>
          new ArrayFromOneEventWithArgHandler(
            'someName',
            {
              type: 'arrayFromOneEventWithArg',
              event: 'event PermissionUpdate()',
              valueKey: 'user',
              flagKey: 'allowed',
              arg: 'selector',
              argValue: '0x53228430',
            },
            [],
          ),
      ).toThrow('Invalid event abi')
    })
  })

  describe('execute', () => {
    const event =
      'event PermissionUpdate(address indexed user, bytes4 indexed selector, bool allowed)'
    const abi = new utils.Interface([event])

    function PermissionUpdate(
      user: EthereumAddress,
      selector: string,
      allowed: boolean,
    ): providers.Log {
      return abi.encodeEventLog(abi.getEvent('PermissionUpdate'), [
        user,
        selector,
        allowed,
      ]) as providers.Log
    }

    it('no logs', async () => {
      const address = EthereumAddress.random()
      const provider = mockObject<IProvider>({
        async getLogs(providedAddress, topics) {
          expect(providedAddress).toEqual(address)
          expect(topics).toEqual([abi.getEventTopic('PermissionUpdate')])
          return []
        },
      })

      const handler = new ArrayFromOneEventWithArgHandler(
        'someName',
        {
          type: 'arrayFromOneEventWithArg',
          event,
          valueKey: 'user',
          flagKey: 'allowed',
          arg: 'selector',
          argValue: '0x53228430',
        },
        [],
      )
      const value = await handler.execute(provider, address)
      expect(value).toEqual({
        field: 'someName',
        value: [],
        ignoreRelative: undefined,
      })
    })

    it('many logs', async () => {
      const Alice = EthereumAddress.random()
      const Bob = EthereumAddress.random()
      const Charlie = EthereumAddress.random()

      const address = EthereumAddress.random()
      const provider = mockObject<IProvider>({
        async getLogs() {
          return [
            PermissionUpdate(Alice, '0x53228430', true),
            PermissionUpdate(Bob, '0x53228430', true),
            PermissionUpdate(Bob, '0x53228430', false),
            PermissionUpdate(Charlie, '0x53228430', true),
            PermissionUpdate(Alice, '0x53228430', false),
            PermissionUpdate(Alice, '0x53228430', true),
            PermissionUpdate(Bob, '0x00000069', true),
          ]
        },
      })

      const handler = new ArrayFromOneEventWithArgHandler(
        'someName',
        {
          type: 'arrayFromOneEventWithArg',
          event,
          valueKey: 'user',
          flagKey: 'allowed',
          arg: 'selector',
          argValue: '0x53228430',
        },
        [],
      )
      const value = await handler.execute(provider, address)
      expect(value).toEqual({
        field: 'someName',
        value: [Charlie.toString(), Alice.toString()],
        ignoreRelative: undefined,
      })
    })

    it('passes ignoreRelative', async () => {
      const Alice = EthereumAddress.random()
      const Bob = EthereumAddress.random()
      const Charlie = EthereumAddress.random()

      const address = EthereumAddress.random()
      const provider = mockObject<IProvider>({
        async getLogs() {
          return [
            PermissionUpdate(Alice, '0x53228430', true),
            PermissionUpdate(Bob, '0x53228430', true),
            PermissionUpdate(Bob, '0x53228430', false),
            PermissionUpdate(Charlie, '0x53228430', true),
            PermissionUpdate(Alice, '0x53228430', false),
            PermissionUpdate(Alice, '0x53228430', true),
            PermissionUpdate(Bob, '0x00000069', true),
          ]
        },
      })

      const handler = new ArrayFromOneEventWithArgHandler(
        'someName',
        {
          type: 'arrayFromOneEventWithArg',
          event,
          valueKey: 'user',
          flagKey: 'allowed',
          arg: 'selector',
          argValue: '0x53228430',
          ignoreRelative: true,
        },
        [],
      )
      const value = await handler.execute(provider, address)
      expect(value).toEqual({
        field: 'someName',
        value: [Charlie.toString(), Alice.toString()],
        ignoreRelative: true,
      })
    })
  })
})
