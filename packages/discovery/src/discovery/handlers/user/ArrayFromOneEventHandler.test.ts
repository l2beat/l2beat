import { EthereumAddress } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { providers, utils } from 'ethers'

import { DiscoveryLogger } from '../../DiscoveryLogger'
import { DiscoveryProvider } from '../../provider/DiscoveryProvider'
import { ArrayFromOneEventHandler } from './ArrayFromOneEventHandler'

describe(ArrayFromOneEventHandler.name, () => {
  const BLOCK_NUMBER = 1234

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
        DiscoveryLogger.SILENT,
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
            DiscoveryLogger.SILENT,
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
            DiscoveryLogger.SILENT,
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
            DiscoveryLogger.SILENT,
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
      const provider = mockObject<DiscoveryProvider>({
        async getLogs(providedAddress, topics, fromBlock, toBlock) {
          expect(providedAddress).toEqual(address)
          expect(topics).toEqual([abi.getEventTopic('OwnerChanged')])
          expect(fromBlock).toEqual(0)
          expect(toBlock).toEqual(BLOCK_NUMBER)
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
        DiscoveryLogger.SILENT,
      )
      const value = await handler.execute(provider, address, BLOCK_NUMBER)
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
      const provider = mockObject<DiscoveryProvider>({
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
        DiscoveryLogger.SILENT,
      )
      const value = await handler.execute(provider, address, BLOCK_NUMBER)
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
      const provider = mockObject<DiscoveryProvider>({
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
        DiscoveryLogger.SILENT,
      )
      const value = await handler.execute(provider, address, BLOCK_NUMBER)
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
      const provider = mockObject<DiscoveryProvider>({
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
        DiscoveryLogger.SILENT,
      )
      const value = await handler.execute(provider, address, BLOCK_NUMBER)
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
      const provider = mockObject<DiscoveryProvider>({
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
        DiscoveryLogger.SILENT,
      )
      const value = await handler.execute(provider, address, BLOCK_NUMBER)
      expect(value).toEqual({
        field: 'someName',
        value: [Alice.toString(), Bob.toString()],
        ignoreRelative: true,
      })
    })
  })
})
