import { ArrayFromOneEventReinterpretedHandler } from './ArrayFromOneEventReinterpretedHandler'
import { expect, mockObject } from 'earl'
import { providers, utils } from 'ethers'
import { DiscoveryLogger } from '../../DiscoveryLogger'
import { EthereumAddress } from '@l2beat/shared-pure'
import { DiscoveryProvider } from '../../provider/DiscoveryProvider'

describe(ArrayFromOneEventReinterpretedHandler.name, () => {
  const BLOCK_NUMBER = 1234

  describe('constructor', () => {
    it('finds the specified event by name', () => {
      const handler = new ArrayFromOneEventReinterpretedHandler(
        'someName',
        {
          type: 'arrayFromOneEventReinterpreted',
          event: 'event OwnerUpdated(address account, uint8 role)',
          valueKey: 'account',
          arg: 'role',
          argsTrue: [],
          argsFalse: [],
        },
        ['event OwnerUpdated(address account, uint8 role)'],
        DiscoveryLogger.SILENT,
      )
      expect(handler.getEvent()).toEqual(
        'event OwnerUpdated(address account, uint8 role)',
      )
    })

    it('throws an error if the value is missing', () => {
      expect(
        () =>
          new ArrayFromOneEventReinterpretedHandler(
            'someName',
            {
              type: 'arrayFromOneEventReinterpreted',
              event: 'event OwnerUpdated(address account, uint8 role)',
              valueKey: 'foo',
              arg: 'role',
              argsTrue: [],
              argsFalse: [],
            },
            ['event OwnerUpdated(address account, uint8 role)'],
            DiscoveryLogger.SILENT,
          ),
      ).toThrow('Invalid event abi')
    })

    it('throws an error if the arg is missing', () => {
      expect(
        () =>
          new ArrayFromOneEventReinterpretedHandler(
            'someName',
            {
              type: 'arrayFromOneEventReinterpreted',
              event: 'event OwnerUpdated(address account, uint8 role)',
              valueKey: 'account',
              arg: 'foo',
              argsTrue: [],
              argsFalse: [],
            },
            ['event OwnerUpdated(address account, uint8 role)'],
            DiscoveryLogger.SILENT,
          ),
      ).toThrow('Invalid event abi')
    })

    it('throws an error if abi has missing fields', () => {
      expect(
        () =>
          new ArrayFromOneEventReinterpretedHandler(
            'someName',
            {
              type: 'arrayFromOneEventReinterpreted',
              event: 'event OwnerUpdated(address account, uint8 role)',
              valueKey: 'account',
              arg: 'foo',
              argsTrue: [],
              argsFalse: [],
            },
            [],
            DiscoveryLogger.SILENT,
          ),
      ).toThrow('Invalid event abi')
    })
  })

  describe('execute', () => {
    const event = 'event OwnerUpdated(address account, uint8 role)'
    const abi = new utils.Interface([event])

    function OwnerUpdated(
      account: EthereumAddress,
      role: number,
    ): providers.Log {
      return abi.encodeEventLog(abi.getEvent('OwnerUpdated'), [
        account,
        role,
      ]) as providers.Log
    }

    it('no logs', async () => {
      const address = EthereumAddress.random()
      const provider = mockObject<DiscoveryProvider>({
        async getLogs(providedAddress, topics, fromBlock, toBlock) {
          expect(providedAddress).toEqual(address)
          expect(topics).toEqual([abi.getEventTopic('OwnerUpdated')])
          expect(fromBlock).toEqual(0)
          expect(toBlock).toEqual(BLOCK_NUMBER)
          return []
        },
      })

      const handler = new ArrayFromOneEventReinterpretedHandler(
        'someName',
        {
          type: 'arrayFromOneEventReinterpreted',
          event,
          valueKey: 'account',
          arg: 'role',
          argsTrue: [],
          argsFalse: [],
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
            OwnerUpdated(Alice, 0),
            OwnerUpdated(Bob, 1),
            OwnerUpdated(Alice, 2),
            OwnerUpdated(Bob, 2),
            OwnerUpdated(Charlie, 2),
            OwnerUpdated(Bob, 1),
          ]
        },
      })

      const handler = new ArrayFromOneEventReinterpretedHandler(
        'someName',
        {
          type: 'arrayFromOneEventReinterpreted',
          event,
          valueKey: 'account',
          arg: 'role',
          argsTrue: ['2'],
          argsFalse: ['0', '1'],
        },
        [],
        DiscoveryLogger.SILENT,
      )
      const value = await handler.execute(provider, address, BLOCK_NUMBER)
      expect(value).toEqual({
        field: 'someName',
        value: [Alice.toString(), Charlie.toString()],
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
            OwnerUpdated(Alice, 0),
            OwnerUpdated(Bob, 1),
            OwnerUpdated(Alice, 2),
            OwnerUpdated(Bob, 2),
            OwnerUpdated(Charlie, 2),
            OwnerUpdated(Bob, 1),
          ]
        },
      })

      const handler = new ArrayFromOneEventReinterpretedHandler(
        'someName',
        {
          type: 'arrayFromOneEventReinterpreted',
          event,
          valueKey: 'account',
          invert: true,
          arg: 'role',
          argsTrue: ['2'],
          argsFalse: ['0', '1'],
        },
        [],
        DiscoveryLogger.SILENT,
      )
      const value = await handler.execute(provider, address, BLOCK_NUMBER)
      expect(value).toEqual({
        field: 'someName',
        value: [Bob.toString()],
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
            OwnerUpdated(Alice, 0),
            OwnerUpdated(Bob, 1),
            OwnerUpdated(Alice, 2),
            OwnerUpdated(Bob, 2),
            OwnerUpdated(Charlie, 2),
            OwnerUpdated(Bob, 1),
          ]
        },
      })

      const handler = new ArrayFromOneEventReinterpretedHandler(
        'someName',
        {
          type: 'arrayFromOneEventReinterpreted',
          event,
          valueKey: 'account',
          ignoreRelative: true,
          arg: 'role',
          argsTrue: ['2'],
          argsFalse: ['0', '1'],
        },
        [],
        DiscoveryLogger.SILENT,
      )
      const value = await handler.execute(provider, address, BLOCK_NUMBER)
      expect(value).toEqual({
        field: 'someName',
        value: [Alice.toString(), Charlie.toString()],
        ignoreRelative: true,
      })
    })
  })
})
