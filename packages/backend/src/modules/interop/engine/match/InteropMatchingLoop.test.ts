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
} from '../../plugins/types'
import { InMemoryEventDb } from '../capture/InMemoryEventDb'
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
  comment: null,
  reviewed: false,
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
        Logger.SILENT,
        mockObject({} as any),
      )

      await expect(async () => await loop.run()).toBeRejectedWith(
        'Token DB unavailable for matching',
      )
      expect(query).toHaveBeenCalledTimes(1)
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
      Logger.SILENT,
      deployedToAbstractMap,
    )

    expect(seen).toEqual(TOKEN_A)
  })
})
