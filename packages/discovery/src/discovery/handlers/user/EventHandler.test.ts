import { assert, ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { type providers, utils } from 'ethers'
import type { IProvider } from '../../provider/IProvider'
import { EventHandler, EventHandlerDefinition } from './EventHandler'

describe(EventHandler.name, () => {
  const stringABI = [
    'event CurrentBatchMultichain(uint256 batchIndex, uint256 chainId)',
    'event CurrentBatch2(uint256 batchIndex)',
    'event CurrentBatch(uint256 batchIndex)',
    'event CurrentBatchTimestamp(uint256 batchTimestamp)',
    'event Update(address user, bool added)',
    'event Add(address user)',
    'event Add2(address user)',
    'event Remove(address user)',
  ]

  const abi = new utils.Interface(stringABI)

  const event =
    <T extends unknown[]>(name: string) =>
    (...args: T) =>
      abi.encodeEventLog(
        abi.getEvent(name),
        args.map((k) =>
          ChainSpecificAddress.check(k as string)
            ? ChainSpecificAddress.address(k as ChainSpecificAddress)
            : k,
        ),
      ) as providers.Log

  const CurrentBatch = event<[number]>('CurrentBatch')
  const CurrentBatch2 = event<[number]>('CurrentBatch2')
  const CurrentBatchMultichain = event<[number, number]>(
    'CurrentBatchMultichain',
  )
  const Update = event<[ChainSpecificAddress, boolean]>('Update')
  const Add = event<[ChainSpecificAddress]>('Add')
  const Add2 = event<[ChainSpecificAddress]>('Add2')
  const Remove = event<[ChainSpecificAddress]>('Remove')

  const ADDRESS = ChainSpecificAddress.random()

  const getLogsStub = (events: providers.Log[]) => {
    return (
      _: ChainSpecificAddress,
      topics: (string | string[] | null)[],
    ): Promise<providers.Log[]> => {
      const topic0 = typeof topics[0] === 'string' ? topics[0] : topics[0]?.[0]
      assert(!!topic0)
      const result = events
        .map((e, i) => ({ ...e, blockNumber: i + 1 }))
        .filter((e) => e.topics[0] === topic0)

      return new Promise((resolve, _) => resolve(result))
    }
  }

  describe('adding and removing events', () => {
    it('handles multiple adds and single remove for the same user', async () => {
      const U1 = ChainSpecificAddress.random()
      const provider = mockObject<IProvider>({
        chain: 'ethereum',
        getLogs: getLogsStub([Add(U1), Add(U1), Remove(U1)]),
      })

      const handler = new EventHandler(
        'field',
        {
          type: 'event',
          select: 'user',
          add: { event: 'Add' },
          remove: { event: 'Remove' },
        },
        stringABI,
      )

      const result = await handler.execute(provider, ADDRESS)

      expect(result.value).toEqual([])
    })

    it('user added, removed, and added again', async () => {
      const U1 = ChainSpecificAddress.random()
      const provider = mockObject<IProvider>({
        chain: 'ethereum',
        getLogs: getLogsStub([Add(U1), Remove(U1), Add(U1)]),
      })

      const handler = new EventHandler(
        'field',
        {
          type: 'event',
          select: 'user',
          add: { event: 'Add' },
          remove: { event: 'Remove' },
        },
        stringABI,
      )

      const result = await handler.execute(provider, ADDRESS)

      expect(result.value).toEqual([ChainSpecificAddress.address(U1)])
    })

    it('two event setting one event unsetting', async () => {
      const U1 = ChainSpecificAddress.random()
      const U2 = ChainSpecificAddress.random()
      const provider = mockObject<IProvider>({
        chain: 'ethereum',
        getLogs: getLogsStub([Add(U1), Add(U2), Remove(U1), Add2(U2)]),
      })

      const handler = new EventHandler(
        'field',
        {
          type: 'event',
          select: 'user',
          add: { event: ['Add', 'Add2'] },
          remove: { event: 'Remove' },
        },
        stringABI,
      )

      const result = await handler.execute(provider, ADDRESS)

      expect(result.value).toEqual([ChainSpecificAddress.address(U2)])
    })

    it('one event setting one event unsetting', async () => {
      const U1 = ChainSpecificAddress.random()
      const U2 = ChainSpecificAddress.random()
      const provider = mockObject<IProvider>({
        chain: 'ethereum',
        getLogs: getLogsStub([Add(U1), Add(U2), Remove(U1), Add(U2)]),
      })

      const handler = new EventHandler(
        'field',
        {
          type: 'event',
          select: 'user',
          add: { event: 'Add' },
          remove: { event: 'Remove' },
        },
        stringABI,
      )

      const result = await handler.execute(provider, ADDRESS)

      expect(result.value).toEqual([ChainSpecificAddress.address(U2)])
    })

    it('single event with boolean flag', async () => {
      const U1 = ChainSpecificAddress.random()
      const U2 = ChainSpecificAddress.random()
      const provider = mockObject<IProvider>({
        chain: 'ethereum',
        getLogs: getLogsStub([
          Update(U1, true),
          Update(U2, true),
          Update(U1, false),
          Update(U2, true),
        ]),
      })

      const handler = new EventHandler(
        'field',
        {
          type: 'event',
          select: 'user',
          add: { event: 'Update', where: ['=', '#added', true] },
          remove: { event: 'Update', where: ['=', '#added', false] },
        },
        stringABI,
      )

      const result = await handler.execute(provider, ADDRESS)

      expect(result.value).toEqual([ChainSpecificAddress.address(U2)])
    })
  })

  describe('adding fetch', () => {
    it('multiple events with multiple values, grouped and filtered', async () => {
      const provider = mockObject<IProvider>({
        chain: 'ethereum',
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
          add: {
            event: 'CurrentBatchMultichain',
            where: ['!=', '#chainId', 2],
          },
          groupBy: 'chainId',
        },
        stringABI,
      )

      const result = await handler.execute(provider, ADDRESS)

      expect(result.value).toEqual({ 1: [1, 4], 2: [], 3: [42] })
    })

    it('multiple events with no matching filter', async () => {
      const provider = mockObject<IProvider>({
        chain: 'ethereum',
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
          add: { event: 'CurrentBatch', where: ['=', '#batchIndex', 4] },
        },
        stringABI,
      )

      const result = await handler.execute(provider, ADDRESS)

      expect(result.value).toEqual([])
    })

    it('multiple events with filter', async () => {
      const provider = mockObject<IProvider>({
        chain: 'ethereum',
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
          add: { event: 'CurrentBatch', where: ['!=', '#batchIndex', 3] },
        },
        stringABI,
      )

      const result = await handler.execute(provider, ADDRESS)

      expect(result.value).toEqual([1, 2])
    })

    it('multiple events', async () => {
      const provider = mockObject<IProvider>({
        chain: 'ethereum',
        getLogs: getLogsStub([CurrentBatch(1), CurrentBatch(2)]),
      })

      const handler = new EventHandler(
        'field',
        {
          type: 'event',
          select: ['batchIndex'],
          add: { event: 'CurrentBatch' },
        },
        stringABI,
      )

      const result = await handler.execute(provider, ADDRESS)

      expect(result.value).toEqual([1, 2])
    })

    it('single event', async () => {
      const provider = mockObject<IProvider>({
        chain: 'ethereum',
        getLogs: getLogsStub([CurrentBatch(1)]),
      })

      const handler = new EventHandler(
        'field',
        {
          type: 'event',
          select: ['batchIndex'],
          add: { event: 'CurrentBatch' },
        },
        stringABI,
      )

      const result = await handler.execute(provider, ADDRESS)

      expect(result.value).toEqual([1])
    })

    it('no events', async () => {
      const provider = mockObject<IProvider>({
        chain: 'ethereum',
        getLogs: getLogsStub([]),
      })

      const handler = new EventHandler(
        'field',
        {
          type: 'event',
          add: { event: 'CurrentBatch' },
        },
        stringABI,
      )

      const result = await handler.execute(provider, ADDRESS)
      expect(result.value).toEqual([])
    })
  })

  describe('setting fetch', () => {
    it('groups with some having no events after filtering', async () => {
      const provider = mockObject<IProvider>({
        chain: 'ethereum',
        getLogs: getLogsStub([
          CurrentBatchMultichain(1, 1),
          CurrentBatchMultichain(3, 3),
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

      expect(result.value).toEqual({ 1: 1, 3: 3 })
    })

    it('works on semi-compatible events', async () => {
      const provider = mockObject<IProvider>({
        chain: 'ethereum',
        getLogs: getLogsStub([CurrentBatch(1), CurrentBatchMultichain(2, 3)]),
      })

      const handler = new EventHandler(
        'field',
        {
          type: 'event',
          select: ['batchIndex'],
          set: { event: ['CurrentBatch', 'CurrentBatchMultichain'] },
        },
        stringABI,
      )

      const result = await handler.execute(provider, ADDRESS)

      expect(result.value).toEqual(2)
    })

    it('throws if ABI compatibility is not met', async () => {
      expect(() => {
        new EventHandler(
          'field',
          {
            type: 'event',
            set: { event: ['CurrentBatch2', 'CurrentBatchTimestamp'] },
          },
          stringABI,
        )
      }).toThrow('ABI compatibility error')
    })

    it('multiple events with multiple sources', async () => {
      const provider = mockObject<IProvider>({
        chain: 'ethereum',
        getLogs: getLogsStub([
          CurrentBatch2(1),
          CurrentBatch(2),
          CurrentBatch2(3),
        ]),
      })

      const handler = new EventHandler(
        'field',
        {
          type: 'event',
          select: ['batchIndex'],
          set: { event: ['CurrentBatch', 'CurrentBatch2'] },
        },
        stringABI,
      )

      const result = await handler.execute(provider, ADDRESS)

      expect(result.value).toEqual(3)
    })

    it('multiple events with multiple values, grouped and filtered', async () => {
      const provider = mockObject<IProvider>({
        chain: 'ethereum',
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
        chain: 'ethereum',
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
        chain: 'ethereum',
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
        chain: 'ethereum',
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
        chain: 'ethereum',
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
        chain: 'ethereum',
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
        chain: 'ethereum',
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
        chain: 'ethereum',
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
        chain: 'ethereum',
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
        chain: 'ethereum',
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
        chain: 'ethereum',
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

  describe('errors', () => {
    it('throws error when where clause references invalid parameter', async () => {
      const provider = mockObject<IProvider>({
        chain: 'ethereum',
        getLogs: getLogsStub([CurrentBatch(1)]),
      })
      const handler = new EventHandler(
        'field',
        {
          type: 'event',
          select: ['batchIndex'],
          add: { event: 'CurrentBatch', where: ['=', '#invalidParam', 4] },
        },
        stringABI,
      )

      await expect(async () =>
        handler.execute(provider, ADDRESS),
      ).toBeRejectedWith('Key not found in object')
    })

    it('throws error when select references invalid parameter', async () => {
      const provider = mockObject<IProvider>({
        chain: 'ethereum',
        getLogs: getLogsStub([CurrentBatch(1)]),
      })
      const handler = new EventHandler(
        'field',
        {
          type: 'event',
          select: ['invalidParam'],
          add: { event: 'CurrentBatch' },
        },
        stringABI,
      )

      await expect(
        async () => await handler.execute(provider, ADDRESS),
      ).toBeRejectedWith('Invalid extraction key [invalidParam], not defined')
    })

    it('throws if event is both adding and removing', async () => {
      const provider = mockObject<IProvider>({
        chain: 'ethereum',
        getLogs: getLogsStub([Update(ADDRESS, true)]),
      })

      const handler = new EventHandler(
        'field',
        {
          type: 'event',
          select: 'user',
          add: { event: 'Update', where: ['=', '#added', true] },
          remove: { event: 'Update', where: ['!=', '#added', false] },
        },
        stringABI,
      )

      await expect(
        async () => await handler.execute(provider, ADDRESS),
      ).toBeRejectedWith(
        'log entry cannot trigger both add AND remove actions simultaneously',
      )
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
