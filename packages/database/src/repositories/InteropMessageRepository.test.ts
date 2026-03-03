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
})
