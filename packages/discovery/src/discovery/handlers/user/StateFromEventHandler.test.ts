import { EthereumAddress } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { providers, utils } from 'ethers'

import { DiscoveryLogger } from '../../DiscoveryLogger'
import { DiscoveryProvider } from '../../provider/DiscoveryProvider'
import { StateFromEventHandler } from './StateFromEventHandler'

describe(StateFromEventHandler.name, () => {
  const BLOCK_NUMBER = 1234

  describe('constructor', () => {
    it('finds the specified event by name', () => {
      const handler = new StateFromEventHandler(
        'someName',
        {
          type: 'stateFromEvent',
          event: 'OwnerChanged',
          returnParams: ['account', 'status'],
        },
        ['event OwnerChanged(address indexed account, bool indexed status)'],
        DiscoveryLogger.SILENT,
      )
      expect(handler.getEvent()).toEqual(
        'event OwnerChanged(address indexed account, bool indexed status)',
      )
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

      const handler = new StateFromEventHandler(
        'someName',
        {
          type: 'stateFromEvent',
          event,
          returnParams: ['account', 'status'],
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

    it('many logs as array', async () => {
      const Alice = EthereumAddress.random()
      const Bob = EthereumAddress.random()
      const Charlie = EthereumAddress.random()

      const address = EthereumAddress.random()
      const provider = mockObject<DiscoveryProvider>({
        async getLogs() {
          return [
            OwnerChanged(Alice, true),
            OwnerChanged(Bob, true),
            OwnerChanged(Bob, false),
            OwnerChanged(Charlie, false),
            OwnerChanged(Bob, true),
          ]
        },
      })

      const handler = new StateFromEventHandler(
        'someName',
        {
          type: 'stateFromEvent',
          event,
          returnParams: ['account', 'status'],
        },
        [],
        DiscoveryLogger.SILENT,
      )
      const value = await handler.execute(provider, address, BLOCK_NUMBER)

      expect(value).toEqual({
        field: 'someName',
        value: [
          {
            account: Alice.toString(),
            status: true,
          },
          {
            account: Bob.toString(),
            status: true,
          },
          {
            account: Bob.toString(),
            status: false,
          },
          {
            account: Charlie.toString(),
            status: false,
          },
          {
            account: Bob.toString(),
            status: true,
          },
        ],
        ignoreRelative: undefined,
      })
    })

    it('many logs as object groupedBy', async () => {
      const Alice = EthereumAddress.random()
      const Bob = EthereumAddress.random()
      const Charlie = EthereumAddress.random()

      const address = EthereumAddress.random()
      const provider = mockObject<DiscoveryProvider>({
        async getLogs() {
          return [
            OwnerChanged(Alice, true),
            OwnerChanged(Bob, true),
            OwnerChanged(Bob, false),
            OwnerChanged(Charlie, false),
          ]
        },
      })

      const handler = new StateFromEventHandler(
        'someName',
        {
          type: 'stateFromEvent',
          event,
          returnParams: ['account', 'status'],
          groupBy: 'account',
        },
        [],
        DiscoveryLogger.SILENT,
      )
      const value = await handler.execute(provider, address, BLOCK_NUMBER)

      // expect just last event, since it overrides all props
      expect(value).toEqual({
        field: 'someName',
        value: {
          [Alice.toString()]: {
            account: Alice.toString(),
            status: true,
          },
          [Bob.toString()]: {
            account: Bob.toString(),
            status: false,
          },
          [Charlie.toString()]: {
            account: Charlie.toString(),
            status: false,
          },
        },
        ignoreRelative: undefined,
      })
    })

    it('passes ignoreRelative', async () => {
      const Alice = EthereumAddress.random()
      const address = EthereumAddress.random()
      const provider = mockObject<DiscoveryProvider>({
        async getLogs() {
          return [OwnerChanged(Alice, true)]
        },
      })

      const handler = new StateFromEventHandler(
        'someName',
        {
          type: 'stateFromEvent',
          event,
          returnParams: ['account', 'status'],
          ignoreRelative: true,
        },
        [],
        DiscoveryLogger.SILENT,
      )
      const value = await handler.execute(provider, address, BLOCK_NUMBER)
      expect(value).toEqual({
        field: 'someName',
        value: [
          {
            account: Alice.toString(),
            status: true,
          },
        ],
        ignoreRelative: true,
      })
    })
  })
})
