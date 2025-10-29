import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import {
  type InteropEventRecord,
  InteropEventRepository,
} from './InteropEventRepository'

describeDatabase(InteropEventRepository.name, (db) => {
  const repository = db.interopEvent

  describe(InteropEventRepository.prototype.insertMany.name, () => {
    it('adds new rows', async () => {
      const records = [
        event('plugin1', 'event1', 'deposit', UnixTime(100), UnixTime(200), {
          args: { a: 1 },
        }),
        event('plugin2', 'event2', 'withdraw', UnixTime(150), UnixTime(250), {
          args: { a: 2 },
        }),
      ]

      const inserted = await repository.insertMany(records)
      expect(inserted).toEqual(2)

      const result = await repository.getAll()
      expect(result).toEqualUnsorted(records)
    })

    it('handles empty array', async () => {
      const inserted = await repository.insertMany([])
      expect(inserted).toEqual(0)
    })

    it('performs batch insert when more than 2000 records', async () => {
      const records = []
      for (let i = 0; i < 2500; i++) {
        records.push(
          event(
            'plugin',
            `event${i}`,
            'deposit',
            UnixTime(i),
            UnixTime(i + 100),
          ),
        )
      }

      const inserted = await repository.insertMany(records)
      expect(inserted).toEqual(2500)
    })

    it('handles records with undefined txTo', async () => {
      const record = event(
        'plugin1',
        'event1',
        'deposit',
        UnixTime(100),
        UnixTime(200),
      )
      record.txTo = undefined

      const inserted = await repository.insertMany([record])
      expect(inserted).toEqual(1)

      const result = await repository.getAll()
      expect(result).toEqual([record])
    })
  })

  describe(InteropEventRepository.prototype.getUnmatched.name, () => {
    beforeEach(async () => {
      await repository.insertMany([
        event('plugin1', 'event1', 'deposit', UnixTime(100), UnixTime(200), {
          matched: false,
          unsupported: false,
        }),
        event('plugin1', 'event2', 'deposit', UnixTime(150), UnixTime(250), {
          matched: true,
          unsupported: false,
        }),
        event('plugin1', 'event3', 'withdraw', UnixTime(200), UnixTime(300), {
          matched: false,
          unsupported: true,
        }),
        event('plugin1', 'event4', 'deposit', UnixTime(250), UnixTime(350), {
          matched: false,
          unsupported: false,
        }),
      ])
    })

    it('returns only unmatched and supported events', async () => {
      const result = await repository.getUnmatched()

      expect(result).toHaveLength(2)
      expect(result.map((r) => r.eventId)).toEqualUnsorted(['event1', 'event4'])
      result.forEach((event) => {
        expect(event.matched).toEqual(false)
        expect(event.unsupported).toEqual(false)
      })
    })
  })

  describe(InteropEventRepository.prototype.getByType.name, () => {
    beforeEach(async () => {
      await repository.insertMany([
        event('plugin1', 'event1', 'deposit', UnixTime(100), UnixTime(200), {
          matched: false,
          unsupported: false,
        }),
        event('plugin1', 'event2', 'deposit', UnixTime(200), UnixTime(300), {
          matched: true,
          unsupported: false,
        }),
        event('plugin2', 'event3', 'withdraw', UnixTime(150), UnixTime(250), {
          matched: false,
          unsupported: true,
        }),
        event('plugin2', 'event4', 'deposit', UnixTime(300), UnixTime(400), {
          matched: false,
          unsupported: false,
        }),
      ])
    })

    it('returns events for a specific type', async () => {
      const result = await repository.getByType('deposit')

      expect(result).toHaveLength(3)
      expect(result.map((r) => r.eventId)).toEqualUnsorted([
        'event1',
        'event2',
        'event4',
      ])
    })

    it('returns events ordered by timestamp descending', async () => {
      const result = await repository.getByType('deposit')

      expect(result.map((r) => r.timestamp)).toEqual([300, 200, 100])
    })

    it('filters by matched status when provided', async () => {
      const result = await repository.getByType('deposit', { matched: true })

      expect(result).toHaveLength(1)
      expect(result[0]?.eventId).toEqual('event2')
    })

    it('filters by unsupported status when provided', async () => {
      const result = await repository.getByType('withdraw', {
        unsupported: true,
      })

      expect(result).toHaveLength(1)
      expect(result[0]?.eventId).toEqual('event3')
    })

    it('filters by old cutoff when provided', async () => {
      const result = await repository.getByType('deposit', {
        oldCutoff: UnixTime(250),
      })

      expect(result).toHaveLength(2)
      expect(result.map((r) => r.eventId)).toEqualUnsorted(['event1', 'event2'])
    })

    it('combines multiple filters', async () => {
      const result = await repository.getByType('deposit', {
        matched: false,
        unsupported: false,
      })

      expect(result).toHaveLength(2)
      expect(result.map((r) => r.eventId)).toEqualUnsorted(['event1', 'event4'])
    })

    it('returns empty array when no events match type', async () => {
      const result = await repository.getByType('nonexistent')

      expect(result).toEqual([])
    })
  })

  describe(InteropEventRepository.prototype.getExpired.name, () => {
    beforeEach(async () => {
      await repository.insertMany([
        event('plugin1', 'event1', 'deposit', UnixTime(100), UnixTime(200)),
        event('plugin1', 'event2', 'deposit', UnixTime(150), UnixTime(250)),
        event('plugin1', 'event3', 'withdraw', UnixTime(200), UnixTime(300)),
        event('plugin1', 'event4', 'deposit', UnixTime(250), UnixTime(400)),
      ])
    })

    it('returns events that have expired', async () => {
      const result = await repository.getExpired(UnixTime(350))

      expect(result).toHaveLength(3)
      expect(result.map((r) => r.eventId)).toEqualUnsorted([
        'event1',
        'event2',
        'event3',
      ])
    })

    it('returns empty array when no events have expired', async () => {
      const result = await repository.getExpired(UnixTime(100))

      expect(result).toEqual([])
    })
  })

  describe(InteropEventRepository.prototype.updateMatched.name, () => {
    beforeEach(async () => {
      await repository.insertMany([
        event('plugin1', 'event1', 'deposit', UnixTime(100), UnixTime(200), {
          matched: false,
        }),
        event('plugin1', 'event2', 'deposit', UnixTime(150), UnixTime(250), {
          matched: false,
        }),
        event('plugin1', 'event3', 'withdraw', UnixTime(200), UnixTime(300), {
          matched: false,
        }),
      ])
    })

    it('updates matched status for specified event IDs', async () => {
      await repository.updateMatched(['event1', 'event3'])

      const events = await repository.getAll()
      const event1 = events.find((e) => e.eventId === 'event1')
      const event2 = events.find((e) => e.eventId === 'event2')
      const event3 = events.find((e) => e.eventId === 'event3')

      expect(event1?.matched).toEqual(true)
      expect(event2?.matched).toEqual(false)
      expect(event3?.matched).toEqual(true)
    })

    it('handles empty array', async () => {
      await repository.updateMatched([])

      const events = await repository.getAll()
      events.forEach((event) => {
        expect(event.matched).toEqual(false)
      })
    })

    it('performs batch update when more than 2000 event IDs', async () => {
      await repository.deleteAll()
      const eventIds = []
      const records = []
      for (let i = 0; i < 2500; i++) {
        const eventId = `event${i}`
        eventIds.push(eventId)
        records.push(
          event('plugin', eventId, 'deposit', UnixTime(i), UnixTime(i + 100), {
            matched: false,
          }),
        )
      }

      await repository.insertMany(records)
      await repository.updateMatched(eventIds)

      const events = await repository.getAll()
      events.forEach((event) => {
        expect(event.matched).toEqual(true)
      })
    })
  })

  describe(InteropEventRepository.prototype.updateUnsupported.name, () => {
    beforeEach(async () => {
      await repository.insertMany([
        event('plugin1', 'event1', 'deposit', UnixTime(100), UnixTime(200), {
          unsupported: false,
        }),
        event('plugin1', 'event2', 'deposit', UnixTime(150), UnixTime(250), {
          unsupported: false,
        }),
        event('plugin1', 'event3', 'withdraw', UnixTime(200), UnixTime(300), {
          unsupported: false,
        }),
      ])
    })

    it('updates unsupported status for specified event IDs', async () => {
      await repository.updateUnsupported(['event1', 'event3'])

      const events = await repository.getAll()
      const event1 = events.find((e) => e.eventId === 'event1')
      const event2 = events.find((e) => e.eventId === 'event2')
      const event3 = events.find((e) => e.eventId === 'event3')

      expect(event1?.unsupported).toEqual(true)
      expect(event2?.unsupported).toEqual(false)
      expect(event3?.unsupported).toEqual(true)
    })

    it('handles empty array', async () => {
      await repository.updateUnsupported([])

      const events = await repository.getAll()
      events.forEach((event) => {
        expect(event.unsupported).toEqual(false)
      })
    })

    it('performs batch update when more than 2000 event IDs', async () => {
      await repository.deleteAll()
      const eventIds = []
      const records = []
      for (let i = 0; i < 2500; i++) {
        const eventId = `event${i}`
        eventIds.push(eventId)
        records.push(
          event('plugin', eventId, 'deposit', UnixTime(i), UnixTime(i + 100), {
            unsupported: false,
          }),
        )
      }

      await repository.insertMany(records)
      await repository.updateUnsupported(eventIds)

      const events = await repository.getAll()
      events.forEach((event) => {
        expect(event.unsupported).toEqual(true)
      })
    })
  })

  describe(InteropEventRepository.prototype.deleteExpired.name, () => {
    it('deletes events that have expired', async () => {
      await repository.insertMany([
        event('plugin1', 'event1', 'deposit', UnixTime(100), UnixTime(200)),
        event('plugin1', 'event2', 'deposit', UnixTime(150), UnixTime(250)),
        event('plugin1', 'event3', 'withdraw', UnixTime(200), UnixTime(300)),
        event('plugin1', 'event4', 'deposit', UnixTime(250), UnixTime(400)),
      ])

      const deleted = await repository.deleteExpired(UnixTime(350))

      expect(deleted).toEqual(3)

      const remaining = await repository.getAll()
      expect(remaining).toHaveLength(1)
      expect(remaining[0]?.eventId).toEqual('event4')
    })

    it('returns 0 when no events are expired', async () => {
      await repository.insertMany([
        event('plugin1', 'event1', 'deposit', UnixTime(100), UnixTime(200)),
        event('plugin1', 'event2', 'deposit', UnixTime(150), UnixTime(250)),
      ])

      const deleted = await repository.deleteExpired(UnixTime(100))

      expect(deleted).toEqual(0)

      const remaining = await repository.getAll()
      expect(remaining).toHaveLength(2)
    })
  })

  afterEach(async () => {
    await repository.deleteAll()
  })
})

function event(
  plugin: string,
  eventId: string,
  type: string,
  timestamp: UnixTime,
  expiresAt: UnixTime,
  overrides: Partial<InteropEventRecord> = {},
): InteropEventRecord {
  return {
    plugin,
    eventId,
    type,
    expiresAt,
    timestamp,
    chain: 'ethereum',
    blockNumber: 12345,
    blockHash: `0x${eventId}blockhash`,
    txHash: `0x${eventId}txhash`,
    value: 111111n,
    txTo: EthereumAddress.random(),
    calldata: '0x',
    logIndex: 0,
    matched: false,
    unsupported: false,
    args: { amount: '1000000000000000000' },
    ...overrides,
  }
}
