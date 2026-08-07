import { assert, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import {
  type InteropMessageRecord,
  InteropMessageRepository,
} from './InteropMessageRepository'

const makeRecord = (
  baseTime: UnixTime,
  overrides: Partial<InteropMessageRecord> = {},
): InteropMessageRecord => {
  const timestamp = overrides.timestamp ?? baseTime
  const duration = overrides.duration ?? 100
  const srcTime = overrides.srcTime ?? timestamp
  const dstTime = overrides.dstTime ?? srcTime + duration

  return {
    plugin: 'plugin',
    messageId: 'msg',
    type: 'message',
    app: 'app',
    duration,
    timestamp,
    srcTime,
    srcChain: 'ethereum',
    srcTxHash: '0x123',
    srcLogIndex: 0,
    srcEventId: 'event1',
    dstTime,
    dstChain: 'arbitrum',
    dstTxHash: '0x456',
    dstLogIndex: 0,
    dstEventId: 'event2',
    ...overrides,
  }
}

describeDatabase(InteropMessageRepository.name, (database) => {
  const repository = database.interopMessage

  beforeEach(async () => {
    await repository.deleteAll()
  })

  describe(InteropMessageRepository.prototype.getStats.name, () => {
    it('returns stats grouped by message type with multiple known apps', async () => {
      const now = UnixTime.now()
      const records: InteropMessageRecord[] = [
        makeRecord(now, {
          messageId: 'msg1',
          app: 'arbitrum',
          duration: 100,
          dstChain: 'arbitrum',
        }),
        makeRecord(now, {
          messageId: 'msg2',
          app: 'optimism',
          duration: 200,
          timestamp: now + UnixTime.HOUR,
          dstChain: 'optimism',
        }),
        makeRecord(now, {
          messageId: 'msg3',
          app: 'polygon',
          duration: 150,
          timestamp: now + UnixTime.MINUTE * 30,
          dstChain: 'polygon',
        }),
        makeRecord(now, {
          messageId: 'msg4',
          type: 'swap',
          app: 'arbitrum',
          duration: 300,
          timestamp: now + UnixTime.HOUR * 2,
          srcChain: 'arbitrum',
          dstChain: 'ethereum',
        }),
      ]

      await repository.insertMany(records)
      const result = await repository.getStats()

      expect(result).toHaveLength(2)

      const stats = result.find((s) => s.type === 'message')
      assert(stats)

      expect(stats.plugin).toEqual('plugin')
      expect(stats.type).toEqual('message')
      expect(stats.count).toEqual(3)
      expect(stats.knownAppCount).toEqual(3)
      expect(stats.avgDuration).toEqual(150)

      const swapStats = result.find((s) => s.type === 'swap')
      assert(swapStats)
      expect(swapStats.plugin).toEqual('plugin')
      expect(swapStats.type).toEqual('swap')
      expect(swapStats.count).toEqual(1)
      expect(swapStats.knownAppCount).toEqual(1)
      expect(swapStats.avgDuration).toEqual(300)
    })
  })

  describe(InteropMessageRepository.prototype.getByType.name, () => {
    it('filters records by plugin when provided', async () => {
      const now = UnixTime.now()
      const records: InteropMessageRecord[] = [
        makeRecord(now, {
          plugin: 'plugin-a',
          messageId: 'msg1',
          type: 'shared-type',
        }),
        makeRecord(now + UnixTime.MINUTE, {
          plugin: 'plugin-b',
          messageId: 'msg2',
          type: 'shared-type',
        }),
      ]

      await repository.insertMany(records)

      const filtered = await repository.getByType('shared-type', {
        plugin: 'plugin-a',
      })

      expect(filtered).toHaveLength(1)
      expect(filtered[0]?.plugin).toEqual('plugin-a')
      expect(filtered[0]?.messageId).toEqual('msg1')
    })
  })

  describe(InteropMessageRepository.prototype.getExistingItems.name, () => {
    const baseTime = UnixTime(1_000_000)

    it('returns rows that match the requested src/dst pairs', async () => {
      await repository.insertMany([
        makeRecord(baseTime, {
          messageId: 'msg1',
          srcTxHash: '0xa',
          dstTxHash: '0xx',
        }),
        makeRecord(baseTime, {
          messageId: 'msg2',
          srcTxHash: '0xb',
          dstTxHash: '0xy',
        }),
      ])

      const result = await repository.getExistingItems([
        { srcTxHash: '0xa', dstTxHash: '0xx' },
        { srcTxHash: '0xb', dstTxHash: '0xy' },
      ])

      expect(result.map((r) => r.messageId)).toEqualUnsorted(['msg1', 'msg2'])
    })

    it('does not return rows that only cross-match individual hashes', async () => {
      await repository.insertMany([
        makeRecord(baseTime, {
          messageId: 'msg1',
          srcTxHash: '0xa',
          dstTxHash: '0xx',
        }),
        makeRecord(baseTime, {
          messageId: 'msg2',
          srcTxHash: '0xb',
          dstTxHash: '0xy',
        }),
        // Trap row: src is in the requested src list, dst is in the requested
        // dst list, but the pair (A, Y) was never asked for.
        makeRecord(baseTime, {
          messageId: 'msg3',
          srcTxHash: '0xa',
          dstTxHash: '0xy',
        }),
      ])

      const result = await repository.getExistingItems([
        { srcTxHash: '0xa', dstTxHash: '0xx' },
        { srcTxHash: '0xb', dstTxHash: '0xy' },
      ])

      expect(result.map((r) => r.messageId)).toEqualUnsorted(['msg1', 'msg2'])
    })

    it('lowercases input tx hashes when matching', async () => {
      await repository.insertMany([
        makeRecord(baseTime, {
          messageId: 'msg1',
          srcTxHash: '0xabc',
          dstTxHash: '0xdef',
        }),
      ])

      const result = await repository.getExistingItems([
        { srcTxHash: '0xABC', dstTxHash: '0xDEF' },
      ])

      expect(result.map((r) => r.messageId)).toEqual(['msg1'])
    })

    it('returns empty array for empty input', async () => {
      const result = await repository.getExistingItems([])
      expect(result).toEqual([])
    })
  })

  describe(InteropMessageRepository.prototype.deleteForPlugin.name, () => {
    it('deletes only records for the given plugin', async () => {
      const now = UnixTime.now()
      const records: InteropMessageRecord[] = [
        makeRecord(now, {
          plugin: 'plugin-a',
          messageId: 'msg1',
          app: 'app-a',
          duration: 100,
          dstChain: 'arbitrum',
        }),
        makeRecord(now, {
          plugin: 'plugin-a',
          messageId: 'msg2',
          type: 'swap',
          app: 'app-b',
          duration: 200,
          timestamp: now + UnixTime.MINUTE,
          srcChain: 'arbitrum',
          dstChain: 'ethereum',
        }),
        makeRecord(now, {
          plugin: 'plugin-b',
          messageId: 'msg3',
          app: 'app-c',
          duration: 150,
          timestamp: now + UnixTime.HOUR,
          dstChain: 'optimism',
        }),
      ]

      await repository.insertMany(records)

      const deleted = await repository.deleteForPlugin('plugin-a')
      expect(deleted).toEqual(2)

      const remaining = await repository.getAll()
      expect(remaining).toHaveLength(1)
      expect(remaining[0]?.plugin).toEqual('plugin-b')
      expect(remaining[0]?.messageId).toEqual('msg3')
    })
  })

  describe(InteropMessageRepository.prototype.getPage.name, () => {
    const base = UnixTime(1_700_000_000)

    beforeEach(async () => {
      await repository.insertMany([
        makeRecord(base, {
          messageId: 'b',
          timestamp: base,
          plugin: 'across',
          type: 'across.Message',
        }),
        // Same timestamp as 'b' - messageId decides the order.
        makeRecord(base, {
          messageId: 'a',
          timestamp: base,
          plugin: 'across',
          type: 'across.Message',
        }),
        makeRecord(base, {
          messageId: 'c',
          timestamp: base + 100,
          plugin: 'across',
          type: 'across.Message',
          app: 'other-app',
          srcChain: 'base',
          dstChain: 'optimism',
        }),
        makeRecord(base, {
          messageId: 'd',
          timestamp: base + 200,
          plugin: 'cctp',
          type: 'cctp.Message',
        }),
      ])
    })

    it('orders by timestamp then messageId, descending', async () => {
      const result = await repository.getPage({
        filter: { plugin: 'across' },
        order: 'desc',
        limit: 10,
      })

      expect(result.map((r) => r.messageId)).toEqual(['c', 'b', 'a'])
    })

    it('orders by timestamp then messageId, ascending', async () => {
      const result = await repository.getPage({
        filter: { plugin: 'across' },
        order: 'asc',
        limit: 10,
      })

      expect(result.map((r) => r.messageId)).toEqual(['a', 'b', 'c'])
    })

    it('walks every row exactly once across pages, breaking timestamp ties', async () => {
      const seen: string[] = []
      let cursor: { timestamp: UnixTime; messageId: string } | undefined

      for (let page = 0; page < 5; page++) {
        const rows = await repository.getPage({
          filter: { plugin: 'across' },
          order: 'desc',
          limit: 1,
          cursor,
        })
        if (rows.length === 0) break

        const last = rows[rows.length - 1]
        assert(last)
        seen.push(last.messageId)
        cursor = { timestamp: last.timestamp, messageId: last.messageId }
      }

      expect(seen).toEqual(['c', 'b', 'a'])
    })

    it('resumes ascending walks from the cursor', async () => {
      const result = await repository.getPage({
        filter: { plugin: 'across' },
        order: 'asc',
        limit: 10,
        cursor: { timestamp: base, messageId: 'a' },
      })

      expect(result.map((r) => r.messageId)).toEqual(['b', 'c'])
    })

    it('respects the limit', async () => {
      const result = await repository.getPage({
        filter: { plugin: 'across' },
        order: 'desc',
        limit: 2,
      })

      expect(result.map((r) => r.messageId)).toEqual(['c', 'b'])
    })

    it('scopes results to the plugin', async () => {
      const result = await repository.getPage({
        filter: { plugin: 'cctp' },
        order: 'desc',
        limit: 10,
      })

      expect(result.map((r) => r.messageId)).toEqual(['d'])
    })

    it('filters by type, app and chains', async () => {
      expect(
        (
          await repository.getPage({
            filter: { plugin: 'across', type: 'cctp.Message' },
            order: 'desc',
            limit: 10,
          })
        ).map((r) => r.messageId),
      ).toEqual([])

      expect(
        (
          await repository.getPage({
            filter: { plugin: 'across', app: 'other-app' },
            order: 'desc',
            limit: 10,
          })
        ).map((r) => r.messageId),
      ).toEqual(['c'])

      expect(
        (
          await repository.getPage({
            filter: {
              plugin: 'across',
              srcChain: 'base',
              dstChain: 'optimism',
            },
            order: 'desc',
            limit: 10,
          })
        ).map((r) => r.messageId),
      ).toEqual(['c'])
    })

    it('treats from as inclusive and to as exclusive', async () => {
      const result = await repository.getPage({
        filter: { plugin: 'across', from: base, to: base + 100 },
        order: 'asc',
        limit: 10,
      })

      expect(result.map((r) => r.messageId)).toEqual(['a', 'b'])
    })

    it('rejects a non-positive limit', async () => {
      await expect(
        repository.getPage({
          filter: { plugin: 'across' },
          order: 'desc',
          limit: 0,
        }),
      ).toBeRejectedWith('limit must be a positive number')
    })
  })

  describe(InteropMessageRepository.prototype.hasPlugin.name, () => {
    it('distinguishes a plugin with data from one without', async () => {
      await repository.insertMany([
        makeRecord(UnixTime(1_700_000_000), {
          messageId: 'msg1',
          plugin: 'across',
        }),
      ])

      expect(await repository.hasPlugin('across')).toEqual(true)
      expect(await repository.hasPlugin('acros')).toEqual(false)
    })
  })

  describe(InteropMessageRepository.prototype.getTypeSummary.name, () => {
    it('returns counts and the retained timestamp span per plugin and type', async () => {
      const base = UnixTime(1_700_000_000)
      await repository.insertMany([
        makeRecord(base, {
          messageId: 'msg1',
          plugin: 'across',
          type: 'across.Message',
          timestamp: base,
        }),
        makeRecord(base, {
          messageId: 'msg2',
          plugin: 'across',
          type: 'across.Message',
          timestamp: base + 500,
        }),
        makeRecord(base, {
          messageId: 'msg3',
          plugin: 'cctp',
          type: 'cctp.Message',
          timestamp: base + 700,
        }),
      ])

      const result = await repository.getTypeSummary()

      expect(result).toEqualUnsorted([
        {
          plugin: 'across',
          type: 'across.Message',
          count: 2,
          oldestTimestamp: base,
          newestTimestamp: base + 500,
        },
        {
          plugin: 'cctp',
          type: 'cctp.Message',
          count: 1,
          oldestTimestamp: base + 700,
          newestTimestamp: base + 700,
        },
      ])
    })

    it('returns an empty array when there is no data', async () => {
      expect(await repository.getTypeSummary()).toEqual([])
    })
  })
})
