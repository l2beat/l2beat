import { EthereumAddress } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { providers, utils } from 'ethers'
import { IProvider } from '../../provider/IProvider'
import { EventHandler } from './EventHandler'

describe.only(EventHandler.name, () => {
  const stringAbi = [
    'event OwnerChanged(address indexed account, bool indexed status, uint256 id)',
    'event OwnerFlipped(address indexed account, bool indexed status, uint256 id)',
    'event OwnerFlopped(address indexed account, bool indexed status, uint256 id)',
    'event Event2(address indexed account, uint256 id)',
    'event Event3(address indexed account, uint256 id, bool foo)',
    'event Event4(address indexed account, uint256 id, bool bar, uint256 foo)',
    'event BatchAdded(uint256 batchIndex)',
  ]

  const abi = new utils.Interface(stringAbi)

  const event =
    <T extends unknown[]>(name: string) =>
    (...args: T) =>
      abi.encodeEventLog(abi.getEvent(name), args) as providers.Log

  const OwnerChanged = event<[EthereumAddress, boolean, number]>('OwnerChanged')
  const OwnerFlipped = event<[EthereumAddress, boolean, number]>('OwnerFlipped')
  const OwnerFlopped = event<[EthereumAddress, boolean, number]>('OwnerFlopped')
  const Event2 = event<[EthereumAddress, number]>('Event2')
  const Event3 = event<[EthereumAddress, number, boolean]>('Event3')
  const Event4 = event<[EthereumAddress, number, boolean, number]>('Event4')
  const BatchAdded = event<[number]>('BatchAdded')

  const ADDRESS = EthereumAddress.random()

  it('distinct on a multiple keys and select', async () => {
    const values = [
      { account: EthereumAddress.random(), status: true, id: 0 },
      { account: EthereumAddress.random(), status: false, id: 1 },
      { account: EthereumAddress.random(), status: false, id: 2 },
      { account: EthereumAddress.random(), status: true, id: 0 },
      { account: EthereumAddress.random(), status: true, id: 1 },
      { account: EthereumAddress.random(), status: false, id: 2 },
    ]

    const encoders = [OwnerChanged, OwnerFlipped, OwnerFlopped]
    const events = values.map((v, i) =>
      encoders[i % encoders.length]!(v.account, v.status, v.id),
    )

    const provider = mockObject<IProvider>({
      getLogs: mockFn().returnsOnce(events),
    })

    const handler = new EventHandler(
      'field',
      {
        type: 'event',
        events: ['OwnerChanged', 'OwnerFlipped', 'OwnerFlopped'],
        select: ['account', 'status'],
        distinct: ['status', 'id'],
      },
      stringAbi,
    )
    const result = await handler.execute(provider, ADDRESS)

    const expected = [...values.slice(0, 3), values[4]!]
    expect(result.value).toEqual(expected.map((v) => ({ account: v.account, status: v.status })))
  })

  it('distinct on a multiple keys', async () => {
    const values = [
      { account: EthereumAddress.random(), status: true, id: 0 },
      { account: EthereumAddress.random(), status: false, id: 1 },
      { account: EthereumAddress.random(), status: false, id: 2 },
      { account: EthereumAddress.random(), status: true, id: 0 },
      { account: EthereumAddress.random(), status: true, id: 1 },
      { account: EthereumAddress.random(), status: false, id: 2 },
    ]

    const encoders = [OwnerChanged, OwnerFlipped, OwnerFlopped]
    const events = values.map((v, i) =>
      encoders[i % encoders.length]!(v.account, v.status, v.id),
    )

    const provider = mockObject<IProvider>({
      getLogs: mockFn().returnsOnce(events),
    })

    const handler = new EventHandler(
      'field',
      {
        type: 'event',
        events: ['OwnerChanged', 'OwnerFlipped', 'OwnerFlopped'],
        distinct: ['status', 'id'],
      },
      stringAbi,
    )
    const result = await handler.execute(provider, ADDRESS)

    expect(result.value).toEqual([...values.slice(0, 3), values[4]!])
  })

  it('distinct on a single key', async () => {
    const values = [
      { account: EthereumAddress.random(), status: true, id: 0 },
      { account: EthereumAddress.random(), status: false, id: 1 },
      { account: EthereumAddress.random(), status: false, id: 2 },
      { account: EthereumAddress.random(), status: true, id: 0 },
      { account: EthereumAddress.random(), status: true, id: 1 },
      { account: EthereumAddress.random(), status: false, id: 2 },
    ]

    const encoders = [OwnerChanged, OwnerFlipped, OwnerFlopped]
    const events = values.map((v, i) =>
      encoders[i % encoders.length]!(v.account, v.status, v.id),
    )

    const provider = mockObject<IProvider>({
      getLogs: mockFn().returnsOnce(events),
    })

    const handler = new EventHandler(
      'field',
      {
        type: 'event',
        events: ['OwnerChanged', 'OwnerFlipped', 'OwnerFlopped'],
        distinct: 'status',
      },
      stringAbi,
    )
    const result = await handler.execute(provider, ADDRESS)

    expect(result.value).toEqual(values.slice(0, 2))
  })

  it('select multiple keys multiple instances multiple events', async () => {
    const values = [
      { account: EthereumAddress.random(), status: true, id: 0 },
      { account: EthereumAddress.random(), status: false, id: 1 },
      { account: EthereumAddress.random(), status: false, id: 2 },
      { account: EthereumAddress.random(), status: true, id: 3 },
      { account: EthereumAddress.random(), status: true, id: 4 },
      { account: EthereumAddress.random(), status: false, id: 5 },
    ]

    const encoders = [OwnerChanged, OwnerFlipped, OwnerFlopped]
    const events = values.map((v, i) =>
      encoders[i % encoders.length]!(v.account, v.status, v.id),
    )

    const provider = mockObject<IProvider>({
      getLogs: mockFn().returnsOnce(events),
    })

    const handler = new EventHandler(
      'field',
      {
        type: 'event',
        events: ['OwnerChanged', 'OwnerFlipped', 'OwnerFlopped'],
        select: ['account', 'status'],
      },
      stringAbi,
    )
    const result = await handler.execute(provider, ADDRESS)

    expect(result.value).toEqual(
      values.map((v) => ({ account: v.account, status: v.status })),
    )
  })

  it('select single key multiple instances multiple events', async () => {
    const values = [
      { account: EthereumAddress.random(), status: true, id: 0 },
      { account: EthereumAddress.random(), status: false, id: 1 },
      { account: EthereumAddress.random(), status: false, id: 2 },
      { account: EthereumAddress.random(), status: true, id: 3 },
      { account: EthereumAddress.random(), status: true, id: 4 },
      { account: EthereumAddress.random(), status: false, id: 5 },
    ]

    const encoders = [OwnerChanged, OwnerFlipped, OwnerFlopped]
    const events = values.map((v, i) =>
      encoders[i % encoders.length]!(v.account, v.status, v.id),
    )

    const provider = mockObject<IProvider>({
      getLogs: mockFn().returnsOnce(events),
    })

    const handler = new EventHandler(
      'field',
      {
        type: 'event',
        events: ['OwnerChanged', 'OwnerFlipped', 'OwnerFlopped'],
        select: 'account',
      },
      stringAbi,
    )
    const result = await handler.execute(provider, ADDRESS)

    expect(result.value).toEqual(values.map((v) => v.account))
  })

  it('entire event multiple instances compatibility', async () => {
    const values = [
      { account: EthereumAddress.random(), id: 42, foo: false },
      { account: EthereumAddress.random(), id: 69 },
      { account: EthereumAddress.random(), id: 420, foo: true },
      { account: EthereumAddress.random(), id: 1337, bar: false, foo: 0 },
      { account: EthereumAddress.random(), id: 1970, bar: false, foo: 1 },
      { account: EthereumAddress.random(), id: 1984 },
      { account: EthereumAddress.random(), id: 9001, bar: false, foo: 2 },
    ] as const

    const events = [
      Event3(values[0].account, values[0].id, values[0].foo),
      Event2(values[1].account, values[1].id),
      Event3(values[2].account, values[2].id, values[2].foo),
      Event4(values[3].account, values[3].id, values[3].bar, values[3].foo),
      Event4(values[4].account, values[4].id, values[4].bar, values[4].foo),
      Event2(values[5].account, values[5].id),
      Event4(values[6].account, values[6].id, values[6].bar, values[6].foo),
    ]

    const provider = mockObject<IProvider>({
      getLogs: mockFn().returnsOnce(events),
    })

    const handler = new EventHandler(
      'field',
      { type: 'event', events: ['Event2', 'Event3', 'Event4'] },
      stringAbi,
    )
    const result = await handler.execute(provider, ADDRESS)

    const compatibilityIntersection = values.map((v) => ({
      account: v.account,
      id: v.id,
    }))

    expect(result.value).toEqual(compatibilityIntersection)
  })

  it('entire event multiple instances only one input', async () => {
    const values = [42, 1970, 1337]
    const events = values.map((v) => BatchAdded(v))

    const provider = mockObject<IProvider>({
      getLogs: mockFn().returnsOnce(events),
    })

    const handler = new EventHandler(
      'field',
      { type: 'event', events: 'BatchAdded' },
      stringAbi,
    )
    const result = await handler.execute(provider, ADDRESS)

    expect(result.value).toEqual(values)
  })

  it('entire event single instance only one input', async () => {
    const value = 42
    const event = BatchAdded(value)

    const provider = mockObject<IProvider>({
      getLogs: mockFn().returnsOnce([event]),
    })

    const handler = new EventHandler(
      'field',
      { type: 'event', events: 'BatchAdded' },
      stringAbi,
    )
    const result = await handler.execute(provider, ADDRESS)

    expect(result.value).toEqual([value])
  })

  it('does not throw if exists a compatibility between events', async () => {
    const stringAbi = [
      'event OwnerChanged(address indexed account, bool indexed status)',
      'event OwnerId(address indexed account, uint256 indexed id)',
      'event OwnerLater(uint256 count,ADDRESS indexed account)',
      'event OwnerSomething(address indexed account)',
    ]

    expect(
      () =>
        new EventHandler(
          'field',
          { type: 'event', events: ['OwnerChanged', 'OwnerChangedId'] },
          stringAbi,
        ),
    ).not.toThrow('ABI between events is not compatible')
  })

  it('throws if multiple events have mismatch input with one empty', async () => {
    const stringAbi = [
      'event Empty()',
      'event OwnerChanged(address indexed account, bool indexed status)',
      'event OwnerChangedId(address indexed account, bool indexed status)',
    ]

    expect(
      () =>
        new EventHandler(
          'field',
          {
            type: 'event',
            events: ['OwnerChanged', 'OwnerChangedId', 'Empty'],
          },
          stringAbi,
        ),
    ).toThrow('ABI between events is not compatible')
  })

  it('throws if multiple events have mismatch input on type', async () => {
    const stringAbi = [
      'event OwnerChanged(address indexed account, bool indexed status)',
      'event OwnerChangedId(uint256 indexed accountId, bool indexed status)',
    ]

    expect(
      () =>
        new EventHandler(
          'field',
          { type: 'event', events: ['OwnerChanged', 'OwnerChangedId'] },
          stringAbi,
        ),
    ).toThrow('ABI between events is not compatible')
  })

  it('entire event multiple instances multiple events', async () => {
    const values = [
      { account: EthereumAddress.random(), status: true, id: 0 },
      { account: EthereumAddress.random(), status: false, id: 1 },
      { account: EthereumAddress.random(), status: false, id: 2 },
      { account: EthereumAddress.random(), status: true, id: 3 },
      { account: EthereumAddress.random(), status: true, id: 4 },
      { account: EthereumAddress.random(), status: false, id: 5 },
    ]

    const encoders = [OwnerChanged, OwnerFlipped, OwnerFlopped]
    const events = values.map((v, i) =>
      encoders[i % encoders.length]!(v.account, v.status, v.id),
    )

    const provider = mockObject<IProvider>({
      getLogs: mockFn().returnsOnce(events),
    })

    const handler = new EventHandler(
      'field',
      {
        type: 'event',
        events: ['OwnerChanged', 'OwnerFlipped', 'OwnerFlopped'],
      },
      stringAbi,
    )
    const result = await handler.execute(provider, ADDRESS)

    expect(result.value).toEqual(values)
  })

  it('entire event multiple instances', async () => {
    const values = [
      { account: EthereumAddress.random(), status: true, id: 0 },
      { account: EthereumAddress.random(), status: false, id: 1 },
      { account: EthereumAddress.random(), status: false, id: 2 },
    ]
    const events = values.map((v) => OwnerChanged(v.account, v.status, v.id))

    const provider = mockObject<IProvider>({
      getLogs: mockFn().returnsOnce(events),
    })

    const handler = new EventHandler(
      'field',
      { type: 'event', events: 'OwnerChanged' },
      stringAbi,
    )
    const result = await handler.execute(provider, ADDRESS)

    expect(result.value).toEqual(values)
  })

  it('entire event single instance', async () => {
    const value = { account: EthereumAddress.random(), status: true, id: 0 }
    const event = OwnerChanged(value.account, value.status, value.id)

    const provider = mockObject<IProvider>({
      getLogs: mockFn().returnsOnce([event]),
    })

    const handler = new EventHandler(
      'field',
      { type: 'event', events: 'OwnerChanged' },
      stringAbi,
    )
    const result = await handler.execute(provider, ADDRESS)

    expect(result.value).toEqual([value])
  })

  it('passes down ignoreRelative', async () => {
    const provider = mockObject<IProvider>({
      getLogs: mockFn().returnsOnce([]),
    })

    const handler = new EventHandler(
      'field',
      { type: 'event', events: 'OwnerChanged', ignoreRelative: true },
      stringAbi,
    )

    const result = await handler.execute(provider, ADDRESS)
    expect(result.ignoreRelative).toBeTruthy()
  })

  it('nothing if no events', async () => {
    const provider = mockObject<IProvider>({
      getLogs: mockFn().returnsOnce([]),
    })

    const handler = new EventHandler(
      'field',
      { type: 'event', events: 'OwnerChanged' },
      stringAbi,
    )

    const result = await handler.execute(provider, ADDRESS)
    expect(result.value).toEqual([])
  })
})
