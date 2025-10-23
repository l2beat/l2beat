import { assert, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import {
  type InteropMessageRecord,
  InteropMessageRepository,
} from './InteropMessageRepository'

describeDatabase(InteropMessageRepository.name, (database) => {
  const repository = database.interopMessage

  beforeEach(async () => {
    await repository.deleteAll()
  })

  describe(InteropMessageRepository.prototype.getStats.name, () => {
    it('returns stats grouped by message type with multiple known apps', async () => {
      const now = UnixTime.now()
      const records: InteropMessageRecord[] = [
        {
          plugin: 'plugin',
          messageId: 'msg1',
          type: 'message',
          app: 'arbitrum',
          duration: 100,
          timestamp: now,
          srcTime: now,
          srcChain: 'ethereum',
          srcTxHash: '0x123',
          srcLogIndex: 0,
          srcEventId: 'event1',
          dstTime: now + 100,
          dstChain: 'arbitrum',
          dstTxHash: '0x456',
          dstLogIndex: 0,
          dstEventId: 'event2',
        },
        {
          plugin: 'plugin',
          messageId: 'msg2',
          type: 'message',
          app: 'optimism',
          duration: 200,
          timestamp: now + UnixTime.HOUR,
          srcTime: now + UnixTime.HOUR,
          srcChain: 'ethereum',
          srcTxHash: '0x789',
          srcLogIndex: 1,
          srcEventId: 'event3',
          dstTime: now + UnixTime.HOUR + 200,
          dstChain: 'optimism',
          dstTxHash: '0xabc',
          dstLogIndex: 1,
          dstEventId: 'event4',
        },
        {
          plugin: 'plugin',
          messageId: 'msg3',
          type: 'message',
          app: 'polygon',
          duration: 150,
          timestamp: now + UnixTime.MINUTE * 30,
          srcTime: now + UnixTime.MINUTE * 30,
          srcChain: 'ethereum',
          srcTxHash: '0xdef',
          srcLogIndex: 2,
          srcEventId: 'event5',
          dstTime: now + UnixTime.MINUTE * 30 + 150,
          dstChain: 'polygon',
          dstTxHash: '0xghi',
          dstLogIndex: 2,
          dstEventId: 'event6',
        },
        {
          plugin: 'plugin',
          messageId: 'msg4',
          type: 'swap',
          app: 'arbitrum',
          duration: 300,
          timestamp: now + UnixTime.HOUR * 2,
          srcTime: now + UnixTime.HOUR * 2,
          srcChain: 'arbitrum',
          srcTxHash: '0xjkl',
          srcLogIndex: 3,
          srcEventId: 'event7',
          dstTime: now + UnixTime.HOUR * 2 + 300,
          dstChain: 'ethereum',
          dstTxHash: '0xmno',
          dstLogIndex: 3,
          dstEventId: 'event8',
        },
      ]

      await repository.insertMany(records)
      const result = await repository.getStats()

      expect(result).toHaveLength(2)

      const stats = result.find((s) => s.type === 'message')
      assert(stats)

      expect(stats.type).toEqual('message')
      expect(stats.count).toEqual(3)
      expect(stats.knownAppCount).toEqual(3)
      expect(stats.medianDuration).toEqual(150)
      expect(stats.knownApps).toEqualUnsorted([
        'arbitrum',
        'optimism',
        'polygon',
      ])

      const swapStats = result.find((s) => s.type === 'swap')
      assert(swapStats)
      expect(swapStats.type).toEqual('swap')
      expect(swapStats.count).toEqual(1)
      expect(swapStats.knownAppCount).toEqual(1)
      expect(swapStats.knownApps).toEqual(['arbitrum'])
      expect(swapStats.medianDuration).toEqual(300)
    })
  })
})
