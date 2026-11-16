import { Logger } from '@l2beat/backend-tools'
import type { InteropPluginName } from '@l2beat/config'
import type { AbstractTokenRecord, Database } from '@l2beat/database'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import type { TokenDbClient } from '@l2beat/token-backend'
import { expect, mockFn, mockObject } from 'earl'
import {
  createInteropEventType,
  type InteropEvent,
  type InteropPlugin,
  Result,
} from '../../plugins/types'
import { InMemoryEventDb } from '../capture/InMemoryEventDb'
import type { InteropEventStore } from '../capture/InteropEventStore'
import { InteropMatchingLoop, match } from './InteropMatchingLoop'
import { buildTokenMap, type TokenMap } from './TokenMap'

const TOKEN_A = {
  symbol: 'ABC',
  id: 'TK0001',
  issuer: null,
  category: 'other',
  iconUrl: null,
  coingeckoId: null,
  coingeckoListingTimestamp: null,
  additionalCoingeckoEntries: null,
  comment: null,
  reviewed: false,
  isPriceUnreliable: false,
} satisfies AbstractTokenRecord

describe(InteropMatchingLoop.name, () => {
  describe(buildTokenMap.name, () => {
    it('builds deployed to abstract token map and skips invalid deployed tokens', async () => {
      const validAddress = '0x1111111111111111111111111111111111111111'
      const query = mockFn().resolvesTo({
        abstractTokens: [
          {
            ...TOKEN_A,
            deployedTokens: [
              { chain: 'ethereum', address: validAddress },
              { chain: 'ethereum', address: 'native' },
              { chain: 'unknown-chain', address: validAddress },
            ],
          },
        ],
      })
      const tokenDbClient = mockObject<TokenDbClient>({
        abstractTokens: { getAllWithDeployedTokens: { query } },
      } as any)

      const deployedToAbstractMap = await buildTokenMap(tokenDbClient)

      const chainSpecificAddress = ChainSpecificAddress.fromLong(
        'ethereum',
        validAddress,
      )

      expect(query).toHaveBeenCalledTimes(1)
      expect(deployedToAbstractMap.size).toEqual(1)
      expect(deployedToAbstractMap.get(chainSpecificAddress)).toEqual(TOKEN_A)
    })
  })

  describe(InteropMatchingLoop.prototype.run.name, () => {
    it('throws if loading abstract tokens fails', async () => {
      const queryError = new Error('Token DB unavailable')
      const query = mockFn().rejectsWith(queryError)
      const tokenDbClient = mockObject<TokenDbClient>({
        abstractTokens: { getAllWithDeployedTokens: { query } },
      } as any)

      const loop = new InteropMatchingLoop(
        mockObject({} as any),
        mockObject<Database>({} as any),
        tokenDbClient,
        [],
        [],
        [],
        Logger.SILENT,
      )

      await expect(async () => await loop.run()).toBeRejectedWith(
        'Token DB unavailable for matching',
      )
      expect(query).toHaveBeenCalledTimes(1)
    })

    it('saves a transfer at its own timestamp when it sets one', async () => {
      const Sent = createInteropEventType<{ id: string }>('test.Sent')
      const Settled = createInteropEventType<{ id: string }>('test.Settled')
      const eventDb = new InMemoryEventDb()
      const sent = Sent.mock({ id: 'a' }, 1)
      sent.ctx = { ...sent.ctx, chain: 'ethereum', timestamp: 100 }
      const settled = Settled.mock({ id: 'a' }, 2)
      settled.ctx = { ...settled.ctx, chain: 'ethereum', timestamp: 500 }
      eventDb.addEvent(sent)
      eventDb.addEvent(settled)

      const plugin: InteropPlugin = {
        name: 'mock-plugin' as InteropPluginName,
        matchTypes: [Settled],
        match(event, db) {
          if (!Settled.checkType(event)) return
          const src = db.find(Sent, { id: event.args.id })
          if (!src) return
          return [
            Result.Transfer('test.Transfer', {
              srcEvent: src,
              dstChain: 'solana',
              extraEvents: [event],
              timestamp: event.ctx.timestamp,
            }),
          ]
        },
      }

      const store = mockObject<InteropEventStore>({
        getEvents: (type) => eventDb.getEvents(type),
        getEventTypes: () => eventDb.getEventTypes(),
        getEventCount: () => eventDb.getEventCount(),
        find: (type, query) => eventDb.find(type, query),
        findAll: (type, query) => eventDb.findAll(type, query),
        findApproximate: (type, query, approximate) =>
          eventDb.findApproximate(type, query, approximate),
        updateMatchedAndUnsupported: mockFn().resolvesTo(undefined),
      })
      const interopTransfer = mockObject<Database['interopTransfer']>({
        insertMany: mockFn().resolvesTo(1),
      })
      const db = mockObject<Database>({
        transaction: async (fn) => await fn(),
        interopMessage: mockObject<Database['interopMessage']>({
          insertMany: mockFn().resolvesTo(0),
        }),
        interopTransfer,
      })
      const tokenDbClient = mockObject<TokenDbClient>({
        abstractTokens: {
          getAllWithDeployedTokens: {
            query: mockFn().resolvesTo({ abstractTokens: [] }),
          },
        },
      } as any)

      const loop = new InteropMatchingLoop(
        store,
        db,
        tokenDbClient,
        [plugin],
        ['ethereum'],
        ['solana'],
        Logger.SILENT,
      )
      await loop.run()

      expect(interopTransfer.insertMany).toHaveBeenOnlyCalledWith([
        expect.subset({
          timestamp: 500,
          srcTime: 100,
          dstTime: undefined,
          duration: undefined,
          dstChain: 'solana',
        }),
      ])
    })
  })
})

describe('match', () => {
  it('does not expose already matched events to later matches', async () => {
    const Event = createInteropEventType<{ id: string }>('test.Event')
    const db = new InMemoryEventDb()

    const eventA = Event.mock({ id: 'a' }, 1)
    const eventB = Event.mock({ id: 'b' }, 2)
    const eventC = Event.mock({ id: 'c' }, 3)
    db.addEvent(eventA)
    db.addEvent(eventB)
    db.addEvent(eventC)

    let sawEventC = false
    let matchedLookup: InteropEvent | undefined

    const plugin: InteropPlugin = {
      name: 'mock-plugin' as InteropPluginName,
      matchTypes: [Event],
      match(event, eventDb) {
        if (!Event.checkType(event)) {
          return
        }
        if (event.args.id === 'a') {
          return [
            {
              kind: 'InteropMessage',
              app: 'test-app',
              type: 'test-type',
              events: [event, eventB],
              src: event,
              dst: eventB,
            },
          ]
        }
        if (event.args.id === 'c') {
          sawEventC = true
          // Matched events should not be visible to later match calls.
          matchedLookup = eventDb.find(Event, { id: 'b' })
          if (matchedLookup) {
            return [{ kind: 'InteropIgnore', events: [event, matchedLookup] }]
          }
        }
      },
    }

    const result = await match(
      db,
      (type) => db.getEvents(type),
      db.getEventTypes(),
      db.getEventCount(),
      [plugin],
      [],
      [],
      Logger.SILENT,
      mockObject<TokenMap>({}),
    )

    expect(sawEventC).toEqual(true)
    expect(matchedLookup).toEqual(undefined)
    expect(result.messages.length).toEqual(1)
    expect(result.unsupported.length).toEqual(0)
  })

  it('passes deployed-to-abstract map to plugins', async () => {
    const Event = createInteropEventType<{ id: string }>('test.Event')
    const db = new InMemoryEventDb()

    const event = Event.mock({ id: 'a' }, 1)
    db.addEvent(event)

    const tokenAddress = ChainSpecificAddress.fromLong(
      'ethereum',
      '0x1111111111111111111111111111111111111111',
    )
    let seen: AbstractTokenRecord | undefined

    const plugin: InteropPlugin = {
      name: 'mock-plugin' as InteropPluginName,
      matchTypes: [Event],
      match(event, _eventDb, deployedToAbstractMap) {
        if (!Event.checkType(event)) {
          return
        }
        seen = deployedToAbstractMap.get(tokenAddress)
        return [{ kind: 'InteropIgnore', events: [event] }]
      },
    }

    const deployedToAbstractMap = new Map<
      ChainSpecificAddress,
      AbstractTokenRecord
    >([[tokenAddress, TOKEN_A]])

    await match(
      db,
      (type) => db.getEvents(type),
      db.getEventTypes(),
      db.getEventCount(),
      [plugin],
      [],
      [],
      Logger.SILENT,
      deployedToAbstractMap,
    )

    expect(seen).toEqual(TOKEN_A)
  })

  it('keeps transfers with explicit chain on the missing side', async () => {
    const Event = createInteropEventType<{
      $dstChain: string
    }>('test.Event')
    const db = new InMemoryEventDb()

    const event = Event.mock({ $dstChain: 'solana' }, 1)
    event.ctx = {
      chain: 'ethereum',
      timestamp: 123,
      logIndex: 7,
      txHash: '0xabc',
    }
    db.addEvent(event)

    const plugin: InteropPlugin = {
      name: 'mock-plugin' as InteropPluginName,
      matchTypes: [Event],
      match(event) {
        if (!Event.checkType(event)) {
          return
        }
        return [
          Result.Transfer('test.Transfer', {
            srcEvent: event,
            dstChain: 'solana',
          }),
        ]
      },
    }

    const result = await match(
      db,
      (type) => db.getEvents(type),
      db.getEventTypes(),
      db.getEventCount(),
      [plugin],
      ['ethereum'],
      [],
      Logger.SILENT,
      mockObject<TokenMap>({}),
    )

    expect(result.transfers.length).toEqual(1)
    expect(result.unsupported.length).toEqual(0)

    const transfer = result.transfers[0]
    expect(transfer.src.event?.ctx.chain).toEqual('ethereum')
    expect(transfer.dst.event).toEqual(undefined)
    expect(transfer.dst.chain).toEqual('solana')
  })

  it('does not mark events to or from one-sided chains as unsupported', async () => {
    const Event = createInteropEventType<{
      $srcChain?: string
      $dstChain?: string
    }>('test.Event')
    const db = new InMemoryEventDb()

    const toOneSided = Event.mock({ $dstChain: 'solana' }, 1)
    const fromOneSided = Event.mock({ $srcChain: 'solana' }, 2)
    const toUnknown = Event.mock({ $dstChain: 'sui' }, 3)
    db.addEvent(toOneSided)
    db.addEvent(fromOneSided)
    db.addEvent(toUnknown)

    const plugin: InteropPlugin = {
      name: 'mock-plugin' as InteropPluginName,
      matchTypes: [Event],
      match() {
        return undefined
      },
    }

    const result = await match(
      db,
      (type) => db.getEvents(type),
      db.getEventTypes(),
      db.getEventCount(),
      [plugin],
      ['ethereum'],
      ['solana'],
      Logger.SILENT,
      mockObject<TokenMap>({}),
    )

    expect(result.unsupported).toEqual([toUnknown])
  })
})
