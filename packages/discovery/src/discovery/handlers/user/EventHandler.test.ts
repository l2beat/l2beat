import { assert, EthereumAddress } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { type providers, utils } from 'ethers'
import type { IProvider } from '../../provider/IProvider'
import { EventHandler, EventHandlerDefinition } from './EventHandler'

describe(EventHandler.name, () => {
  const stringABI = [
    'event CurrentBatchMultichain(uint256 batchIndex, uint256 chainId)',
    'event CurrentBatch(uint256 batchIndex)',
  ]

  const abi = new utils.Interface(stringABI)

  const event =
    <T extends unknown[]>(name: string) =>
    (...args: T) =>
      abi.encodeEventLog(abi.getEvent(name), args) as providers.Log

  const CurrentBatch = event<[number]>('CurrentBatch')
  const CurrentBatchMultichain = event<[number, number]>(
    'CurrentBatchMultichain',
  )

  const ADDRESS = EthereumAddress.random()

  const getLogsStub = (events: providers.Log[]) => {
    return (
      _: EthereumAddress,
      topics: (string | string[] | null)[],
    ): Promise<providers.Log[]> => {
      const topic0 = typeof topics[0] === 'string' ? topics[0] : topics[0]?.[0]
      assert(!!topic0)
      const result = events.filter((e) => e.topics[0] === topic0)

      return new Promise((resolve, _) => resolve(result))
    }
  }

  describe('setting fetch', () => {
    it('multiple events with multiple values, grouped and filtered', async () => {
      const provider = mockObject<IProvider>({
        getLogs: getLogsStub([
          CurrentBatchMultichain(1, 1),
          CurrentBatchMultichain(2, 2),
          CurrentBatchMultichain(3, 2),
          CurrentBatchMultichain(4, 1),
          CurrentBatchMultichain(42, 3),
        ]),
      })

      const handler = new EventHandler(
        'field',
        {
          type: 'event',
          select: ['batchIndex'],
          set: {
            event: 'CurrentBatchMultichain',
            where: ['!=', '#chainId', 2],
          },
          groupBy: 'chainId',
        },
        stringABI,
      )

      const result = await handler.execute(provider, ADDRESS)

      expect(result.value).toEqual({ 1: 4, 2: undefined, 3: 42 })
    })

    it('multiple events with multiple values, grouped and filtered', async () => {
      const provider = mockObject<IProvider>({
        getLogs: getLogsStub([
          CurrentBatchMultichain(1, 1),
          CurrentBatchMultichain(2, 2),
          CurrentBatchMultichain(3, 2),
          CurrentBatchMultichain(8, 2),
          CurrentBatchMultichain(4, 1),
          CurrentBatchMultichain(42, 3),
          CurrentBatchMultichain(8, 3),
        ]),
      })

      const handler = new EventHandler(
        'field',
        {
          type: 'event',
          select: ['batchIndex'],
          set: {
            event: 'CurrentBatchMultichain',
            where: ['!=', '#batchIndex', 8],
          },
          groupBy: 'chainId',
        },
        stringABI,
      )

      const result = await handler.execute(provider, ADDRESS)

      expect(result.value).toEqual({ 1: 4, 2: 3, 3: 42 })
    })

    it('multiple events with multiple values, grouped', async () => {
      const provider = mockObject<IProvider>({
        getLogs: getLogsStub([
          CurrentBatchMultichain(1, 1),
          CurrentBatchMultichain(2, 2),
          CurrentBatchMultichain(3, 2),
          CurrentBatchMultichain(4, 1),
          CurrentBatchMultichain(42, 3),
        ]),
      })

      const handler = new EventHandler(
        'field',
        {
          type: 'event',
          select: ['batchIndex'],
          set: { event: 'CurrentBatchMultichain' },
          groupBy: 'chainId',
        },
        stringABI,
      )

      const result = await handler.execute(provider, ADDRESS)

      expect(result.value).toEqual({ 1: 4, 2: 3, 3: 42 })
    })

    it('multiple events with multiple values filtered', async () => {
      const provider = mockObject<IProvider>({
        getLogs: getLogsStub([
          CurrentBatchMultichain(1, 3),
          CurrentBatchMultichain(2, 3),
          CurrentBatchMultichain(3, 2),
        ]),
      })

      const handler = new EventHandler(
        'field',
        {
          type: 'event',
          select: ['batchIndex'],
          set: { event: 'CurrentBatchMultichain', where: ['=', '#chainId', 3] },
        },
        stringABI,
      )

      const result = await handler.execute(provider, ADDRESS)

      expect(result.value).toEqual(2)
    })

    it('multiple events multiple values', async () => {
      const provider = mockObject<IProvider>({
        getLogs: getLogsStub([
          CurrentBatchMultichain(1, 1),
          CurrentBatchMultichain(2, 4),
        ]),
      })

      const handler = new EventHandler(
        'field',
        {
          type: 'event',
          select: ['batchIndex', 'chainId'],
          set: { event: 'CurrentBatchMultichain' },
        },
        stringABI,
      )

      const result = await handler.execute(provider, ADDRESS)

      expect(result.value).toEqual({ batchIndex: 2, chainId: 4 })
    })

    it('single event multiple values', async () => {
      const provider = mockObject<IProvider>({
        getLogs: getLogsStub([CurrentBatchMultichain(1, 1)]),
      })

      const handler = new EventHandler(
        'field',
        {
          type: 'event',
          select: ['batchIndex', 'chainId'],
          set: { event: 'CurrentBatchMultichain' },
        },
        stringABI,
      )

      const result = await handler.execute(provider, ADDRESS)

      expect(result.value).toEqual({ batchIndex: 1, chainId: 1 })
    })

    it('multiple events with no matching filter', async () => {
      const provider = mockObject<IProvider>({
        getLogs: getLogsStub([
          CurrentBatch(1),
          CurrentBatch(2),
          CurrentBatch(3),
        ]),
      })

      const handler = new EventHandler(
        'field',
        {
          type: 'event',
          select: ['batchIndex'],
          set: { event: 'CurrentBatch', where: ['=', '#batchIndex', 4] },
        },
        stringABI,
      )

      const result = await handler.execute(provider, ADDRESS)

      expect(result.value).toEqual(undefined)
    })

    it('multiple events with filter', async () => {
      const provider = mockObject<IProvider>({
        getLogs: getLogsStub([
          CurrentBatch(1),
          CurrentBatch(2),
          CurrentBatch(3),
        ]),
      })

      const handler = new EventHandler(
        'field',
        {
          type: 'event',
          select: ['batchIndex'],
          set: { event: 'CurrentBatch', where: ['!=', '#batchIndex', 3] },
        },
        stringABI,
      )

      const result = await handler.execute(provider, ADDRESS)

      expect(result.value).toEqual(2)
    })

    it('multiple events', async () => {
      const provider = mockObject<IProvider>({
        getLogs: getLogsStub([CurrentBatch(1), CurrentBatch(2)]),
      })

      const handler = new EventHandler(
        'field',
        {
          type: 'event',
          select: ['batchIndex'],
          set: { event: 'CurrentBatch' },
        },
        stringABI,
      )

      const result = await handler.execute(provider, ADDRESS)

      expect(result.value).toEqual(2)
    })

    it('single event', async () => {
      const provider = mockObject<IProvider>({
        getLogs: getLogsStub([CurrentBatch(1)]),
      })

      const handler = new EventHandler(
        'field',
        {
          type: 'event',
          select: ['batchIndex'],
          set: { event: 'CurrentBatch' },
        },
        stringABI,
      )

      const result = await handler.execute(provider, ADDRESS)

      expect(result.value).toEqual(1)
    })

    it('no events', async () => {
      const provider = mockObject<IProvider>({
        getLogs: getLogsStub([]),
      })

      const handler = new EventHandler(
        'field',
        {
          type: 'event',
          select: ['batchIndex'],
          set: { event: 'CurrentBatch' },
        },
        stringABI,
      )

      const result = await handler.execute(provider, ADDRESS)

      expect(result.value).toEqual(undefined)
    })
  })

  describe('validation', () => {
    const action = () => ({ event: '' })

    it('failure cases', () => {
      const failures = [
        { type: 'event', remove: action() },
        { type: 'event', set: action(), add: action() },
        { type: 'event', set: action(), remove: action() },
        { type: 'event', set: action(), add: action(), remove: action() },
      ]

      for (const failure of failures) {
        expect(EventHandlerDefinition.safeParse(failure).success).toBeFalsy()
      }
    })

    it('success with add remove', () => {
      const v = {
        type: 'event',
        add: action(),
        remove: action(),
      }

      expect(EventHandlerDefinition.safeParse(v).success).toBeTruthy()
    })

    it('success with only add', () => {
      const v = { type: 'event', add: action() }

      expect(EventHandlerDefinition.safeParse(v).success).toBeTruthy()
    })

    it('success with only set', () => {
      const v = { type: 'event', set: action() }

      expect(EventHandlerDefinition.safeParse(v).success).toBeTruthy()
    })

    it("failure if you don't set anything", () => {
      const v = { type: 'event' }

      expect(EventHandlerDefinition.safeParse(v).success).toBeFalsy()
    })
  })
})
