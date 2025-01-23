import { EthereumAddress } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { type providers, utils } from 'ethers'

import type { IProvider } from '../../provider/IProvider'
import { StateFromEventTupleHandler } from './StateFromEventTupleHandler'

const EVENT =
  'event TupleEvent(tuple(uint32 eid, tuple(uint64 foo, uint8 bar, uint8 baz, uint8 qux) config)[] params)'

describe(StateFromEventTupleHandler.name, () => {
  describe('constructor', () => {
    it('finds the specified event by name', () => {
      const handler = new StateFromEventTupleHandler(
        'someName',
        {
          type: 'stateFromEventTuple',
          event: 'TupleEvent',
          returnParam: 'params',
        },
        [EVENT],
      )
      expect(handler.getEvent()).toEqual(EVENT)
    })
  })

  describe('execute', () => {
    const abi = new utils.Interface([EVENT])

    function TupleEvent(
      eid: number,
      config: {
        foo: number
        bar: number
        baz: number
        qux: number
      },
    ): providers.Log {
      const data = [[eid, [config.foo, config.bar, config.baz, config.qux]]]

      return abi.encodeEventLog(abi.getEvent('TupleEvent'), [
        data,
      ]) as providers.Log
    }

    it('no logs', async () => {
      const address = EthereumAddress.random()
      const provider = mockObject<IProvider>({
        async getLogs(providedAddress, topics) {
          expect(providedAddress).toEqual(address)
          expect(topics).toEqual([abi.getEventTopic('TupleEvent')])
          return []
        },
      })

      const handler = new StateFromEventTupleHandler(
        'someName',
        {
          type: 'stateFromEventTuple',
          event: EVENT,
          returnParam: 'params',
        },
        [],
      )
      const value = await handler.execute(provider, address)

      expect(value).toEqual({
        field: 'someName',
        value: {},
        ignoreRelative: undefined,
      })
    })

    it('many logs as array', async () => {
      const address = EthereumAddress.random()
      const provider = mockObject<IProvider>({
        async getLogs() {
          return [
            TupleEvent(1, {
              foo: 1,
              bar: 2,
              baz: 3,
              qux: 4,
            }),
            TupleEvent(2, {
              foo: 5,
              bar: 6,
              baz: 7,
              qux: 8,
            }),
            TupleEvent(3, {
              foo: 9,
              bar: 10,
              baz: 11,
              qux: 12,
            }),
            // Persist last
            TupleEvent(3, {
              foo: 20,
              bar: 20,
              baz: 20,
              qux: 20,
            }),
          ]
        },
      })

      const handler = new StateFromEventTupleHandler(
        'someName',
        {
          type: 'stateFromEventTuple',
          event: EVENT,
          returnParam: 'params',
        },
        [],
      )
      const value = await handler.execute(provider, address)

      expect(value).toEqual({
        field: 'someName',
        value: { '1': [1, 2, 3, 4], '2': [5, 6, 7, 8], '3': [20, 20, 20, 20] },
        ignoreRelative: undefined,
      })
    })

    it('many logs as array with param expansion', async () => {
      const address = EthereumAddress.random()
      const provider = mockObject<IProvider>({
        async getLogs() {
          return [
            TupleEvent(1, {
              foo: 1,
              bar: 2,
              baz: 3,
              qux: 4,
            }),
            TupleEvent(2, {
              foo: 5,
              bar: 6,
              baz: 7,
              qux: 8,
            }),
            TupleEvent(3, {
              foo: 9,
              bar: 10,
              baz: 11,
              qux: 12,
            }),
          ]
        },
      })

      const handler = new StateFromEventTupleHandler(
        'someName',
        {
          type: 'stateFromEventTuple',
          event: EVENT,
          returnParam: 'params',
          expandParam: 'config',
        },
        [],
      )
      const value = await handler.execute(provider, address)

      expect(value).toEqual({
        field: 'someName',
        value: {
          '1': {
            foo: 1,
            bar: 2,
            baz: 3,
            qux: 4,
          },
          '2': {
            foo: 5,
            bar: 6,
            baz: 7,
            qux: 8,
          },
          '3': {
            foo: 9,
            bar: 10,
            baz: 11,
            qux: 12,
          },
        },
        ignoreRelative: undefined,
      })
    })
  })
})
