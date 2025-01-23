import { EthereumAddress } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { type providers, utils } from 'ethers'

import type { IProvider } from '../../provider/IProvider'
import { ArrayFromOneEventHandler } from './ArrayFromOneEventHandler'

describe(ArrayFromOneEventHandler.name, () => {
  describe('constructor', () => {
    it('finds the specified event by name', () => {
      const handler = new ArrayFromOneEventHandler(
        'someName',
        {
          type: 'arrayFromOneEvent',
          event: 'OwnerChanged',
          valueKey: 'account',
          flagKey: 'status',
        },
        ['event OwnerChanged(address indexed account, bool indexed status)'],
      )
      expect(handler.getEvent()).toEqual(
        'event OwnerChanged(address indexed account, bool indexed status)',
      )
    })

    it('throws an error if the value is missing', () => {
      expect(
        () =>
          new ArrayFromOneEventHandler(
            'someName',
            {
              type: 'arrayFromOneEvent',
              event: 'OwnerChanged',
              valueKey: 'foo',
              flagKey: 'status',
            },
            [
              'event OwnerChanged(address indexed account, bool indexed status)',
            ],
          ),
      ).toThrow('Cannot find a matching event for OwnerChanged')
    })

    it('throws an error if the flag is missing', () => {
      expect(
        () =>
          new ArrayFromOneEventHandler(
            'someName',
            {
              type: 'arrayFromOneEvent',
              event: 'OwnerChanged',
              valueKey: 'account',
              flagKey: 'foo',
            },
            [
              'event OwnerChanged(address indexed account, bool indexed status)',
            ],
          ),
      ).toThrow('Cannot find a matching event for OwnerChanged')
    })

    it('throws an error if abi has missing fields', () => {
      expect(
        () =>
          new ArrayFromOneEventHandler(
            'someName',
            {
              type: 'arrayFromOneEvent',
              event: 'event OwnerChanged()',
              valueKey: 'account',
              flagKey: 'status',
            },
            [],
          ),
      ).toThrow('Invalid event abi')
    })
  })

  describe('execute', () => {
    const event =
      'event OwnerChanged(address indexed account, bool indexed status)'
    const abi = new utils.Interface([event])

    function OwnerChanged(
      account: EthereumAddress,
      status: boolean,
    ): providers.Log {
      return abi.encodeEventLog(abi.getEvent('OwnerChanged'), [
        account,
        status,
      ]) as providers.Log
    }

    it('no logs', async () => {
      const address = EthereumAddress.random()
      const provider = mockObject<IProvider>({
        async getLogs(providedAddress, topics) {
          expect(providedAddress).toEqual(address)
          expect(topics).toEqual([abi.getEventTopic('OwnerChanged')])
          return []
        },
      })

      const handler = new ArrayFromOneEventHandler(
        'someName',
        {
          type: 'arrayFromOneEvent',
          event,
          valueKey: 'account',
          flagKey: 'status',
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
            OwnerChanged(Alice, true),
            OwnerChanged(Bob, true),
            OwnerChanged(Bob, true),
            OwnerChanged(Bob, false),
            OwnerChanged(Charlie, false),
            OwnerChanged(Bob, true),
          ]
        },
      })

      const handler = new ArrayFromOneEventHandler(
        'someName',
        {
          type: 'arrayFromOneEvent',
          event,
          valueKey: 'account',
          flagKey: 'status',
        },
        [],
      )
      const value = await handler.execute(provider, address)
      expect(value).toEqual({
        field: 'someName',
        value: [Alice.toString(), Bob.toString()],
        ignoreRelative: undefined,
      })
    })

    it('many logs inverted', async () => {
      const Alice = EthereumAddress.random()
      const Bob = EthereumAddress.random()
      const Charlie = EthereumAddress.random()

      const address = EthereumAddress.random()
      const provider = mockObject<IProvider>({
        async getLogs() {
          return [
            OwnerChanged(Alice, true),
            OwnerChanged(Bob, true),
            OwnerChanged(Bob, true),
            OwnerChanged(Bob, false),
            OwnerChanged(Charlie, false),
            OwnerChanged(Bob, true),
          ]
        },
      })

      const handler = new ArrayFromOneEventHandler(
        'someName',
        {
          type: 'arrayFromOneEvent',
          event,
          valueKey: 'account',
          flagKey: 'status',
          invert: true,
        },
        [],
      )
      const value = await handler.execute(provider, address)
      expect(value).toEqual({
        field: 'someName',
        value: [Charlie.toString()],
        ignoreRelative: undefined,
      })
    })

    it('many logs no flag', async () => {
      const Alice = EthereumAddress.random()
      const Bob = EthereumAddress.random()
      const Charlie = EthereumAddress.random()

      const address = EthereumAddress.random()
      const provider = mockObject<IProvider>({
        async getLogs() {
          return [
            OwnerChanged(Alice, true),
            OwnerChanged(Bob, true),
            OwnerChanged(Bob, true),
            OwnerChanged(Bob, false),
            OwnerChanged(Charlie, false),
            OwnerChanged(Bob, true),
          ]
        },
      })

      const handler = new ArrayFromOneEventHandler(
        'someName',
        {
          type: 'arrayFromOneEvent',
          event,
          valueKey: 'account',
        },
        [],
      )
      const value = await handler.execute(provider, address)
      expect(value).toEqual({
        field: 'someName',
        value: [Alice.toString(), Bob.toString(), Charlie.toString()],
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
            OwnerChanged(Alice, true),
            OwnerChanged(Bob, true),
            OwnerChanged(Bob, true),
            OwnerChanged(Bob, false),
            OwnerChanged(Charlie, false),
            OwnerChanged(Bob, true),
          ]
        },
      })

      const handler = new ArrayFromOneEventHandler(
        'someName',
        {
          type: 'arrayFromOneEvent',
          event,
          valueKey: 'account',
          flagKey: 'status',
          ignoreRelative: true,
        },
        [],
      )
      const value = await handler.execute(provider, address)
      expect(value).toEqual({
        field: 'someName',
        value: [Alice.toString(), Bob.toString()],
        ignoreRelative: true,
      })
    })

    it('works with different false and true values', async () => {
      const Alice = EthereumAddress.random()
      const Bob = EthereumAddress.random()
      const Charlie = EthereumAddress.random()

      const event = 'event OwnerUpdated(address account, uint8 role)'
      const abi = new utils.Interface([event])

      function OwnerUpdated(
        address: EthereumAddress,
        role: number,
      ): providers.Log {
        return abi.encodeEventLog(abi.getEvent('OwnerUpdated'), [
          address,
          role,
        ]) as providers.Log
      }

      const provider = mockObject<IProvider>({
        async getLogs() {
          return [
            OwnerUpdated(Alice, 1),
            OwnerUpdated(Bob, 1),
            OwnerUpdated(Bob, 0),
            OwnerUpdated(Bob, 2),
            OwnerUpdated(Charlie, 1),
            OwnerUpdated(Alice, 1),
          ]
        },
      })

      const handler = new ArrayFromOneEventHandler(
        'someName',
        {
          type: 'arrayFromOneEvent',
          event,
          valueKey: 'account',
          flagKey: 'role',
          flagTrueValues: [1],
          flagFalseValues: [0, 2],
        },
        [],
      )
      const value = await handler.execute(provider, EthereumAddress.random())
      expect(value).toEqual({
        field: 'someName',
        value: [Alice.toString(), Charlie.toString()],
        ignoreRelative: undefined,
      })
    })
  })
})
