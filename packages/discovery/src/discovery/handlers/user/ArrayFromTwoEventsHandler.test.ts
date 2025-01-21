import { EthereumAddress } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { type providers, utils } from 'ethers'

import type { IProvider } from '../../provider/IProvider'
import { ArrayFromTwoEventsHandler } from './ArrayFromTwoEventsHandler'

describe(ArrayFromTwoEventsHandler.name, () => {
  describe('constructor', () => {
    it('finds the specified events by name', () => {
      const handler = new ArrayFromTwoEventsHandler(
        'someName',
        {
          type: 'arrayFromTwoEvents',
          addEvent: 'OwnerAdded',
          addKey: 'account',
          removeEvent: 'OwnerRemoved',
          removeKey: 'account',
        },
        [
          'event OwnerAdded(address indexed account)',
          'event OwnerRemoved(address indexed account)',
        ],
      )
      expect(handler.getAddEvent()).toEqual(
        'event OwnerAdded(address indexed account)',
      )
      expect(handler.getRemoveEvent()).toEqual(
        'event OwnerRemoved(address indexed account)',
      )
    })

    it('throws an error if the addKey is missing', () => {
      expect(
        () =>
          new ArrayFromTwoEventsHandler(
            'someName',
            {
              type: 'arrayFromTwoEvents',
              addEvent: 'OwnerAdded',
              addKey: 'foo',
              removeEvent: 'OwnerRemoved',
              removeKey: 'account',
            },
            [
              'event OwnerAdded(address indexed account)',
              'event OwnerRemoved(address indexed account)',
            ],
          ),
      ).toThrow('Cannot find a matching event for OwnerAdded')
    })

    it('throws an error if the removeKey is missing', () => {
      expect(
        () =>
          new ArrayFromTwoEventsHandler(
            'someName',
            {
              type: 'arrayFromTwoEvents',
              addEvent: 'OwnerAdded',
              addKey: 'account',
              removeEvent: 'OwnerRemoved',
              removeKey: 'foo',
            },
            [
              'event OwnerAdded(address indexed account)',
              'event OwnerRemoved(address indexed account)',
            ],
          ),
      ).toThrow('Cannot find a matching event for OwnerRemoved')
    })

    it('throws an error if the add abi has missing fields', () => {
      expect(
        () =>
          new ArrayFromTwoEventsHandler(
            'someName',
            {
              type: 'arrayFromTwoEvents',
              addEvent: 'event OwnerAdded()',
              addKey: 'account',
              removeEvent: 'OwnerRemoved',
              removeKey: 'account',
            },
            ['event OwnerRemoved(address indexed account)'],
          ),
      ).toThrow('Invalid event abi')
    })

    it('throws an error if the remove abi has missing fields', () => {
      expect(
        () =>
          new ArrayFromTwoEventsHandler(
            'someName',
            {
              type: 'arrayFromTwoEvents',
              addEvent: 'OwnerAdded',
              addKey: 'account',
              removeEvent: 'event OwnerRemoved()',
              removeKey: 'account',
            },
            ['event OwnerAdded(address indexed account)'],
          ),
      ).toThrow('Invalid event abi')
    })
  })

  describe('execute', () => {
    const addEvent = 'event OwnerAdded(address indexed account)'
    const removeEvent = 'event OwnerRemoved(address indexed account)'
    const abi = new utils.Interface([addEvent, removeEvent])

    function OwnerAdded(account: EthereumAddress): providers.Log {
      return abi.encodeEventLog(abi.getEvent('OwnerAdded'), [
        account,
      ]) as providers.Log
    }

    function OwnerRemoved(account: EthereumAddress): providers.Log {
      return abi.encodeEventLog(abi.getEvent('OwnerRemoved'), [
        account,
      ]) as providers.Log
    }

    it('no logs', async () => {
      const address = EthereumAddress.random()
      const provider = mockObject<IProvider>({
        async getLogs(providedAddress, topics) {
          expect(providedAddress).toEqual(address)
          expect(topics).toEqual([
            [
              abi.getEventTopic('OwnerAdded'),
              abi.getEventTopic('OwnerRemoved'),
            ],
          ])
          return []
        },
      })

      const handler = new ArrayFromTwoEventsHandler(
        'someName',
        {
          type: 'arrayFromTwoEvents',
          addEvent,
          addKey: 'account',
          removeEvent,
          removeKey: 'account',
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
            OwnerAdded(Alice),
            OwnerAdded(Bob),
            OwnerAdded(Bob),
            OwnerRemoved(Bob),
            OwnerRemoved(Charlie),
            OwnerAdded(Bob),
          ]
        },
      })

      const handler = new ArrayFromTwoEventsHandler(
        'someName',
        {
          type: 'arrayFromTwoEvents',
          addEvent,
          addKey: 'account',
          removeEvent,
          removeKey: 'account',
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
  })
})
